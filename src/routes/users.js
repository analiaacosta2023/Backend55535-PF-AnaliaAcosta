import { Router } from 'express';
import { setPremium, getUserById, saveDocuments, getUsers, deleteUsers, deleteUserById } from '../controllers/users.js';
import { uploader } from '../utils.js';
import { authorization, passportCall } from "../utils.js";

const router = Router();

router.get('/', passportCall('jwt'), authorization(['admin']), getUsers)

router.delete('/', passportCall('jwt'), authorization(['admin']), deleteUsers)

router.get('/:uid', getUserById)

router.delete('/:uid', passportCall('jwt'), authorization(['admin']), deleteUserById)

router.put('/premium/:uid', setPremium)

router.post('/:uid/documents', uploader.fields([{ name: 'profile', maxCount: 1 }, { name: 'products', maxCount: 12 }, {name: 'id_doc', maxCount: 1}, {name: 'address_doc'}, {name: 'account_doc', maxCount: 1}]), saveDocuments)

export default router;