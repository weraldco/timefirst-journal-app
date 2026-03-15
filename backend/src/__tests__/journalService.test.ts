import { journalService } from '../services/journalService';

const mockFindMany = jest.fn();
const mockFindUnique = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();

jest.mock('../config/database', () => ({
	prisma: {
		journal: {
			findMany: (...args: unknown[]) => mockFindMany(...args),
			findUnique: (...args: unknown[]) => mockFindUnique(...args),
			create: (...args: unknown[]) => mockCreate(...args),
			update: (...args: unknown[]) => mockUpdate(...args),
			delete: (...args: unknown[]) => mockDelete(...args),
		},
	},
}));

const mockJournal = {
	id: 'journal-1',
	title: 'Test Journal',
	content: 'Test content',
	mood: 'happy',
	tags: ['tag1'],
	userId: 'user-1',
	createdAt: new Date(),
	updatedAt: new Date(),
};

describe('journalService', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('getAll', () => {
		it('returns all journals for userId ordered by createdAt desc', async () => {
			mockFindMany.mockResolvedValue([mockJournal]);

			const result = await journalService.getAll('user-1');

			expect(mockFindMany).toHaveBeenCalledWith({
				where: { userId: 'user-1' },
				orderBy: { createdAt: 'desc' },
			});
			expect(result).toEqual([mockJournal]);
		});
	});

	describe('getById', () => {
		it('returns journal when found', async () => {
			mockFindUnique.mockResolvedValue(mockJournal);

			const result = await journalService.getById('journal-1', 'user-1');

			expect(mockFindUnique).toHaveBeenCalledWith({
				where: { id: 'journal-1', userId: 'user-1' },
			});
			expect(result).toEqual(mockJournal);
		});

		it('throws when journal does not exist', async () => {
			mockFindUnique.mockResolvedValue(null);

			await expect(
				journalService.getById('invalid', 'user-1')
			).rejects.toThrow('journalPost not found');
		});
	});

	describe('create', () => {
		it('creates journal with correct data', async () => {
			mockCreate.mockResolvedValue(mockJournal);

			const result = await journalService.create({
				title: 'Test Journal',
				content: 'Test content',
				mood: 'happy',
				tags: ['tag1'],
				userId: 'user-1',
			});

			expect(mockCreate).toHaveBeenCalledWith({
				data: {
					title: 'Test Journal',
					content: 'Test content',
					mood: 'happy',
					tags: ['tag1'],
					userId: 'user-1',
				},
			});
			expect(result).toEqual(mockJournal);
		});
	});

	describe('update', () => {
		it('updates journal when it exists', async () => {
			mockFindUnique.mockResolvedValue(mockJournal);
			mockUpdate.mockResolvedValue({ ...mockJournal, title: 'Updated' });

			const result = await journalService.update('journal-1', {
				title: 'Updated',
				content: 'Test content',
				mood: 'happy',
				tags: ['tag1'],
				userId: 'user-1',
			});

			expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: 'journal-1' } });
			expect(mockUpdate).toHaveBeenCalledWith({
				where: { id: 'journal-1' },
				data: {
					title: 'Updated',
					content: 'Test content',
					mood: 'happy',
					tags: ['tag1'],
					userId: 'user-1',
				},
			});
			expect(result).toEqual({ ...mockJournal, title: 'Updated' });
		});

		it('throws when journal does not exist', async () => {
			mockFindUnique.mockResolvedValue(null);

			await expect(
				journalService.update('invalid', {
					title: 'Updated',
					content: 'c',
					mood: 'happy',
					tags: [],
					userId: 'user-1',
				})
			).rejects.toThrow('journalPost not found');
		});
	});

	describe('delete', () => {
		it('deletes journal when it exists', async () => {
			mockFindUnique.mockResolvedValue(mockJournal);
			mockDelete.mockResolvedValue(mockJournal);

			await journalService.delete('journal-1');

			expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: 'journal-1' } });
			expect(mockDelete).toHaveBeenCalledWith({ where: { id: 'journal-1' } });
		});

		it('throws when journal does not exist', async () => {
			mockFindUnique.mockResolvedValue(null);

			await expect(journalService.delete('invalid')).rejects.toThrow(
				'journalPost not found'
			);
		});
	});

	describe('getMood', () => {
		it('returns mood data filtered by userId and year', async () => {
			const moodData = [
				{ id: '1', mood: 'happy', createdAt: new Date('2024-06-15') },
			];
			mockFindMany.mockResolvedValue(moodData);

			const result = await journalService.getMood('user-1', 2024);

			expect(mockFindMany).toHaveBeenCalledWith({
				where: {
					userId: 'user-1',
					createdAt: {
						gte: new Date('2024-01-01'),
						lt: new Date('2025-01-01'),
					},
				},
				select: { id: true, mood: true, createdAt: true },
			});
			expect(result).toEqual(moodData);
		});
	});
});
