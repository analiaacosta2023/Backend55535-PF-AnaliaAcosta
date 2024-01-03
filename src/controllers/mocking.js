import { generateProduct } from "../utils/utils.js";

export const getMockingProducts = async (req, res) => {

    try {

        let products = []
        for (let i = 0; i < 100; i++) {
            products.push(generateProduct())
        }
        
        res.send({ status: "success", payload: products });
    } catch (error) {
        res.status(404).send({ status: 'error', message: error.message })
    }

}
