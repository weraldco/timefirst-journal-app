import { createClient } from '@supabase/supabase-js';
import { CookieOptions, Request, Response } from 'express';
import { prisma } from '../config/database';

const supabase = createClient(
	process.env.SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Standard cookie options for all auth cookies
const cookieOptions: CookieOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as
		| 'none'
		| 'lax',
	path: '/',
};

interface SupabaseTokenResponse {
	access_token: string;
	refresh_token: string;
	user: {
		id: string;
		email: string;
		user_metadata?: { displayName?: string };
		[key: string]: any;
	};
	error?: string;
	error_description?: string;
}

// Sign-up
export const signUp = async (req: Request, res: Response) => {
	const { email, name, password } = req.body;
	if (!email || !password || !name)
		return res.status(400).json({ error: 'Missing required fields!' });

	try {
		// Create user in supabase
		const { data: supabaseUser, error } = await supabase.auth.admin.createUser({
			email,
			password,
			user_metadata: { displayName: name },
		});

		if (error) return res.status(409).json({ error: error.message });
		if (!supabaseUser.user || !supabaseUser.user.id) {
			return res.status(500).json({ error: 'Supabase user creation failed' });
		}
		// Create prisma user
		const prismaUser = await prisma.user.create({
			data: {
				id: supabaseUser.user.id,
				email: supabaseUser.user.email!,
				name,
			},
		});
		return res.status(201).json({
			message: 'Successfully created new user',
			user: {
				id: prismaUser.id,
				email: prismaUser.email,
				name: prismaUser.name,
			},
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Internal server error' });
	}
};
// Sign-in
export const signIn = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	if (!email || !password)
		return res.status(400).json({ error: 'Missing email or password' });

	try {
		const response = await fetch(
			`${process.env.SUPABASE_URL}/auth/v1/token?grant_type=password`,
			{
				method: 'POST',
				headers: {
					apikey: process.env.SUPABASE_ANON_KEY!,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			}
		);

		if (!response.ok) {
			const errorData: any = await response.json();
			return res.status(response.status).json({
				error: 'Incorrect email or password',
			});
		}
		const data = (await response.json()) as SupabaseTokenResponse;
		if (data.error)
			return res.status(401).json({ error: data.error_description });

		res.cookie('access_token', data.access_token, {
			...cookieOptions,
			maxAge: 60 * 60 * 1000,
		});
		res.cookie('refresh_token', data.refresh_token, {
			...cookieOptions,
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		let prismaUser = await prisma.user.findUnique({
			where: { id: data.user.id },
		});
		// Fetch Prisma user
		if (!prismaUser) {
			prismaUser = await prisma.user.create({
				data: {
					id: data.user.id,
					email: data.user.email,
					name: data.user.user_metadata?.displayName || '',
				},
			});
		}

		return res.json({
			user: {
				id: prismaUser.id,
				email: prismaUser.email,
				name: prismaUser.name,
			},
			message: 'Successfully signed in!',
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: 'Internal server error' });
	}
};
// Sign-out
export const signOut = async (req: Request, res: Response) => {
	try {
		const accessToken = req.cookies.access_token;

		if (accessToken) {
			const { error } = await supabase.auth.admin.signOut(accessToken);

			if (error) {
				console.error('Supabase admin signout failed', error);
			}
		}
		// Clear cookies
		// 1. Clear access_token
		res.clearCookie('access_token', cookieOptions);

		// 2. Clear refresh_token
		res.clearCookie('refresh_token', cookieOptions);

		return res.json({ message: 'Logged out successfully!' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Internal server error' });
	}
};

// refresh
export const refresh = async (req: Request, res: Response) => {
	const refreshToken = req.cookies.refresh_token;
	if (!refreshToken)
		return res.status(401).json({ error: 'Not authenticated!' });

	try {
		const response = await fetch(
			`${process.env.SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,
			{
				method: 'POST',
				headers: {
					apikey: process.env.SUPABASE_ANON_KEY!,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					refresh_token: refreshToken,
				}),
			}
		);

		if (!response.ok)
			return res
				.status(401)
				.json({ error: 'Invalid or expired refresh token!' });

		const data: any = await response.json();

		res.cookie('access_token', data.access_token, {
			...cookieOptions,
			maxAge: 60 * 60 * 1000,
		});

		res.cookie('refresh_token', data.refresh_token, {
			...cookieOptions,
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		let prismaUser = await prisma.user.findUnique({
			where: { id: data.user.id },
		});

		// Prisma upsert to ensure user exists
		if (!prismaUser) {
			prismaUser = await prisma.user.create({
				data: {
					id: data.user.id,
					email: data.user.email,
					name: data.user.user_metadata?.displayName || '',
				},
			});
		}

		return res.json({
			message: 'Token refreshed successfully!',
			user: {
				id: prismaUser.id,
				email: prismaUser.email,
				name: prismaUser.name,
			},
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: 'Refresh failed' });
	}
};
// getCurrentUser

export const me = async (req: Request, res: Response) => {
	try {
		const accessToken = req.cookies.access_token;
		if (!accessToken)
			return res.status(401).json({ message: 'Not authenticated!' });

		// verifying token manually
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser(accessToken);

		if (error || !user) return res.status(401).json({ error: 'Invalid token' });

		// fetch from Prisma
		const prismaUser = await prisma.user.findUnique({ where: { id: user.id } });

		if (!prismaUser) return res.status(404).json({ error: 'User not found!' });

		return res.status(200).json({
			user: {
				id: prismaUser.id,
				email: prismaUser.email,
				name: prismaUser.name,
			},
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Internal Server Error!' });
	}
};
