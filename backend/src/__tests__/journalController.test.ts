import { journalController } from '../controllers/journalController';
import { journalService } from '../services/journalService';
import { mockRequest, mockResponse, mockUser } from './helpers';

jest.mock('../services/journalService');

const mockJournalService = journalService as jest.Mocked<typeof journalService>;

const mockNext = jest.fn();

describe('journalController', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('getAll', () => {
		it('returns 401 when user is not authenticated', async () => {
			const req = mockRequest({ user: undefined });
			const res = mockResponse();

			await journalController.getAll(req, res, mockNext);

			expect(mockJournalService.getAll).not.toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({ error: 'User Unauthorized' });
		});

		it('returns 200 with journals when authenticated', async () => {
			const req = mockRequest({ user: mockUser });
			const res = mockResponse();
			const journals = [{ id: '1', title: 'Journal', userId: 'user-1' }];
			mockJournalService.getAll.mockResolvedValue(journals as never);

			await journalController.getAll(req, res, mockNext);

			expect(mockJournalService.getAll).toHaveBeenCalledWith('user-1');
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				data: journals,
			});
		});
	});

	describe('getById', () => {
		it('returns 400 when id or userId is missing', async () => {
			const req = mockRequest({ params: {}, user: undefined });
			const res = mockResponse();

			await journalController.getById(req, res, mockNext);

			expect(mockJournalService.getById).not.toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(400);
		});

		it('returns 200 with journal when found', async () => {
			const req = mockRequest({
				params: { id: 'journal-1' },
				user: mockUser,
			});
			const res = mockResponse();
			const journal = { id: 'journal-1', title: 'Test', userId: 'user-1' };
			mockJournalService.getById.mockResolvedValue(journal as never);

			await journalController.getById(req, res, mockNext);

			expect(mockJournalService.getById).toHaveBeenCalledWith(
				'journal-1',
				'user-1'
			);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				data: journal,
			});
		});

		it('calls next with error when journal not found', async () => {
			const req = mockRequest({
				params: { id: 'invalid' },
				user: mockUser,
			});
			const res = mockResponse();
			mockJournalService.getById.mockRejectedValue(
				new Error('journalPost not found')
			);

			await journalController.getById(req, res, mockNext);

			expect(mockNext).toHaveBeenCalled();
		});
	});

	describe('getMood', () => {
		it('returns 401 when user is not authenticated', async () => {
			const req = mockRequest({ user: undefined, body: { year: 2024 } });
			const res = mockResponse();

			await journalController.getMood(req, res, mockNext);

			expect(mockJournalService.getMood).not.toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(401);
		});

		it('returns 200 with mood data when authenticated', async () => {
			const req = mockRequest({
				user: mockUser,
				body: { year: 2024 },
			});
			const res = mockResponse();
			const moodData = [{ id: '1', mood: 'happy', createdAt: new Date() }];
			mockJournalService.getMood.mockResolvedValue(moodData as never);

			await journalController.getMood(req, res, mockNext);

			expect(mockJournalService.getMood).toHaveBeenCalledWith('user-1', 2024);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				data: moodData,
			});
		});
	});

	describe('create', () => {
		it('returns 401 when required fields are missing', async () => {
			const req = mockRequest({
				user: mockUser,
				body: { title: 'Test' },
			});
			const res = mockResponse();

			await journalController.create(req, res, mockNext);

			expect(mockJournalService.create).not.toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({
				error: 'All fields are required',
			});
		});

		it('returns 201 when journal is created', async () => {
			const req = mockRequest({
				user: mockUser,
				body: {
					title: 'Title',
					content: 'Content',
					mood: 'happy',
					tags: ['tag1'],
				},
			});
			const res = mockResponse();
			const created = {
				id: 'new-1',
				title: 'Title',
				content: 'Content',
				mood: 'happy',
				tags: ['tag1'],
				userId: 'user-1',
			};
			mockJournalService.create.mockResolvedValue(created as never);

			await journalController.create(req, res, mockNext);

			expect(mockJournalService.create).toHaveBeenCalledWith({
				title: 'Title',
				content: 'Content',
				mood: 'happy',
				tags: ['tag1'],
				userId: 'user-1',
			});
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				data: created,
			});
		});
	});

	describe('update', () => {
		it('returns 400 when id is missing', async () => {
			const req = mockRequest({
				params: {},
				body: {
					title: 'Updated',
					content: 'Content',
					mood: 'happy',
					tags: [],
					userId: 'user-1',
				},
			});
			const res = mockResponse();

			await journalController.update(req, res, mockNext);

			expect(mockJournalService.update).not.toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(400);
		});

		it('returns 200 when journal is updated', async () => {
			const req = mockRequest({
				params: { id: 'journal-1' },
				body: {
					title: 'Updated',
					content: 'Content',
					mood: 'happy',
					tags: [],
					userId: 'user-1',
				},
			});
			const res = mockResponse();
			const updated = {
				id: 'journal-1',
				title: 'Updated',
				content: 'Content',
				mood: 'happy',
				tags: [],
				userId: 'user-1',
			};
			mockJournalService.update.mockResolvedValue(updated as never);

			await journalController.update(req, res, mockNext);

			expect(mockJournalService.update).toHaveBeenCalledWith(
				'journal-1',
				expect.objectContaining({
					title: 'Updated',
					content: 'Content',
					mood: 'happy',
					tags: [],
					userId: 'user-1',
				})
			);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				data: updated,
			});
		});
	});

	describe('delete', () => {
		it('returns 400 when id is missing', async () => {
			const req = mockRequest({ params: {} });
			const res = mockResponse();

			await journalController.delete(req, res, mockNext);

			expect(mockJournalService.delete).not.toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(400);
		});

		it('returns 200 when journal is deleted', async () => {
			const req = mockRequest({ params: { id: 'journal-1' } });
			const res = mockResponse();
			mockJournalService.delete.mockResolvedValue(undefined as never);

			await journalController.delete(req, res, mockNext);

			expect(mockJournalService.delete).toHaveBeenCalledWith('journal-1');
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				message: 'Journal deleted successfully',
			});
		});
	});
});
