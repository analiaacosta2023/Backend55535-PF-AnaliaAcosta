import { usersService } from "../services/index.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import {generateObjectIdErrorInfo} from "../services/errors/info.js";
import mongoose from 'mongoose';

export const getUserById = async (req, res, next) => {

    const uid = req.params.uid;

    try {

        if (!mongoose.Types.ObjectId.isValid(uid)) {
            CustomError.createError({
                name: 'User get error',
                cause: generateObjectIdErrorInfo(uid),
                message: 'Object id invalid format',
                code: EErrors.INVALID_PARAM_ERROR
            })
        }

        const user = await usersService.getUserById(uid);

        if (!user) {
            CustomError.createError({
                name: 'Product get error',
                cause: `No se encontró al usuario con el id ${uid}`,
                message: 'Product not found',
                code: EErrors.ROUTING_ERROR
            })
        }

        res.send({ status: "success", payload: user });
    } catch (error) {
        req.logger.error(error.message)
        next(error)
    }
}

export const setPremium = async (req, res, next) => {

    const uid = req.params.uid
    console.log('hola')

    try {
        if (!mongoose.Types.ObjectId.isValid(uid)) {
            CustomError.createError({
                name: 'User get error',
                cause: generateObjectIdErrorInfo(uid),
                message: 'Object id invalid format',
                code: EErrors.INVALID_PARAM_ERROR
            })
        }

        const user = await usersService.getUserById(uid);

        if (!user) {
            CustomError.createError({
                name: 'Product get error',
                cause: `No se encontró al usuario con el id ${uid}`,
                message: 'Product not found',
                code: EErrors.ROUTING_ERROR
            })
        }

        let updates;

        if (user.role === 'premium') {
            updates = { role: 'usuario' }
        } else {
            updates = { role: 'premium' }
        }

        const result = await usersService.updateUser(user.email, updates)
        res.send({ status: "success", payload: result });
    } catch (error) {
        req.logger.error(error.message)
        next(error)
    }
}
