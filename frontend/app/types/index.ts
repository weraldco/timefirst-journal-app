export interface User {
	id: string;
	name: string;
	email: string;
}

export interface FetchData {
	success: boolean;
	data: Journal[];
}
export const moodValues = [
	'happy',
	'calm',
	'productive',
	'tired',
	'stressed',
	'relaxed',
	'null',
] as const;

export type MoodT = (typeof moodValues)[number];

export interface Journal {
	id: string;
	title: string;
	content: string;
	mood: MoodT;
	tags: string[];
	userId: string;
	createdAt: string;
	updatedAt: string;
}

export interface JournalFormData {
	title: string;
	content: string;
	mood: string;
	tags: string[];
}

export interface UserType {
	id: string;
	email: string;
	name: string;
}
