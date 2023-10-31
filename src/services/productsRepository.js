export default class ProductsRepository {
    constructor(dao) {
        this.dao = dao
    }

    getAll = async (query) => {
        const result = await this.dao.getAll(query);
        return result
    }

    addProduct = async (product) => {
        const result = await this.dao.addProduct(product);
        return result
    }

    getProductById = async (idProducto) => {
        const result = await this.dao.getProductById(idProducto);
        return result
    }

    updateProduct = async (idProducto, propertiesToUpdate) => {
        const result = await this.dao.updateProduct(idProducto, propertiesToUpdate);
        return result
    }

    deleteProduct = async (idProducto) => {
        const result = await this.dao.deleteProduct(idProducto);
        return result
    }
}