import { postController } from '../controllers/postController';
import { postService } from '../services/postService';
import { mockRequest, mockResponse, mockUser } from './helpers';

jest.mock('../services/postService');

const mockPostService = postService as jest.Mocked<typeof postService>;

const mockNext = jest.fn();

describe('postController', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('getAll', () => {
		it('returns all posts without auth', async () => {
			const req = mockRequest();
			const res = mockResponse();

			mockPostService.getAll.mockResolvedValue([{ id: '1', title: 'Post' }] as never);

			await postController.getAll(req, res, mockNext);

			expect(mockPostService.getAll).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				data: [{ id: '1', title: 'Post' }],
			});
		});
	});

	describe('getById', () => {
		it('returns post by id (public)', async () => {
			const req = mockRequest({ params: { id: 'post-1' } });
			const res = mockResponse();
			const mockPost = { id: 'post-1', title: 'Test' };

			mockPostService.getById.mockResolvedValue(mockPost as never);

			await postController.getById(req, res, mockNext);

			expect(mockPostService.getById).toHaveBeenCalledWith('post-1');
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ success: true, data: mockPost });
		});

		it('returns 400 when id is missing', async () => {
			const req = mockRequest({ params: {} });
			const res = mockResponse();

			await postController.getById(req, res, mockNext);

			expect(mockPostService.getById).not.toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(400);
		});
	});

	describe('getMy', () => {
		it('returns 401 when user is not authenticated', async () => {
			const req = mockRequest({ user: undefined });
			const res = mockResponse();

			await postController.getMy(req, res, mockNext);

			expect(mockPostService.getMy).not.toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(401);
		});

		it('returns user posts when authenticated', async () => {
			const req = mockRequest({ user: mockUser });
			const res = mockResponse();
			mockPostService.getMy.mockResolvedValue([{ id: '1' }] as never);

			await postController.getMy(req, res, mockNext);

			expect(mockPostService.getMy).toHaveBeenCalledWith('user-1');
			expect(res.status).toHaveBeenCalledWith(200);
		});
	});

	describe('create', () => {
		it('returns 400 when title, description, or type is missing', async () => {
			const req = mockRequest({
				user: mockUser,
				body: { title: 'Test' },
			});
			const res = mockResponse();

			await postController.create(req, res, mockNext);

			expect(mockPostService.create).not.toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(400);
		});

		it('creates post when all required fields provided', async () => {
			const req = mockRequest({
				user: mockUser,
				body: {
					title: 'Title',
					description: 'Desc',
					type: 'project',
					tags: ['tag1'],
				},
			});
			const res = mockResponse();
			const created = { id: 'new-1', title: 'Title', userId: 'user-1' };
			mockPostService.create.mockResolvedValue(created as never);

			await postController.create(req, res, mockNext);

			expect(mockPostService.create).toHaveBeenCalledWith(
				expect.objectContaining({
					title: 'Title',
					description: 'Desc',
					type: 'project',
					tags: ['tag1'],
					userId: 'user-1',
				})
			);
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith({ success: true, data: created });
		});
	});

	describe('update', () => {
		it('returns 400 when id is missing', async () => {
			const req = mockRequest({
				user: mockUser,
				params: {},
				body: { title: 'Updated' },
			});
			const res = mockResponse();

			await postController.update(req, res, mockNext);

			expect(mockPostService.update).not.toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(400);
		});

		it('updates post when user is owner', async () => {
			const req = mockRequest({
				user: mockUser,
				params: { id: 'post-1' },
				body: { title: 'Updated' },
			});
			const res = mockResponse();
			mockPostService.update.mockResolvedValue({ id: 'post-1', title: 'Updated' } as never);

			await postController.update(req, res, mockNext);

			expect(mockPostService.update).toHaveBeenCalledWith(
				'post-1',
				'user-1',
				expect.objectContaining({ title: 'Updated' })
			);
			expect(res.status).toHaveBeenCalledWith(200);
		});
	});

	describe('delete', () => {
		it('returns 400 when id is missing', async () => {
			const req = mockRequest({ user: mockUser, params: {} });
			const res = mockResponse();

			await postController.delete(req, res, mockNext);

			expect(mockPostService.delete).not.toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(400);
		});

		it('deletes post when user is owner', async () => {
			const req = mockRequest({
				user: mockUser,
				params: { id: 'post-1' },
			});
			const res = mockResponse();
			mockPostService.delete.mockResolvedValue(undefined as never);

			await postController.delete(req, res, mockNext);

			expect(mockPostService.delete).toHaveBeenCalledWith('post-1', 'user-1');
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				message: 'Post deleted successfully',
			});
		});
	});
});
