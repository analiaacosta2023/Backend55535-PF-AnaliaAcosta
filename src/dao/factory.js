import mongoose from "mongoose";
import config from '../config/config.js'

export let Carts;
export let Messages;
export let Products;
export let Users;
switch (config.persistence) {
    case "MONGO":
        const connection = mongoose.connect(config.mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        const { default: CartsMongo } = await import('./mongo/cartMongo.js');
        const { default: MessagesMongo } = await import('./mongo/messageMongo.js');
        const { default: ProductsMongo } = await import('./mongo/productMongo.js');
        const { default: UsersMongo } = await import('./mongo/userMongo.js');
        Carts = CartsMongo;
        Messages = MessagesMongo;
        Products = ProductsMongo;
        Users = UsersMongo;
        break;
    case "MEMORY":
        const { default: CartsMemory } = await import('./memory/cartManager.js');
        const { default: ProductsMemory } = await import('./memory/productManager.js');
        Carts = CartsMemory;
        Products = ProductsMemory;
        break;
    default:
        console.log('No se encontro forma de persistencia')
        break;
}