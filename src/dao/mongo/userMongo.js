import { userModel } from "../../models/user.js";

class UserMongo {

    constructor() {
    }

    getAll = async () => {

        const users = await userModel.find()
        return users.map(user => user.toObject());
    }

    getMany = async (query) => {
        try {
          const users = await userModel.find(query)
          return users.map(user => user.toObject());  
        } catch (error) {
            throw error
        }
    }

    deleteMany = async (query) => {
        try {
          const result = await userModel.deleteMany(query)
          return result  
        } catch (error) {
            throw error
        }
    }

    addUser = async (user) => {

        try {
            const result = await userModel.create(user);
            return result
        } catch (error) {
            throw error
        }
    }

    getUserById = async (id) => {

        try {
            const user = await userModel.findById(id).lean();
            return user
        } catch (error) {
            throw error
        }
    }

    deleteUserById = async (id) => {

        try {
            const user = await userModel.findByIdAndDelete(id);
            return user
        } catch (error) {
            throw error
        }
    }

    getUserByEmail = async (email) => {

        try {
            const user = await userModel.findOne({email}).lean();
            return user
        } catch (error) {
            throw error
        }
    }

    updateUser = async (email, updates) => {
        try {
            const result = await userModel.updateOne({ email }, { $set: updates })

            return result;
        } catch (error) {
            throw error
        }
    }

}

export default UserMongo;