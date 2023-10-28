import {Messages} from '../dao/factory.js'

const messageManager = new Messages()

export const getMessages = async (req, res) => {

    try {
        const messages = await messageManager.getAll();
        res.send({ status: "success", payload: messages });
    } catch (error) {
        res.status(404).send({ status: 'error', message: error.message })
    }

}

export const newMessage = async (req, res) => {

    const data = req.body;

    try {
        const message = await messageManager.saveMessage(data);
        res.send({ status: "success", payload: message });
    } catch (error) {
        res.status(404).send({ status: 'error', message: error.message })
    }
}