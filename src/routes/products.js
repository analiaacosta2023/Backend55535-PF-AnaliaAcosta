import { Router } from 'express';
import ProductManager from '../Managers/ProductManager.js'

const productManager = new ProductManager()

const router = Router();

router.get('/', async (req, res) => {

    const limit = req.query.limit;
    const products = await productManager.getProducts();

    if (!limit) {
        res.send(products);
        return;
    }

    let productsWithLimit = products.slice(0, limit);
    res.send(productsWithLimit);

})

router.get('/:pid', async (req, res) => {

    const pid = parseInt(req.params.pid);

    try {
        const product = await productManager.getProductById(pid);
        res.send(product);
    } catch (error) {
        res.status(404).send({ error: error.message })
    }
})

router.post('/', async (req, res) => {
    const product = req.body;

    try {
        await productManager.addProduct(
            product.title,
            product.description,
            product.code,
            product.price,
            product.stock,
            product.category,
            product.thumbnail
        );
        res.send({ status: 'success', message: 'Nuevo producto cargado' })
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message })
    }
})

router.put('/:pid', async (req, res) => {

    const pid = parseInt(req.params.pid);
    const { propertyToUpdate, newValue } = req.body;

    try {
        const product = await productManager.updateProduct(pid, propertyToUpdate, newValue);
        res.send(product);
    } catch (error) {
        res.send({ error: error.message })
    }
})

router.delete('/:pid', async (req, res) => {

    const pid = parseInt(req.params.pid);

    try {
        const products = await productManager.deleteProduct(pid);
        res.send(products);
    } catch (error) {
        res.status(404).send({ error: error.message })
    }
})

export default router;







