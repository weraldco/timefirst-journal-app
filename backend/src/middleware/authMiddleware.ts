import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { supabase } from '../config/supabase';

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.cookies.access_token;

	if (!token) return res.status(401).json({ error: 'Not authenticated!' });
	try {
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser(token);

		if (!user) return res.status(401).json({ error: 'Not authenticated!' });
		const prismaUser = await prisma.user.findUnique({
			where: { id: user.id },
		});

		if (!prismaUser) return res.status(401).json({ error: 'User not found!' });
		req.user = prismaUser;
		next();
	} catch (error) {
		return res.status(401).json({ error: 'Invalid or expired token!' });
	}
};
