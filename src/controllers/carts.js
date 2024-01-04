import { cartsService, ticketsService, productsService } from "../services/index.js";
import { sendEmailToUser } from "../utils.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { generateGetCartErrorInfo, generateAddToCartErrorInfo, generateEmailErrorInfo, generateObjectIdErrorInfo } from "../services/errors/info.js";
import mongoose from 'mongoose';

export const addCart = async (req, res, next) => {
    try {
        const result = await cartsService.addCart({});
        res.send({ status: 'success', payload: result })
    } catch (error) {
        req.logger.error(error.message)
        next(error)
    }
}

export const getCart = async (req, res, next) => {

    const cid = req.params.cid;

    try {

        if (!mongoose.Types.ObjectId.isValid(cid)) {
            CustomError.createError({
                name: 'Cart get error',
                cause: generateObjectIdErrorInfo(cid),
                message: 'Object id invalid format',
                code: EErrors.INVALID_PARAM_ERROR
            })
        }

        const cart = await cartsService.getCartById(cid);

        if (!cart) {
            CustomError.createError({
                name: 'Cart get error',
                cause: generateGetCartErrorInfo(cid),
                message: 'Cart not found',
                code: EErrors.ROUTING_ERROR
            })
        }

        res.send({ status: "success", payload: cart });
    } catch (error) {
        req.logger.error(error.message)
        next(error)
    }
}

export const addProduct = async (req, res, next) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    try {

        if (!mongoose.Types.ObjectId.isValid(cid)) {
            CustomError.createError({
                name: 'Add product to cart error',
                cause: generateObjectIdErrorInfo(cid),
                message: 'Object id invalid format',
                code: EErrors.INVALID_PARAM_ERROR
            })
        }
        if (!mongoose.Types.ObjectId.isValid(pid)) {
            CustomError.createError({
                name: 'Add product to cart error',
                cause: generateObjectIdErrorInfo(pid),
                message: 'Object id invalid format',
                code: EErrors.INVALID_PARAM_ERROR
            })
        }

        const cart = await cartsService.addProductToCart(cid, pid);

        if (!cart) {
            CustomError.createError({
                name: 'Add product to cart error',
                cause: generateAddToCartErrorInfo(pid, cid),
                message: 'Product or cart not found',
                code: EErrors.ROUTING_ERROR
            })
        }

        res.send({ status: 'success', payload: cart });

    } catch (error) {
        req.logger.error(error.message)
        next(error)
    }
}

export const deleteProduct = async (req, res, next) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    try {

        if (!mongoose.Types.ObjectId.isValid(cid)) {
            CustomError.createError({
                name: 'Delete product from cart error',
                cause: generateObjectIdErrorInfo(cid),
                message: 'Object id invalid format',
                code: EErrors.INVALID_PARAM_ERROR
            })
        }
        if (!mongoose.Types.ObjectId.isValid(pid)) {
            CustomError.createError({
                name: 'Delete product from cart error',
                cause: generateObjectIdErrorInfo(pid),
                message: 'Object id invalid format',
                code: EErrors.INVALID_PARAM_ERROR
            })
        }

        const cart = await cartsService.deleteProductFromCart(cid, pid);

        if (!cart) {
            CustomError.createError({
                name: 'Delete product from cart error',
                cause: generateAddToCartErrorInfo(pid, cid),
                message: 'Product or cart not found',
                code: EErrors.ROUTING_ERROR
            })
        }

        res.send({ status: 'success', payload: cart });

    } catch (error) {
        req.logger.error(error.message)
        next(error)
    }
}

export const updateCart = async (req, res, next) => {
    const cid = req.params.cid;
    const products = req.body;

    try {

        if (!mongoose.Types.ObjectId.isValid(cid)) {
            CustomError.createError({
                name: 'Update products in cart error',
                cause: generateObjectIdErrorInfo(cid),
                message: 'Object id invalid format',
                code: EErrors.INVALID_PARAM_ERROR
            })
        }

        if (!Array.isArray(products)) {
            CustomError.createError({
                name: 'Update products in cart error',
                cause: 'products tiene que ser un array',
                message: 'Products must be an array',
                code: EErrors.INVALID_PARAM_ERROR
            });
        }

        const isValidProductFormat = products.every(product => {
            return (
                typeof product === 'object' &&
                product !== null &&
                'product' in product &&
                'quantity' in product &&
                mongoose.Types.ObjectId.isValid(product.product) &&
                typeof product.quantity === 'number'
            );
        });

        if (!isValidProductFormat) {
            CustomError.createError({
                name: 'Update products in cart error',
                cause: 'Alguno de los productos no tiene el formato requerido',
                message: 'Invalid format for one or more products',
                code: EErrors.INVALID_PARAM_ERROR
            });
        }

        const cart = await cartsService.updateCartProducts(cid, products);

        if (!cart) {
            CustomError.createError({
                name: 'Update products in cart error',
                cause: generateGetCartErrorInfo(cid),
                message: 'Cart not found',
                code: EErrors.ROUTING_ERROR
            })
        }

        res.send({ status: 'success', payload: cart });

    } catch (error) {
        req.logger.error(error.message)
        next(error)
    }
}

