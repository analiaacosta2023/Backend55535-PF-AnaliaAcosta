export default class ResetTokensRepository {
    constructor(dao) {
        this.dao = dao
    }

    getToken = async (email, token) => {
        const resetToken = await this.dao.getToken(email, token);
        return resetToken
    }

    saveToken = async (email, token) => {
        const newToken = await this.dao.saveToken(email, token);
        return newToken
    }


    deleteToken = async (email) => {
        const deletedToken = await this.dao.deleteToken(email);
        return deletedToken
    }

}