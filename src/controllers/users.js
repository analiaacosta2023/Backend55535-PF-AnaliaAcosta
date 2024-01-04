import { usersService } from "../services/index.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { generateObjectIdErrorInfo } from "../services/errors/info.js";
import mongoose from 'mongoose';
import { sendEmailToUser } from "../utils.js";
import getUserDTO from "../dao/DTOs/getUserDTO.js";

export const getUsers = async (req, res, next) => {
    try {

        const users = await usersService.getAll();

        if (users.length === 0) {
            return res.status(204).send('No content to return');
        }

        res.send({ status: "success", payload: users });
    } catch (error) {
        req.logger.error(error.message)
        next(error)
    }
}

export const deleteInactiveUsers = async (req, res, next) => {
    try {

        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        const query = {
            last_connection: { $lt: twoDaysAgo },
        }

        // Para testing
/*         const halfHourAgo = new Date();
        halfHourAgo.setMinutes(halfHourAgo.getMinutes() - 30);

        const query = {
            last_connection: { $lt: halfHourAgo },
        } */

        const users = await usersService.getMany(query);

        if (users.length === 0) {
            return res.status(204).send({ message: 'No content to return' });
        }

        await usersService.deleteMany(query);

        const subject = "Usuario eliminado por inactividad"
        let rejectedEmails = []

        for (const user of users) {

            const email = user.email
            const html = `<h1>Usuario eliminado</h1><p>Tu usuario en nuestra tienda fue eliminado por inactividad.<br>Esperamos verte pronto de regreso.</p>`
            const result = await sendEmailToUser(email, subject, html)

            if (result.rejected.length > 0) {
                rejectedEmails.push(email)
            }
        }

        res.send({ status: "success", payload: { users, rejectedEmails } });
    } catch (error) {
        req.logger.error(error.message)
        next(error)
    }
}

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
                name: 'User get error',
                cause: `No se encontró al usuario con el id ${uid}`,
                message: 'User not found',
                code: EErrors.ROUTING_ERROR
            })
        }

        res.send({ status: "success", payload: user });
    } catch (error) {
        req.logger.error(error.message)
        next(error)
    }
}

export const deleteUserById = async (req, res, next) => {

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

        const user = await usersService.deleteUserById(uid);

        if (!user) {
            CustomError.createError({
                name: 'User delete error',
                cause: `No se encontró al usuario con el id ${uid}`,
                message: 'User not found',
                code: EErrors.ROUTING_ERROR
            })
        }

        const subject = "Usuario eliminado"

        const email = user.email
        const html = `<h1>Usuario eliminado</h1><p>Tu usuario en nuestra tienda fue eliminado por decisión del admin.<br>Contactate por los medios disponibles para restablecer tu cuenta.</p>`
        const result = await sendEmailToUser(email, subject, html)

        if (result.rejected.length > 0) {
            CustomError.createError({
                name: 'Email rejected',
                cause: `No se puedo enviar el email a ${email}`,
                message: "El email fue rechazado.",
                code: EErrors.INVALID_PARAM_ERROR
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
                    name: 'Faltan cargar documentos',
                    cause: `Faltan cargar documentos`,
                    message: 'Cannot update user',
                    code: EErrors.INVALID_PARAM_ERROR
                })
            }
            updates = { role: 'premium' }
        }

        await usersService.updateUser(user.email, updates)
        const updatedUser = new getUserDTO(await usersService.getUserById(user._id))
        res.send({ status: "success", payload: updatedUser });
    } catch (error) {
        req.logger.error(error.message)
        next(error)
    }
}

export const saveDocuments = async (res, req, next) => {

    const uid = req.req.params.uid;

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

        const docs = req.req.files

        if (!docs) {
            CustomError.createError({
                name: 'Docs post error',
                cause: 'Se debe adjuntar un archivo',
                message: 'Error saving docs',
                code: EErrors.INVALID_PARAM_ERROR
            })
        }

        let newStatus = user.status || {
            id_doc: false,
            address_doc: false,
            account_doc: false
        }

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
        res.res.send({ status: "success", payload: result });
    } catch (error) {
        req.req.logger.error(error.message)
        next(error)
    }
}
