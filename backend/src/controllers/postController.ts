import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../middleware/errorHandler';
import { postService } from '../services/postService';

export const postController = {
	getAll: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const posts = await postService.getAll();
			res.status(200).json({ success: true, data: posts });
		} catch (error) {
			next(error);
		}
	},

	getById: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { id } = req.params;
			if (!id) {
				return res.status(400).json({ success: false, message: 'Missing ID parameter' });
			}
			const post = await postService.getById(id);
			res.status(200).json({ success: true, data: post });
		} catch (error) {
			const err = error as Error;
			if (err.message === 'Post not found') {
				const notFoundError: ApiError = new Error('Post not found');
				notFoundError.statusCode = 404;
				return next(notFoundError);
			}
			next(error);
		}
	},

	getMy: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.user?.id;
			if (!userId) {
				return res.status(401).json({ error: 'User Unauthorized' });
			}
			const posts = await postService.getMy(userId);
			res.status(200).json({ success: true, data: posts });
		} catch (error) {
			next(error);
		}
	},

	create: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.user?.id as string;
			const { title, description, imageUrl, tags, type, date } = req.body;

			if (!title || !description || !type) {
				return res.status(400).json({ error: 'Title, description, and type are required' });
			}

			const post = await postService.create({
				title,
				description,
				imageUrl: imageUrl ?? null,
				tags: tags ?? [],
				type,
				date: date ? new Date(date) : new Date(),
				userId,
			});

			res.status(201).json({ success: true, data: post });
		} catch (error) {
			next(error);
		}
	},

	update: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.user?.id as string;
			const { id } = req.params;
			const { title, description, imageUrl, tags, type, date } = req.body;

			if (!id) {
				return res.status(400).json({ success: false, message: 'Missing ID parameter' });
			}

			const post = await postService.update(id, userId, {
				title,
				description,
				imageUrl,
				tags,
				type,
				date: date ? new Date(date) : new Date(),
			});

			res.status(200).json({ success: true, data: post });
		} catch (error) {
			const err = error as Error;
			if (err.message === 'Post not found') {
				const notFoundError: ApiError = new Error('Post not found');
				notFoundError.statusCode = 404;
				return next(notFoundError);
			}
			if (err.message === 'Forbidden') {
				const forbiddenError: ApiError = new Error('Forbidden');
				forbiddenError.statusCode = 403;
				return next(forbiddenError);
			}
			next(error);
		}
	},

	delete: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.user?.id as string;
			const { id } = req.params;

			if (!id) {
				return res.status(400).json({ success: false, message: 'Missing ID parameter' });
			}

			await postService.delete(id, userId);
			res.status(200).json({ success: true, message: 'Post deleted successfully' });
		} catch (error) {
			const err = error as Error;
			if (err.message === 'Post not found') {
				const notFoundError: ApiError = new Error('Post not found');
				notFoundError.statusCode = 404;
				return next(notFoundError);
			}
			if (err.message === 'Forbidden') {
				const forbiddenError: ApiError = new Error('Forbidden');
				forbiddenError.statusCode = 403;
				return next(forbiddenError);
			}
			next(error);
		}
	},
};
