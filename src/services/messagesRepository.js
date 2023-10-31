export default class MessagesRepository {
    constructor(dao) {
        this.dao = dao
    }

    getAll = async () => {
        const messages = await this.dao.getAll();
        return messages
    }

    saveMessage = async (message) => {
        const result = await this.dao.saveMessage(message);
        return result
    }

}