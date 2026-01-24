import { z } from 'zod';
import { moodValues } from '../types';

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
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type JournalFormData = z.infer<typeof journalSchema>;
