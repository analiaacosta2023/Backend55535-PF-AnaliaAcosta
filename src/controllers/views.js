import { productsService, messagesService } from "../services/index.js"

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

    const messages = await messagesService.getAll();

    res.render('chat', { style: "index.css", user: req.user, messages })
}

export const products = async (req, res) => {

    const query = req.query

    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalPages, page } = await productsService.getAll(query);

    res.render('products', { style: "index.css", user: req.user, docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalPages, page })
}

export const sproduct = async (req, res) => {

    const pid = req.params.pid

    try {
        const product = await productsService.getProductById(pid);

        res.render('sproduct', { style: "index.css", user: req.user, product })
    } catch (error) {
        console.log(error)
    }
}

export const cart = async (req, res) => {

    try {
        
        res.render('cart', { style: "index.css", user: req.user })

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