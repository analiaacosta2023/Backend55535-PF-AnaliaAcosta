import { productsService } from "../../services/index.js"
import CustomError from "../../services/errors/CustomError.js";
import EErrors from "../../services/errors/enums.js";
import { generateGetProductErrorInfo, generateObjectIdErrorInfo } from "../../services/errors/info.js";
import mongoose from 'mongoose';

const isOwner = (condition) => {
    return async (req, res, next) => {
        try {

            const pid = req.params.pid

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

            if (condition === true) {
                if ((req.user.role != 'admin') && (product.owner != req.user.email)) {
                    CustomError.createError({
                        name: 'No permissions',
                        cause: 'El usuario no está autorizado para modificar este producto',
                        message: 'Forbidden',
                        code: EErrors.FORBIDDEN
                    })
                }
                next();
            } else {
                if ((req.user.role === 'admin') || (product.owner === req.user.email)) {
                    CustomError.createError({
                        name: 'No permissions',
                        cause: 'El usuario no está autorizado para modificar este producto',
                        message: 'Forbidden',
                        code: EErrors.FORBIDDEN
                    })
                }
                next();
            }


        } catch (error) {
            req.logger.error(error.message)
            next(error)
        }
    }
}

export default isOwner