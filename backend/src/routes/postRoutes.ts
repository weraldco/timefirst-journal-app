import { Router } from 'express';
import { postController } from '../controllers/postController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Public routes (no auth)
router.get('/', postController.getAll);

// Auth routes - /my must be before /:id to avoid "my" matching as id
router.get('/my', authMiddleware, postController.getMy);

router.get('/:id', postController.getById);
router.post('/create', authMiddleware, postController.create);
router.put('/:id', authMiddleware, postController.update);
router.delete('/:id', authMiddleware, postController.delete);

export default router;
