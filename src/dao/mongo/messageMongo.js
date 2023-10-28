import { messageModel } from "../../models/message.js";

class MessageMongo {

    constructor() {
    }

    getAll = async () => {

        const messages = await messageModel.find()
        return messages.map(message => message.toObject());
    }

    saveMessage = async (message) => {

        try {
            const result = await messageModel.create(message);
            return result
        } catch (error) {
            throw error
        }
    }
}

export default MessageMongo;