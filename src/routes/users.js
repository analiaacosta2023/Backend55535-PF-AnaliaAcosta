import { Router } from 'express';
import { setPremium, getUserById, saveDocuments } from '../controllers/users.js';
import { uploader } from '../utils.js';

const router = Router();

router.get('/:uid', getUserById)

router.put('/premium/:uid', setPremium)

router.post('/:uid/documents', uploader.fields([{ name: 'profile', maxCount: 1 }, { name: 'products', maxCount: 12 }, {name: 'id_doc', maxCount: 1}, {name: 'address_doc'}, {name: 'account_doc', maxCount: 1}]), saveDocuments)

export default router;