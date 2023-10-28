import {Carts} from '../dao/factory.js'

const cartManager = new Carts()

export const addCart = async (req, res) => {
    try {
        const result = await cartManager.addCart({});
        res.send({ status: 'success', payload: result })
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
}

export const getCart = async (req, res) => {

    const cid = req.params.cid;

    try {
        const cart = await cartManager.getCartById(cid);
        res.send({ status: "success", payload: cart });
    } catch (error) {
        res.status(404).send({ status: 'error', message: error.message })
    }
}

export const addProduct = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    try {
        const cart = await cartManager.addProductToCart(cid, pid);
        res.send({ status: 'success', payload: cart });

    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
}

export const deleteProduct = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    try {
        const cart = await cartManager.deleteProductToCart(cid, pid);
        res.send({ status: 'success', payload: cart });

    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
}

export const updateCart = async (req, res) => {
    const cid = req.params.cid;
    const products = req.body;

    try {
        const cart = await cartManager.updateCartProducts(cid, products);
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
        const cart = await cartManager.updateQuantityOfProducts(cid, pid, newQuantity);
        res.send({ status: 'success', payload: cart });

    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
}

export const cleanCart = async (req, res) => {
    const cid = req.params.cid;

    try {
        const cart = await cartManager.deleteCartProducts(cid);
        res.send({ status: 'success', payload: cart });

    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
}