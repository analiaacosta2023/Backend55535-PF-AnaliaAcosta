import { Router } from 'express';
import { getMockingProducts } from '../controllers/mocking.js';

const router = Router();

router.get('/', getMockingProducts)

export default router;