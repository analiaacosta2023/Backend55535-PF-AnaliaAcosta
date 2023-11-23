import { resetTokenModel } from "../../models/resetToken.js";

class resetTokenMongo {
    constructor() {

    }
    getToken = async (email, token) => {
        try {
            const resetToken = await resetTokenModel.findOne({email, token}).lean();
            return resetToken
        } catch (error) {
            throw error
        }
    }
    saveToken = async (email, token) => {
        try {
            const newToken = await resetTokenModel.create({email, token});
            return newToken
        } catch (error) {
            throw error
        }
    }

    deleteToken = async (email) => {
        try {
            const newToken = await resetTokenModel.deleteOne({email});
            return newToken
        } catch (error) {
            throw error
        }
    }
}

export default resetTokenMongo;