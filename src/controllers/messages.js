import { messagesService } from "../services/index.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";

export const getMessages = async (req, res) => {

    try {
        const messages = await messagesService.getAll();
        res.send({ status: "success", payload: messages });
    } catch (error) {
        CustomError.createError({
            name: 'Messages get error',
            cause: 'Error del servidor, no se pueden obtener los mensajes',
            message: error.message,
            code: EErrors.SERVER_ERROR
        })
    }
}

export const newMessage = async (req, res) => {

    const data = req.body;

    try {
        const message = await messagesService.saveMessage(data);
        res.send({ status: "success", payload: message });
    } catch (error) {
        CustomError.createError({
            name: 'Create message error',
            cause: 'Error al guardar mensaje',
            message: error.message,
            code: EErrors.INVALID_PARAM_ERROR
        })
    }
}