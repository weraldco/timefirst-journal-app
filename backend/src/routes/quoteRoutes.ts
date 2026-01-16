import { Router } from 'express';
import { quoteController } from '../controllers/quoteController';
const router = Router();

router.get('/', quoteController.getRandomQuote);

export default router;
