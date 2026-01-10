import { prisma } from '../config/database';

export interface JournalDataT {
	title: string;
	userId: string;
	content: string;
	mood: string;
	tags: string[];
}

export interface UpdateJournalDataT {
	title: string;
	userId: string;
	content: string;
	mood: string;
	tags: string[];
}

export const journalService = {
	// GET - Get all journal posts
	getAll: async (userId: string) => {
		return await prisma.journal.findMany({
			where: { userId },
			orderBy: { createdAt: 'desc' },
		});
	},

	// GET - Get single journal by id
	getById: async (id: string, userId: string) => {
		const journalPost = await prisma.journal.findUnique({
			where: { id, userId },
		});

		if (!journalPost) {
			throw new Error('journalPost not found');
		}

		return journalPost;
	},

	// POST - Create new journal
	create: async (data: JournalDataT) => {
		return await prisma.journal.create({
			data,
		});
	},

	// PUT - Update journal
	update: async (id: string, data: UpdateJournalDataT) => {
		const journalPost = await prisma.journal.findUnique({
			where: { id },
		});

		if (!journalPost) {
			throw new Error('journalPost not found');
		}

		return await prisma.journal.update({
			where: { id },
			data,
		});
	},

	// DELETE - Delete journal
	delete: async (id: string) => {
		const journalPost = await prisma.journal.findUnique({
			where: { id },
		});

		if (!journalPost) {
			throw new Error('journalPost not found');
		}

		return await prisma.journal.delete({
			where: { id },
		});
	},
};
