import { Router } from 'express';
import { addCart, addProduct, cleanCart, deleteProduct, getCart, updateCart, updateQuantity, purchase } from '../controllers/carts.js';
import { authorization, passportCall } from "../middlewares/authorization/passport.js";
import isOwner from '../middlewares/authorization/isOwner.js';

const router = Router();

router.post('/', addCart)

router.get('/:cid', getCart)

router.post('/:cid/product/:pid', passportCall('jwt'), authorization(['usuario', "premium"]), isOwner(false), addProduct)

router.delete('/:cid/product/:pid', deleteProduct)

router.put('/:cid', updateCart)

router.put('/:cid/product/:pid', updateQuantity)

router.delete('/:cid', cleanCart)

router.post('/:cid/purchase', passportCall('jwt'), authorization(['usuario', "premium"]), purchase)

export default router;


