import { cartsService, ticketsService, productsService } from "../services/index.js";
import { sendEmailToUser } from "../utils.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import {generateGetCartErrorInfo, generateAddToCartErrorInfo, generateCleanCartErrorInfo, generateEmailErrorInfo, generateInvalidTypeErrorInfo} from "../services/errors/info.js";

export const addCart = async (req, res) => {
    try {
        const result = await cartsService.addCart({});
        res.send({ status: 'success', payload: result })
    } catch (error) {
        CustomError.createError({
            name: 'Create cart error',
            cause: 'Error al crear carrito',
            message: error.message,
            code: EErrors.INVALID_TYPES_ERROR
        })
    }
}

export const getCart = async (req, res) => {

    const cid = req.params.cid;

    try {
        const cart = await cartsService.getCartById(cid);
        res.send({ status: "success", payload: cart });
    } catch (error) {
        CustomError.createError({
            name: 'Cart get error',
            cause: generateGetCartErrorInfo(cid),
            message: error.message,
            code: EErrors.INVALID_PARAM_ERROR
        })
    }
}

export const addProduct = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    try {
        const cart = await cartsService.addProductToCart(cid, pid);
        res.send({ status: 'success', payload: cart });

    } catch (error) {
        CustomError.createError({
            name: 'Add product to cart error',
            cause: generateAddToCartErrorInfo(pid, cid),
            message: error.message,
            code: EErrors.INVALID_TYPES_ERROR
        })
    }
}

export const deleteProduct = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    try {
        const cart = await cartsService.deleteProductFromCart(cid, pid);
        res.send({ status: 'success', payload: cart });

    } catch (error) {
        CustomError.createError({
            name: 'Delete product from cart error',
            cause: generateAddToCartErrorInfo(pid, cid),
            message: error.message,
            code: EErrors.INVALID_TYPES_ERROR
        })
    }
}

export const updateCart = async (req, res) => {
    const cid = req.params.cid;
    const products = req.body;

    try {
        const cart = await cartsService.updateCartProducts(cid, products);
        res.send({ status: 'success', payload: cart });

    } catch (error) {
        CustomError.createError({
            name: 'Update cart error',
            cause:  generateInvalidTypeErrorInfo(),
            message: error.message,
            code: EErrors.INVALID_TYPES_ERROR
        })
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
        CustomError.createError({
            name: 'Update quantity of a product in the cart error',
            cause: generateInvalidTypeErrorInfo(),
            message: error.message,
            code: EErrors.INVALID_TYPES_ERROR
        })
    }
}

export const cleanCart = async (req, res) => {
    const cid = req.params.cid;

    try {
        const cart = await cartsService.deleteCartProducts(cid);
        res.send({ status: 'success', payload: cart });

    } catch (error) {
        CustomError.createError({
            name: 'Clean cart error',
            cause: generateCleanCartErrorInfo(cid),
            message: error.message,
            code: EErrors.INVALID_PARAM_ERROR
        })
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
            CustomError.createError({
                name: 'No stock error',
                cause: `No hay stock de los productos seleccionados`,
                message: `No hay stock de los productos seleccionados`,
                code: EErrors.ROUTING_ERROR
            })

        }

        const newCart = await cartsService.updateCartProducts(cid, cartProducts)

        let subtotal = 0;

        orderProducts.forEach(product => {
            subtotal += product.quantity * product.product.price
        })

        const total = subtotal + shippingPrice

        const ticket = await ticketsService.createTicket({ total, products: orderProducts, email })

        const order = { ticket, cart: newCart }

        // Enviar mail con orden

        const subject = "Resumen de tu orden"

        const orderedProducts = ticket.products

        let mssg = ''
        orderedProducts.forEach(product => {
            mssg += `<br> Id ${product.product}: ${product.quantity} unidades`
        })

        const html = `<h1>Resumen de tu orden</h1><p>Ticket: ${ticket.code}<br>Fecha y hora: ${ticket.purchase_datetime}<br>Total: $ ${ticket.amount}<br>Productos: ${mssg}</p>`
    
        const result = await sendEmailToUser(email, subject, html)
    
        if (result.rejected.length > 0) {
            CustomError.createError({
                name: 'Email rejected',
                cause: generateEmailErrorInfo(email),
                message: "El email con el resumen de tu orden fue rechazado.",
                code: EErrors.INVALID_PARAM_ERROR
            })
        }

        res.send({ status: 'success', payload: order });

    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
} 