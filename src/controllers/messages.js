import { messagesService } from "../services/index.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";

export const getMessages = async (req, res, next) => {

    try {
        const messages = await messagesService.getAll();

        if (messages.length === 0) {
            return res.status(204).send('No content to return');
        }

        res.send({ status: "success", payload: messages });
    } catch (error) {
        req.logger.error(error.message)
        next(error)
    }
}

export const newMessage = async (req, res, next) => {

    const data = req.body;

    try {

        const requiredProperties = ['user', 'message'];
        const missingProperties = requiredProperties.filter(prop => !(prop in data));

        if (missingProperties.length > 0) {
            CustomError.createError({
                name: 'Message creation error',
                cause: `Faltan propiedades: ${missingProperties.join(', ')}`,
                message: `Missing required properties: ${missingProperties.join(', ')}`,
                code: EErrors.INVALID_PARAM_ERROR
            });
        }

        const message = await messagesService.saveMessage(data);
        res.send({ status: "success", payload: message });
    } catch (error) {
        req.logger.error(error.message)
        next(error)
    }
}