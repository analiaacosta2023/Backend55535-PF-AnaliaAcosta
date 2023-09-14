import { Router, query } from 'express';
import ProductManager from '../dao/db-managers/productManager.js'
import CartManager from '../dao/db-managers/cartManager.js'

const productManager = new ProductManager()
const cartManager = new CartManager()

const router = Router();

router.get('/', async (req, res) => {
    
    const {docs} = await productManager.getAll({});

    res.render('home', {style: "index.css", docs})
})

router.get('/realtimeproducts', async (req, res) => {

    res.render('realTimeProducts', {style: "index.css"})
})

router.get('/chat', async (req, res) => {

    res.render('chat', {style: "index.css"})
})

router.get('/products', async (req, res) => {
    
    const query = req.query

    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage , totalPages, page} = await productManager.getAll(query);

    res.render('products', {style: "index.css", docs, hasPrevPage, hasNextPage, nextPage, prevPage , totalPages, page})
})

router.get('/carts/:cid', async (req, res) =>{

try {
    const cid = req.params.cid

    const cart = await cartManager.getCartById(cid)

    res.render('cart', {cart} )

} catch (error) {
    res.status(404).send(`Cart not found: ${error.message}`);
}

})
           
export default router;