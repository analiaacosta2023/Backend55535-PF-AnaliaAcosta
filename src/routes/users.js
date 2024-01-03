import { Router } from 'express';
import { setPremium, getUserById, saveDocuments, getUsers, deleteInactiveUsers, deleteUserById } from '../controllers/users.js';
import { uploader } from '../middlewares/multer.js'
import { authorization, passportCall } from "../middlewares/authorization/passport.js";

const router = Router();

router.get('/', passportCall('jwt'), authorization(['admin']), getUsers)

router.delete('/', passportCall('jwt'), authorization(['admin']), deleteInactiveUsers)

router.get('/:uid', getUserById)

router.delete('/:uid', passportCall('jwt'), authorization(['admin']), deleteUserById)

router.put('/premium/:uid', setPremium)

router.post('/:uid/documents', uploader.fields([{ name: 'profile', maxCount: 1 }, { name: 'products', maxCount: 12 }, {name: 'id_doc', maxCount: 1}, {name: 'address_doc'}, {name: 'account_doc', maxCount: 1}]), saveDocuments)

export default router;