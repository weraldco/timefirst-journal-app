import { quoteController } from '../controllers/quoteController';
import { mockRequest, mockResponse } from './helpers';

const mockFetch = jest.fn();

describe('quoteController', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		global.fetch = mockFetch;
	});

	describe('getRandomQuote', () => {
		it('returns 200 with quote data when fetch succeeds', async () => {
			const req = mockRequest();
			const res = mockResponse();
			const quoteData = { text: 'Test quote', author: 'Author' };
			mockFetch.mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(quoteData),
			});

			await quoteController.getRandomQuote(req, res);

			expect(mockFetch).toHaveBeenCalledWith('https://api.quotify.top/random');
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(quoteData);
		});

		it('returns 401 when external API fails', async () => {
			const req = mockRequest();
			const res = mockResponse();
			mockFetch.mockResolvedValue({ ok: false });

			await quoteController.getRandomQuote(req, res);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch data' });
		});

		it('returns 500 when fetch throws', async () => {
			const req = mockRequest();
			const res = mockResponse();
			mockFetch.mockRejectedValue(new Error('Network error'));

			await quoteController.getRandomQuote(req, res);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ error: 'Internal Error!' });
		});
	});
});
