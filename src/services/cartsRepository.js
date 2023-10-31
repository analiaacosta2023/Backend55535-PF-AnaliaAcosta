export default class CartsRepository {
    constructor(dao) {
        this.dao = dao
    }

    getAll = async () => {
        const carts = await this.dao.getAll();
        return carts
    }

    addCart = async (cart) => {
        const result = await this.dao.addCart(cart);
        return result
    }

    getCartById = async (idCart) => {
        const cart = await this.dao.getCartById(idCart);
        return cart
    }

    addProductToCart = async (idCart, idProduct) => {
        const result = await this.dao.addProductToCart(idCart, idProduct);
        return result
    }

    deleteProductFromCart = async (idCart, idProduct) => {
        const carts = await this.dao.deleteProductFromCart(idCart, idProduct);
        return carts
    }

    updateCartProducts = async (idCart, products) => {
        const carts = await this.dao.updateCartProducts(idCart, products);
        return carts
    }

    updateQuantityOfProducts = async (idCart, idProduct, newQuantity) => {
        const carts = await this.dao.updateQuantityOfProducts(idCart, idProduct, newQuantity);
        return carts
    }

    deleteCartProducts = async (idCart) => {
        const carts = await this.dao.deleteCartProducts(idCart);
        return carts
    }

}