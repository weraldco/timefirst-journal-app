import express from 'express';
import {
	me,
	refresh,
	signIn,
	signOut,
	signUp,
} from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/signout', signOut);
router.post('/refresh', authMiddleware, refresh);
router.get('/me', authMiddleware, me);

export default router;
