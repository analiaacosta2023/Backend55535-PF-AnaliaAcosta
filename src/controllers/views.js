import {Carts, Products, Messages} from '../dao/factory.js'

const productManager = new Products()
const cartManager = new Carts()
const messageManager = new Messages()

export const publicAccess = (req, res, next) => {
    if (req.user) return res.redirect('/products');
    next();
}

export const privateAccess = (req, res, next) => {
    if (!req.user) {
        console.log(req.message)
        return res.redirect('/login');
    }
    next();
}

export const home = async (req, res) => {

    res.render('home', { style: "index.css" })
}

export const realTimeProducts = async (req, res) => {

    res.render('realTimeProducts', { style: "index.css" })
}

export const chat = async (req, res) => {

    const messages = await messageManager.getAll();

    res.render('chat', { style: "index.css", user: req.user, messages })
}

export const products = async (req, res) => {

    const query = req.query

    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalPages, page } = await productManager.getAll(query);

    res.render('products', { style: "index.css", user: req.user, docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalPages, page })
}

export const sproduct = async (req, res) => {

    const pid = req.params.pid

    try {
        const product = await productManager.getProductById(pid);

        res.render('sproduct', { style: "index.css", user: req.user, product })
    } catch (error) {
        console.log(error)
    }
}

export const cart = async (req, res) => {

    try {
        const cid = req.params.cid

        const cart = await cartManager.getCartById(cid)

        res.render('cart', { style: "index.css", cart, user: req.user })

    } catch (error) {
        res.status(404).send(`Cart not found: ${error.message}`);
    }
}

export const login = (req, res) => {
    res.render('login', { style: "index.css" })
}

export const register = (req, res) => {
    res.render('register', { style: "index.css" })
}

export const resetPassword = (req, res) => {
    res.render('resetPassword', { style: "index.css" })
}