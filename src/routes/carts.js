import { Router } from 'express';
import CartManager from '../Managers/CartManager.js'
import ProductManager from '../Managers/ProductManager.js'

const productManager = new ProductManager()
const cartManager = new CartManager()

const router = Router();


router.post('/', async (req, res) => {

    try {
        await cartManager.addCart();
        res.send({ status: 'success', message: 'Nuevo carrito creado' })
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message })
    }
})

router.get('/:cid', async (req, res) => {

    const cid = parseInt(req.params.cid);

    try {
        const cart = await cartManager.getCartById(cid);
        res.send(cart.products);
    } catch (error) {
        res.status(404).send({ error: error.message })
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);


    try {
        const product = await productManager.getProductById(pid);
        if (product) {
            try {
                const cart = await cartManager.addProductTocart(cid, pid);
                res.send(cart);
            } catch (error) {
                res.status(404).send({ error: error.message }) //Error porque no existe el carrito
            }

        }

    } catch (error) {
        res.status(404).send({ error: error.message }) //Error porque no existe el producto
        return
    }

})


export default router;

