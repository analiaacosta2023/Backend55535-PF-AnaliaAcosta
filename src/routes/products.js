import { Router } from 'express';
import { addProduct, deleteProduct, getProductById, getProducts, updateProduct } from '../controllers/products.js';
import { authorization, passportCall } from "../utils.js";

const router = Router();

router.get('/', getProducts)

router.get('/:pid', getProductById)

router.post('/', passportCall('jwt'), authorization('admin'), addProduct)

router.put('/:pid', passportCall('jwt'), authorization('admin'), updateProduct)

router.delete('/:pid', passportCall('jwt'), authorization('admin'), deleteProduct )

export default router;