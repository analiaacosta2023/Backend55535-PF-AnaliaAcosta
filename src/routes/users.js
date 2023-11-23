import { Router } from 'express';
import { setPremium, getUserById } from '../controllers/users.js';

const router = Router();

router.get('/:uid', getUserById)

router.put('/premium/:uid', setPremium)

export default router;