import { Request, Response } from 'express';

export const mockUser = {
	id: 'user-1',
	email: 'test@example.com',
	name: 'Test User',
};

export const mockRequest = (overrides: Partial<Request> = {}) =>
	({
		body: {},
		params: {},
		cookies: {},
		user: undefined,
		...overrides,
	}) as unknown as Request;

export const mockResponse = () => {
	const res = {} as Response;
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	return res;
};
