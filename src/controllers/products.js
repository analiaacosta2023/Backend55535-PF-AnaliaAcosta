import { productsService } from "../services/index.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import {generateGetProductErrorInfo, generateInvalidTypeErrorInfo} from "../services/errors/info.js";

export const getProducts = async (req, res) => {
    try {
        const query = req.query;

        let prevLink = '';
        let nextLink = '';

        const { docs, limit, page, totalPages, hasPrevPage, hasNextPage, nextPage, prevPage } = await productsService.getAll(query);

        hasPrevPage && (prevLink = `/products?limit=${limit}&page=${prevPage}`)
        hasNextPage && (nextLink = `/products?limit=${limit}&page=${nextPage}`)

        res.send({ status: "success", payload: docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage, limit, prevLink, nextLink });
    } catch (error) {
        CustomError.createError({
            name: 'Products get error',
            cause: 'Error del servidor, no se pueden obtener los productos',
            message: error.message,
            code: EErrors.SERVER_ERROR
        })
    }
}

export const getProductById = async (req, res) => {

    const pid = req.params.pid;

    try {
        const product = await productsService.getProductById(pid);
        res.send({ status: "success", payload: product });
    } catch (error) {
        CustomError.createError({
            name: 'Product get error',
            cause: generateGetProductErrorInfo(pid),
            message: error.message,
            code: EErrors.INVALID_PARAM_ERROR
        })
    }
}

export const addProduct = async (req, res) => {
    const product = req.body;

    try {
        const result = await productsService.addProduct(product);
        res.send({ status: 'success', payload: result })
    } catch (error) {
        CustomError.createError({
            name: 'Add product error',
            cause: 'Error al cargar producto',
            message: error.message,
            code: EErrors.INVALID_TYPES_ERROR
        })
    }
}

export const updateProduct = async (req, res) => {

    const pid = req.params.pid;
    const propertiesToUpdate = req.body;

    try {
        const product = await productsService.updateProduct(pid, propertiesToUpdate);
        res.send({ status: 'success', payload: product });
    } catch (error) {
        CustomError.createError({
            name: 'Update product error',
            cause:  generateInvalidTypeErrorInfo(),
            message: error.message,
            code: EErrors.INVALID_TYPES_ERROR
        })
    }
}

export const deleteProduct = async (req, res) => {

    const pid = req.params.pid;

    try {
        const result = await productsService.deleteProduct(pid);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        CustomError.createError({
            name: 'Delete product error',
            cause: generateGetProductErrorInfo(cid),
            message: error.message,
            code: EErrors.INVALID_PARAM_ERROR
        })
    }
}