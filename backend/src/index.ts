import cors from 'cors';
import dotenv from 'dotenv';
import 'dotenv/config'; // loads .env automatically
import express, { Request, Response } from 'express';
import { prisma } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import authRoutes from './routes/authRoutes';
import journalRoutes from './routes/journalRoutes';
import { logger } from './utils/logger';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(
	cors({
		origin: ['http://localhost:3000'],
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', async (req: Request, res: Response) => {
	res.json({
		success: true,
		message: 'API Gateway is running',
		timestamp: new Date().toISOString(),
	});

	console.log('DATABASE_URL:', process.env.DATABASE_URL);
	const journals = await prisma.journal.findMany();
	console.log(journals);
});
// API routes
app.use('/api/journal', journalRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
	logger.info(`Server is running on http://localhost:${PORT}`);
});
