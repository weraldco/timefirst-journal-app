import { PostType } from '@prisma/client';
import { postService } from '../services/postService';

const mockFindMany = jest.fn();
const mockFindUnique = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();

jest.mock('../config/database', () => ({
	prisma: {
		post: {
			findMany: (...args: unknown[]) => mockFindMany(...args),
			findUnique: (...args: unknown[]) => mockFindUnique(...args),
			create: (...args: unknown[]) => mockCreate(...args),
			update: (...args: unknown[]) => mockUpdate(...args),
			delete: (...args: unknown[]) => mockDelete(...args),
		},
	},
}));

const mockPost = {
	id: 'post-1',
	title: 'Test Post',
	description: 'Test description',
	imageUrl: null,
	tags: ['tag1'],
	type: 'project' as PostType,
	date: new Date(),
	createdAt: new Date(),
	updatedAt: new Date(),
	userId: 'user-1',
};

describe('postService', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('getAll', () => {
		it('returns all posts ordered by date desc', async () => {
			mockFindMany.mockResolvedValue([mockPost]);

			const result = await postService.getAll();

			expect(mockFindMany).toHaveBeenCalledWith({
				orderBy: { date: 'desc' },
				include: { user: { select: { name: true } } },
			});
			expect(result).toEqual([mockPost]);
		});
	});

	describe('getById', () => {
		it('returns post when found', async () => {
			mockFindUnique.mockResolvedValue(mockPost);

			const result = await postService.getById('post-1');

			expect(mockFindUnique).toHaveBeenCalledWith({
				where: { id: 'post-1' },
				include: { user: { select: { name: true } } },
			});
			expect(result).toEqual(mockPost);
		});

		it('throws Post not found when post does not exist', async () => {
			mockFindUnique.mockResolvedValue(null);

			await expect(postService.getById('invalid')).rejects.toThrow('Post not found');
		});
	});

	describe('getMy', () => {
		it('returns user posts ordered by date desc', async () => {
			mockFindMany.mockResolvedValue([mockPost]);

			const result = await postService.getMy('user-1');

			expect(mockFindMany).toHaveBeenCalledWith({
				where: { userId: 'user-1' },
				orderBy: { date: 'desc' },
			});
			expect(result).toEqual([mockPost]);
		});
	});

	describe('create', () => {
		it('creates post with required fields', async () => {
			mockCreate.mockResolvedValue(mockPost);

			const result = await postService.create({
				title: 'Test Post',
				description: 'Test description',
				tags: ['tag1'],
				type: 'project',
				userId: 'user-1',
			});

			expect(mockCreate).toHaveBeenCalledWith({
				data: {
					title: 'Test Post',
					description: 'Test description',
					imageUrl: null,
					tags: ['tag1'],
					type: 'project',
					date: expect.any(Date),
					userId: 'user-1',
				},
			});
			expect(result).toEqual(mockPost);
		});

		it('creates post with imageUrl when provided', async () => {
			mockCreate.mockResolvedValue({ ...mockPost, imageUrl: 'https://example.com/img.png' });

			await postService.create({
				title: 'Test',
				description: 'Desc',
				imageUrl: 'https://example.com/img.png',
				tags: [],
				type: 'achievement',
				userId: 'user-1',
			});

			expect(mockCreate).toHaveBeenCalledWith({
				data: expect.objectContaining({
					imageUrl: 'https://example.com/img.png',
				}),
			});
		});
	});

	describe('update', () => {
		it('updates post when user owns it', async () => {
			mockFindUnique.mockResolvedValue(mockPost);
			mockUpdate.mockResolvedValue({ ...mockPost, title: 'Updated' });

			const result = await postService.update('post-1', 'user-1', { title: 'Updated' });

			expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: 'post-1' } });
			expect(mockUpdate).toHaveBeenCalledWith({
				where: { id: 'post-1' },
				data: { title: 'Updated' },
			});
			expect(result).toEqual({ ...mockPost, title: 'Updated' });
		});

		it('throws Post not found when post does not exist', async () => {
			mockFindUnique.mockResolvedValue(null);

			await expect(
				postService.update('invalid', 'user-1', { title: 'Updated' })
			).rejects.toThrow('Post not found');
		});

		it('throws Forbidden when user does not own post', async () => {
			mockFindUnique.mockResolvedValue(mockPost);

			await expect(
				postService.update('post-1', 'other-user', { title: 'Updated' })
			).rejects.toThrow('Forbidden');
		});
	});

	describe('delete', () => {
		it('deletes post when user owns it', async () => {
			mockFindUnique.mockResolvedValue(mockPost);
			mockDelete.mockResolvedValue(mockPost);

			await postService.delete('post-1', 'user-1');

			expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: 'post-1' } });
			expect(mockDelete).toHaveBeenCalledWith({ where: { id: 'post-1' } });
		});

		it('throws Post not found when post does not exist', async () => {
			mockFindUnique.mockResolvedValue(null);

			await expect(postService.delete('invalid', 'user-1')).rejects.toThrow('Post not found');
		});

		it('throws Forbidden when user does not own post', async () => {
			mockFindUnique.mockResolvedValue(mockPost);

			await expect(postService.delete('post-1', 'other-user')).rejects.toThrow('Forbidden');
		});
	});
});
