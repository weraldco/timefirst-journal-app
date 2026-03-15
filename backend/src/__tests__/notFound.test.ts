import { Request, Response } from 'express';
import { notFound } from '../middleware/notFound';

const createMockRequest = (originalUrl: string) =>
	({ originalUrl } as unknown as Request);

const createMockResponse = () => {
	const res = {} as Response;
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	return res;
};

describe('notFound', () => {
	it('returns 404 with message containing originalUrl', () => {
		const req = createMockRequest('/api/unknown-route');
		const res = createMockResponse();

		notFound(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			error: 'Route /api/unknown-route not found',
		});
	});
});
