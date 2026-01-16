import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import 'dotenv/config'; // loads .env automatically
import express, { Request, Response } from 'express';
import { prisma } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import authRoutes from './routes/authRoutes';
import journalRoutes from './routes/journalRoutes';
import quoteRoutes from './routes/quoteRoutes';

dotenv.config();
const app = express();

// Middleware
app.use(
	cors({
		origin: ['http://localhost:3000'],
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
		// allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	})
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', async (req: Request, res: Response) => {
	res.json({
		success: true,
		message: 'API Gateway is running',
		timestamp: new Date().toISOString(),
	});
});
// API routes

app.use('/api/journal', journalRoutes);
app.use('/api/quote', quoteRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

export default app;
