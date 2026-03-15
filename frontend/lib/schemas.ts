import { z } from 'zod';
import { moodValues, postTypeValues } from '../types';

export const loginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const journalSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	content: z.string().min(1, 'Content is required'),
	mood: z.enum(moodValues, {
		message: 'Invalid mood',
	}),
	tags: z.array(z.string()),
	date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
		.optional(),
});

export const postSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().min(1, 'Description is required'),
	imageUrl: z.string().nullable().optional(),
	tags: z.array(z.string()),
	type: z.enum(postTypeValues, {
		message: 'Invalid post type',
	}),
	date: z.string().or(z.date()),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type JournalFormData = z.infer<typeof journalSchema>;
export type PostFormData = z.infer<typeof postSchema>;
