import { Router } from 'express';
import { authorization, passportCall } from "../utils.js";
import { publicAccess, privateAccess, home, realTimeProducts, chat, products, sproduct, cart, login, register, resetPassword } from '../controllers/views.js';

const router = Router();

router.get('/', passportCall('jwt'), publicAccess, home)

router.get('/realtimeproducts', passportCall('jwt'), privateAccess, authorization('admin'), realTimeProducts )

router.get('/chat', passportCall('jwt'), privateAccess, chat)

router.get('/products', passportCall('jwt'), privateAccess, products)

router.get('/products/:pid', passportCall('jwt'), privateAccess, sproduct)

router.get('/carts/:cid', passportCall('jwt'), privateAccess, cart)

router.get('/login', passportCall('jwt'), publicAccess, login)

router.get('/register', passportCall('jwt'), publicAccess, register)

router.get('/resetpassword', passportCall('jwt'), publicAccess, resetPassword)

export default router;