export const updateQuantity = async (req, res, next) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const newQuantity = req.body.quantity;

    try {

        if (!mongoose.Types.ObjectId.isValid(cid)) {
            CustomError.createError({
                name: 'Update quantity of product in cart error',
                cause: generateObjectIdErrorInfo(cid),
                message: 'Object id invalid format',
                code: EErrors.INVALID_PARAM_ERROR
            })
        }
        if (!mongoose.Types.ObjectId.isValid(pid)) {
            CustomError.createError({
                name: 'Update quantity of product in cart error',
                cause: generateObjectIdErrorInfo(pid),
                message: 'Object id invalid format',
                code: EErrors.INVALID_PARAM_ERROR
            })
        }

        if(isNaN(newQuantity)){
            CustomError.createError({
                name: 'Update quantity of product in cart error',
                cause: 'La cantidad de productos debe ser un número',
                message: 'newQuantity invalid format',
                code: EErrors.INVALID_PARAM_ERROR
            })
        }
        const cart = await cartsService.updateQuantityOfProducts(cid, pid, newQuantity);

        if (!cart) {
            CustomError.createError({
                name: 'Update quantity of product in cart error',
                cause: generateAddToCartErrorInfo(pid, cid),
                message: 'Product or cart not found',
                code: EErrors.ROUTING_ERROR
            })
        }

        res.send({ status: 'success', payload: cart });

    } catch (error) {
        req.logger.error(error.message)
        next(error)
    }
}

export const cleanCart = async (req, res, next) => {
    const cid = req.params.cid;

    try {

        if (!mongoose.Types.ObjectId.isValid(cid)) {
            CustomError.createError({
                name: 'Clean cart error',
                cause: generateObjectIdErrorInfo(cid),
                message: 'Object id invalid format',
                code: EErrors.INVALID_PARAM_ERROR
            })
        }
        const cart = await cartsService.deleteCartProducts(cid);

        if (!cart) {
            CustomError.createError({
                name: 'Clean cart error',
                cause: generateGetCartErrorInfo(cid),
                message: 'Cart not found',
                code: EErrors.ROUTING_ERROR
            })
        }

        res.send({ status: 'success', payload: cart });

    } catch (error) {
        req.logger.error(error.message)
        next(error)
    }
}

export const purchase = async (req, res, next) => {
    const cid = req.params.cid;
    const { shippingPrice, email } = req.body;

    try {

        if (!mongoose.Types.ObjectId.isValid(cid)) {
            CustomError.createError({
                name: 'Get cart error',
                cause: generateObjectIdErrorInfo(cid),
                message: 'Object id invalid format',
                code: EErrors.INVALID_PARAM_ERROR
            })
        }

        if(isNaN(shippingPrice)) {
            CustomError.createError({
                name: 'Purchase error',
                cause: 'El costo de envío debe ser un número',
                message: 'shippingPrice invalid format',
                code: EErrors.INVALID_PARAM_ERROR
            })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            CustomError.createError({
                name: 'Purchase error',
                cause: 'El email no tiene formato aceptado',
                message: 'email invalid format',
                code: EErrors.INVALID_PARAM_ERROR
            }) 
        }

        const cart = await cartsService.getCartById(cid);

        if (!cart) {
            CustomError.createError({
                name: 'Get cart error',
                cause: generateGetCartErrorInfo(cid),
                message: 'Cart not found',
                code: EErrors.ROUTING_ERROR
            })
        }

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
                    req.logger.warning(`There is not enough stock of the product ${product.product._id}`)
                    const difference = product.quantity - stock
                    product.quantity = difference
                    orderProducts.push({ product: product.product, quantity: stock })
                    productsService.updateProduct(product.product._id, { stock: 0 })
                }
            } else {
                req.logger.warning(`There is not stock of the product ${product.product._id}`)
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

        req.logger.info(`New order ${ticket.code}`)

        res.send({ status: 'success', payload: order });

    } catch (error) {
        req.logger.error(error.message)
        next(error)
    }
} 