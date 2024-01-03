import { Router } from 'express';
import { addProduct, deleteProduct, getProductById, getProducts, updateProduct } from '../controllers/products.js';
import { authorization, passportCall } from "../middlewares/authorization/passport.js";
import isOwner from '../middlewares/authorization/isOwner.js';

const router = Router();

router.get('/', getProducts)

router.get('/:pid', getProductById)

router.post('/', passportCall('jwt'), authorization(['admin', 'premium']), addProduct)

router.put('/:pid', passportCall('jwt'), authorization(['admin', 'premium']), isOwner(true), updateProduct)

router.delete('/:pid', passportCall('jwt'), authorization(['admin', 'premium']), isOwner(true), deleteProduct )

export default router;