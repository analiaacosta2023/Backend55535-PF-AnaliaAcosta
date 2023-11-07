export default class ResetCodesRepository {
    constructor(dao) {
        this.dao = dao
    }

    getCode = async (email, code) => {
        const resetCode = await this.dao.getCode(email, code);
        return resetCode
    }

    saveCode = async (email, code) => {
        const newCode = await this.dao.saveCode(email, code);
        return newCode
    }


    deleteCode = async (email, code) => {
        const deletedCode = await this.dao.deleteCode(email, code);
        return deletedCode
    }

}