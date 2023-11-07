import { resetCodeModel } from "../../models/resetCode.js";

class resetCodeMongo {
    constructor() {

    }
    getCode = async (email, code) => {
        try {
            const resetCode = await resetCodeModel.findOne({email, code}).lean();
            return resetCode
        } catch (error) {
            throw error
        }
    }
    saveCode = async (email, code) => {
        try {
            const newCode = await resetCodeModel.create({email, code});
            return newCode
        } catch (error) {
            throw error
        }
    }

    deleteCode = async (email, code) => {
        try {
            const newCode = await resetCodeModel.deleteOne({email, code});
            return newCode
        } catch (error) {
            throw error
        }
    }
}

export default resetCodeMongo;