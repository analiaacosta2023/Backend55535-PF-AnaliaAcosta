import { usersService } from "../services/index.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { generateObjectIdErrorInfo } from "../services/errors/info.js";
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
                name: 'User get error',
                cause: `No se encontró al usuario con el id ${uid}`,
                message: 'User not found',
                code: EErrors.ROUTING_ERROR
            })
        }

        let updates;

        if (user.role === 'premium') {
            updates = { role: 'usuario' }
        } else {

            if (!user.status.id_doc ||
                !user.status.address_doc ||
                !user.status.account_doc) {
                CustomError.createError({
                    name: 'User set premium error',
                    cause: `Faltan cargar documentos`,
                    message: 'Cannot update user',
                    code: EErrors.INVALID_PARAM_ERROR
                })
            }
            updates = { role: 'premium' }
        }

        const result = await usersService.updateUser(user.email, updates)
        res.send({ status: "success", payload: result });
    } catch (error) {
        req.logger.error(error.message)
        next(error)
    }
}

export const saveDocuments = async (res, req, next) => {

    console.log(req.params);
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
                name: 'User get error',
                cause: `No se encontró al usuario con el id ${uid}`,
                message: 'User not found',
                code: EErrors.ROUTING_ERROR
            })
        }

        const docs = req.files

        if (!docs) {
            CustomError.createError({
                name: 'Docs post error',
                cause: 'Se debe adjuntar un archivo',
                message: 'Error saving docs',
                code: EErrors.INVALID_PARAM_ERROR
            })
        }

        let newStatus = user.status
        let documents = []

        if (docs['id_doc']) {
            newStatus.id_doc = true
            docs['id_doc'].forEach(file => {
                documents.push({ name: file.originalname, reference: file.path });
            });
        }
        if (docs['address_doc']) {
            newStatus.address_doc = true
            docs['address_doc'].forEach(file => {
                documents.push({ name: file.originalname, reference: file.path });
            });
        }
        if (docs['account_doc']) {
            newStatus.account_doc = true
            docs['account_doc'].forEach(file => {
                documents.push({ name: file.originalname, reference: file.path });
            });
        }
        if (docs['profile']) {
            docs['profile'].forEach(file => {
                documents.push({ name: file.originalname, reference: file.path });
            });
        }
        if (docs['products']) {
            docs['products'].forEach(file => {
                documents.push({ name: file.originalname, reference: file.path });
            });
        }

        const updates = {
            documents,
            status: newStatus
        }

        const result = await usersService.updateUser(user.email, updates)
        res.send({ status: "success", payload: result });
    } catch (error) {
        req.logger.error(error.message)
        next(error)
    }
}
