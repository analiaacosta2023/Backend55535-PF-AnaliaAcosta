import { productsService } from "../services/index.js"

export const home = async (req, res) => {

    res.render('home', { style: "index.css" })
}

export const realTimeProducts = async (req, res) => {

    res.render('realTimeProducts', { style: "index.css", user: req.user})
}

export const chat = async (req, res) => {

    let isAdmin = false
    if (req.user.role === 'admin') {
        isAdmin = true
    }

    res.render('chat', { style: "index.css", user: req.user, isAdmin })
}

export const products = async (req, res) => {

    const query = req.query

    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalPages, page } = await productsService.getAll(query);

    let isAdmin = false
    if (req.user.role === 'admin') {
        isAdmin = true
    }

    res.render('products', { style: "index.css", user: req.user, docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalPages, page, isAdmin })
}

export const sproduct = async (req, res) => {

    const pid = req.params.pid

    try {
        const product = await productsService.getProductById(pid);

        let isAdmin = false
        if (req.user.role === 'admin') {
            isAdmin = true
        }

        res.render('sproduct', { style: "index.css", user: req.user, product, isAdmin })
    } catch (error) {
        req.logger.error(error.message)
        res.status(404).render('error', { message: `Product not found: ${error.message}`, style: "index.css" });
    }
}

export const cart = async (req, res) => {

    const cid = req.params.cid

    try {

        if (req.user.cart._id !== cid) {
            throw new Error("Cart not found");
        }

        res.render('cart', { style: "index.css", user: req.user })

    } catch (error) {
        req.logger.error(error.message)
        res.status(404).render('error', { message: `${error.message}`, style: "index.css" });
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

export const restartPassword = (req, res) => {
    res.render('restartPassword', { style: "index.css", user: req.user })
}

export const expiredToken = (req, res) => {
    res.render('tokenExpired', { style: "index.css" })
}

export const errorRedirection = (req, res) => {
    res.status(404).render('error', { message: 'Page not found', style: "index.css" });
}

export const users = async (req, res) => {

    res.render('users', { style: "index.css", user: req.user })
}