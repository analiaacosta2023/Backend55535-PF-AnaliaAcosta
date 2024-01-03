import { Router } from 'express';
import { newMessage, getMessages } from '../controllers/messages.js';
import { authorization, passportCall } from "../middlewares/authorization/passport.js";

const router = Router();

router.get('/', getMessages)

router.post('/', passportCall('jwt'), authorization(['usuario']), newMessage)

export default router;