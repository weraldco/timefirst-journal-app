import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

export interface ApiError extends Error {
	statusCode?: number;
}

export const errorHandler = (
	err: ApiError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || 'Internal Server Error';

	logger.error('Unhandled error', err);

	res.status(statusCode).json({
		success: false,
		error: message,
		...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
	});
};
