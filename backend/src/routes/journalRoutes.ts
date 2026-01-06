

import { Router } from 'express';
import { journalController } from '../controllers/journalController';
const router = Router();

router.get('/', journalController.getAll);
router.get('/:id', journalController.getById);
router.post('/', journalController.create);
router.put('/:id', journalController.update);
router.delete('/:id', journalController.delete);

export default router;