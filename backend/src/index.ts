import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import journalRoutes from './routes/journalRoutes';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { logger } from './utils/logger';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(
	cors({
		origin: ['http://localhost:3000', 'https://jobstashr.vercel.app'],
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (req: Request, res: Response) => {
	res.json({
		success: true,
		message: 'API Gateway is running',
		timestamp: new Date().toISOString(),
	});
});

// API routes
app.use('/api/journal', journalRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
	logger.info(`Server is running on http://localhost:${PORT}`);
	logger.info(`API Gateway available at http://localhost:${PORT}/api`);
});
