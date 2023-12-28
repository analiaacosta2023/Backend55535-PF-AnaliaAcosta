import { Router } from 'express';
import { authorization, passportCall } from "../utils.js";
import {publicAccess, privateAccess} from "../middlewares/authorization/access.js"
import { home, realTimeProducts, chat, products, sproduct, cart, login, register, resetPassword, restartPassword, expiredToken, errorRedirection, users } from '../controllers/views.js';
import checkTokenValidity from '../middlewares/checkTokenValidity.js';

const router = Router();

router.get('/', passportCall('jwt'), publicAccess, home)

router.get('/realtimeproducts', passportCall('jwt'), privateAccess, authorization(['admin', 'premium']), realTimeProducts )

router.get('/chat', passportCall('jwt'), privateAccess, chat)

router.get('/products', passportCall('jwt'), privateAccess, products)

router.get('/products/:pid', passportCall('jwt'), privateAccess, sproduct)

router.get('/carts/:cid', passportCall('jwt'), privateAccess, cart)

router.get('/login', passportCall('jwt'), publicAccess, login)

router.get('/register', passportCall('jwt'), publicAccess, register)

router.get('/resetpassword', passportCall('jwt'), publicAccess, resetPassword)

router.get('/restartpassword/:token', passportCall('jwt'), publicAccess, checkTokenValidity, restartPassword)

router.get('/restartpassword', passportCall('jwt'), publicAccess, expiredToken)

router.get('/users', passportCall('jwt'), privateAccess, authorization(['admin']), users)

router.use(errorRedirection);

export default router;