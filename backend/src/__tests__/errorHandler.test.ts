import { Request, Response } from 'express';
import { ApiError, errorHandler } from '../middleware/errorHandler';

jest.mock('../utils/logger', () => ({
	logger: {
		error: jest.fn(),
	},
}));

const mockRequest = {} as Request;
const mockNext = jest.fn();

const createMockResponse = () => {
	const res = {} as Response;
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	return res;
};

describe('errorHandler', () => {
	const originalEnv = process.env.NODE_ENV;

	afterEach(() => {
		process.env.NODE_ENV = originalEnv;
	});

	it('returns statusCode from ApiError when present', () => {
		const res = createMockResponse();
		const err: ApiError = new Error('Not found');
		err.statusCode = 404;

		errorHandler(err, mockRequest, res, mockNext);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				success: false,
				error: 'Not found',
			})
		);
	});

	it('defaults to 500 for generic Error', () => {
		const res = createMockResponse();
		const err = new Error('Something broke');

		errorHandler(err as ApiError, mockRequest, res, mockNext);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				success: false,
				error: 'Something broke',
			})
		);
	});

	it('returns error as string in response shape', () => {
		const res = createMockResponse();
		const err = new Error('Test error');

		errorHandler(err as ApiError, mockRequest, res, mockNext);

		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				success: false,
				error: 'Test error',
			})
		);
	});

	it('includes stack in development', () => {
		process.env.NODE_ENV = 'development';
		const res = createMockResponse();
		const err = new Error('Dev error');

		errorHandler(err as ApiError, mockRequest, res, mockNext);

		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				success: false,
				error: 'Dev error',
				stack: expect.any(String),
			})
		);
	});

	it('does not include stack in production', () => {
		process.env.NODE_ENV = 'production';
		const res = createMockResponse();
		const err = new Error('Prod error');

		errorHandler(err as ApiError, mockRequest, res, mockNext);

		expect(res.json).toHaveBeenCalledWith({
			success: false,
			error: 'Prod error',
		});
	});
});
