import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import { prisma } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import authRoutes from './routes/authRoutes';
import journalRoutes from './routes/journalRoutes';
import postRoutes from './routes/postRoutes';
import quoteRoutes from './routes/quoteRoutes';

const app = express();

const corsOrigins = process.env.CORS_ORIGINS
	? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
	: ['https://timefirst.weraldco.com'];

app.use(
	cors({
		origin: corsOrigins,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
		credentials: true,
	}),
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
app.use('/api/post', postRoutes);
app.use('/api/quote', quoteRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

export default app;
