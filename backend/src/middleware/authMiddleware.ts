import { NextFunction, Request, Response } from 'express';
import { prisma } from '../config/database';
import { supabase } from '../config/supabase';

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const authHeader = req.headers.authorization;
	if(!authHeader?.startsWith('Bearer ')) {
		return res.status(401).json({error: "No token provided"})
	}
	const token = authHeader.split(' ')[1];
	if (!token) return res.status(401).json({ error: 'Not authenticated' });
	
	try {
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser(token);
		if (error || !user) return res.status(401).json({ error: 'Invalid token' });

		// Optional: fetch full Prisma user
		const prismaUser = await prisma.user.findUnique({ where: { id: user.id } });
		if (!prismaUser) return res.status(404).json({ error: 'User not found' });

		req.user = prismaUser; // now strongly typed if you extend Express.Request

		next(); // allow access to the route
	} catch (error) {
		return res.status(401).json({ message: 'Token invalid' });
	}
};
