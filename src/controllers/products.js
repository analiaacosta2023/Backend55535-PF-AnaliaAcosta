import { productsService } from "../services/index.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { generateGetProductErrorInfo, generateObjectIdErrorInfo, generateAddProductErrorInfo } from "../services/errors/info.js";
import mongoose from 'mongoose';

export const getProducts = async (req, res, next) => {
    try {
        const query = req.query;

        let prevLink = '';
        let nextLink = '';

        const { docs, limit, page, totalPages, hasPrevPage, hasNextPage, nextPage, prevPage } = await productsService.getAll(query);

        if (docs.length === 0) {
            return res.status(204).send('No content to return');
        }

        hasPrevPage && (prevLink = `/products?limit=${limit}&page=${prevPage}`)
        hasNextPage && (nextLink = `/products?limit=${limit}&page=${nextPage}`)

        res.send({ status: "success", payload: docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage, limit, prevLink, nextLink });
    } catch (error) {
        req.logger.error(error.message)
        next(error)
    }
}

export const getProductById = async (req, res, next) => {

    const pid = req.params.pid;

    try {

        if (!mongoose.Types.ObjectId.isValid(pid)) {
            CustomError.createError({
                name: 'Product get error',
                cause: generateObjectIdErrorInfo(pid),
                message: 'Object id invalid format',
                code: EErrors.INVALID_PARAM_ERROR
            })
        }
        const product = await productsService.getProductById(pid);

        if (!product) {
            CustomError.createError({
                name: 'Product get error',
                cause: generateGetProductErrorInfo(pid),
                message: 'Product not found',
                code: EErrors.ROUTING_ERROR
            })
        }

        res.send({ status: "success", payload: product });
    } catch (error) {
        req.logger.error(error.message)
        next(error)
    }
}

export const addProduct = async (req, res, next) => {
    const product = req.body;
    const user = req.user

    try {

        if (user) {
            product.owner = user.email
        }

        if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category) {
            CustomError.createError({
                name: 'Add product error',
                cause: generateAddProductErrorInfo(product),
                message: 'Error al cargar producto',
                code: EErrors.INVALID_TYPES_ERROR
            })
        }
        const result = await productsService.addProduct(product);
        res.send({ status: 'success', payload: result })
    } catch (error) {
        req.logger.error(error.message)
        next(error)
    }
}

export const updateProduct = async (req, res, next) => {

    const pid = req.params.pid;
    const propertiesToUpdate = req.body;

    try {

        if (typeof propertiesToUpdate !== 'object' || propertiesToUpdate === null) {
            CustomError.createError({
                name: 'Product update error',
                cause: 'Se requiere indicar las propiedades a actualizar con sus nuevos valores en un objeto propertiesToUpdate',
                message: 'Invalid propertiesToUpdate format',
                code: EErrors.INVALID_PARAM_ERROR
            });
        }

        const propertyKeys = Object.keys(propertiesToUpdate);

        if (propertyKeys.length === 0) {
            CustomError.createError({
                name: 'Product update error',
                cause: 'Se debe proveer al menos una propiedad para actualizar',
                message: 'At least one property must be provided for update',
                code: EErrors.INVALID_PARAM_ERROR
            });
        }

        const validPropertyNames = ['title', 'description', 'code', 'price', 'stock', 'category', 'thumbnail', 'status'];
        const invalidProperties = propertyKeys.filter(key => !validPropertyNames.includes(key));
        if (invalidProperties.length > 0) {
            CustomError.createError({
                name: 'Product update error',
                cause: `Propiedades inválidas para productos: ${invalidProperties.join(', ')}`,
                message: `Invalid properties`,
                code: EErrors.INVALID_PARAM_ERROR
            });
        }

        const product = await productsService.updateProduct(pid, propertiesToUpdate);

        res.send({ status: 'success', payload: product });
    } catch (error) {
        req.logger.error(error.message)
        next(error)
    }
}

export const deleteProduct = async (req, res, next) => {

    const pid = req.params.pid;

    try {

        const result = await productsService.deleteProduct(pid);

        res.send({ status: 'success', payload: result });
    } catch (error) {
        req.logger.error(error.message)
        next(error)
    }
}