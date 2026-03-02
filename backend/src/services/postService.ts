import { PostType } from '@prisma/client';
import { prisma } from '../config/database';

export interface PostCreateData {
	title: string;
	description: string;
	imageUrl?: string | null;
	tags: string[];
	type: PostType;
	date?: Date;
	userId: string;
}

export interface PostUpdateData {
	title?: string;
	description?: string;
	imageUrl?: string | null;
	tags?: string[];
	type?: PostType;
	date?: Date;
}

export const postService = {
	getAll: async () => {
		return await prisma.post.findMany({
			orderBy: { date: 'desc' },
			include: { user: { select: { name: true } } },
		});
	},

	getById: async (id: string) => {
		const post = await prisma.post.findUnique({
			where: { id },
			include: { user: { select: { name: true } } },
		});

		if (!post) {
			throw new Error('Post not found');
		}

		return post;
	},

	getMy: async (userId: string) => {
		return await prisma.post.findMany({
			where: { userId },
			orderBy: { date: 'desc' },
		});
	},

	create: async (data: PostCreateData) => {
		return await prisma.post.create({
			data: {
				title: data.title,
				description: data.description,
				imageUrl: data.imageUrl ?? null,
				tags: data.tags ?? [],
				type: data.type,
				date: data.date ?? new Date(),
				userId: data.userId,
			},
		});
	},

	update: async (id: string, userId: string, data: PostUpdateData) => {
		const post = await prisma.post.findUnique({ where: { id } });

		if (!post) {
			throw new Error('Post not found');
		}

		if (post.userId !== userId) {
			throw new Error('Forbidden');
		}

		return await prisma.post.update({
			where: { id },
			data: {
				...(data.title !== undefined && { title: data.title }),
				...(data.description !== undefined && { description: data.description }),
				...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
				...(data.tags !== undefined && { tags: data.tags }),
				...(data.type !== undefined && { type: data.type }),
				...(data.date !== undefined && { date: data.date }),
			},
		});
	},

	delete: async (id: string, userId: string) => {
		const post = await prisma.post.findUnique({ where: { id } });

		if (!post) {
			throw new Error('Post not found');
		}

		if (post.userId !== userId) {
			throw new Error('Forbidden');
		}

		return await prisma.post.delete({ where: { id } });
	},
};
