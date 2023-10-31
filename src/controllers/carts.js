import { cartsService, ticketsService, productsService } from "../services/index.js";

export const addCart = async (req, res) => {
    try {
        const result = await cartsService.addCart({});
        res.send({ status: 'success', payload: result })
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
}

export const getCart = async (req, res) => {

    const cid = req.params.cid;

    try {
        const cart = await cartsService.getCartById(cid);
        res.send({ status: "success", payload: cart });
    } catch (error) {
        res.status(404).send({ status: 'error', message: error.message })
    }
}

export const addProduct = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    try {
        const cart = await cartsService.addProductToCart(cid, pid);
        res.send({ status: 'success', payload: cart });

    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
}

export const deleteProduct = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    try {
        const cart = await cartsService.deleteProductFromCart(cid, pid);
        res.send({ status: 'success', payload: cart });

    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
}

export const updateCart = async (req, res) => {
    const cid = req.params.cid;
    const products = req.body;

    try {
        const cart = await cartsService.updateCartProducts(cid, products);
        res.send({ status: 'success', payload: cart });

    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
}

export const updateQuantity = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const newQuantity = req.body.quantity;

    try {
        const cart = await cartsService.updateQuantityOfProducts(cid, pid, newQuantity);
        res.send({ status: 'success', payload: cart });

    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
}

export const cleanCart = async (req, res) => {
    const cid = req.params.cid;

    try {
        const cart = await cartsService.deleteCartProducts(cid);
        res.send({ status: 'success', payload: cart });

    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
}

export const purchase = async (req, res) => {
    const cid = req.params.cid;
    const { shippingPrice, email } = req.body;

    try {

        const cart = await cartsService.getCartById(cid);

        let cartProducts = cart.products;
        let orderProducts = [];

        cartProducts.forEach(product => {

            const stock = product.product.stock

            if (stock > 0) {
                if (product.quantity <= stock) {
                    orderProducts.push(product);
                    cartProducts = cartProducts.filter(p => p !== product)
                    productsService.updateProduct(product.product._id, { stock: stock - product.quantity })
                } else {
                    const difference = product.quantity - stock
                    product.quantity = difference
                    orderProducts.push({ product: product.product, quantity: stock })
                    productsService.updateProduct(product.product._id, { stock: 0 })
                }
            }

        })

        if (orderProducts.length === 0) {

            throw new Error(`No hay stock de los productos seleccionados`)

        }

        await cartsService.updateCartProducts(cid, cartProducts)

        let subtotal = 0;

        orderProducts.forEach(product => {
            subtotal += product.quantity * product.product.price
        })

        const total = subtotal + shippingPrice

        const ticket = await ticketsService.createTicket({ total, products: orderProducts, email })

        const order = { ticket, noStockProducts: cartProducts }

        res.send({ status: 'success', payload: order });

    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
} 