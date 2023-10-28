import {Products} from '../dao/factory.js'

const productManager = new Products()

export const getProducts = async (req, res) => {

    const query = req.query;

    let prevLink = '';
    let nextLink = '';

    const { docs, limit, page, totalPages, hasPrevPage, hasNextPage, nextPage, prevPage } = await productManager.getAll(query);

    hasPrevPage && ( prevLink = `/products?limit=${limit}&page=${prevPage}`)
    hasNextPage && ( nextLink = `/products?limit=${limit}&page=${nextPage}`)

    res.send({ status: "success", payload: docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage, limit, prevLink , nextLink});

}

export const getProductById = async (req, res) => {

    const pid = req.params.pid;

    try {
        const product = await productManager.getProductById(pid);
        res.send({ status: "success", payload: product });
    } catch (error) {
        res.status(404).send({ status: 'error', message: error.message })
    }
}

export const addProduct = async (req, res) => {
    const product = req.body;

    try {
        const result = await productManager.addProduct(product);
        res.send({ status: 'success', payload: result })
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
}

export const updateProduct = async (req, res) => {

    const pid = req.params.pid;
    const propertiesToUpdate = req.body;

    try {
        const product = await productManager.updateProduct(pid, propertiesToUpdate);
        res.send({ status: 'success', payload: product });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
}

export const deleteProduct = async (req, res) => {

    const pid = req.params.pid;

    try {
        const result = await productManager.deleteProduct(pid);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(404).send({ status: 'error', message: error.message })
    }
}