import { Router } from 'express';
import { journalController } from '../controllers/journalController';
import { authMiddleware } from '../middleware/authMiddleware';
const router = Router();

router.get('/', authMiddleware, journalController.getAll);
router.get('/:id', authMiddleware, journalController.getById);
router.post('/mood', authMiddleware, journalController.getMood);
router.post('/create', authMiddleware, journalController.create);
router.put('/:id', authMiddleware, journalController.update);
router.delete('/:id', authMiddleware, journalController.delete);

export default router;
