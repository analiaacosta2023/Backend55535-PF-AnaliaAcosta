import UserDTO from "../dao/DTOs/userDTO.js";
import getUserDTO from "../dao/DTOs/getUserDTO.js";

export default class UsersRepository {
    constructor(dao) {
        this.dao = dao
    }

    getAll = async () => {
        const users = await this.dao.getAll();

        return users.map(user => new getUserDTO(user))
    }

    addUser = async (user) => {
        const newUser = new UserDTO(user)
        const result = await this.dao.addUser(newUser);
        return result
    }

    getUserById = async (id) => {
        const user = new getUserDTO(await this.dao.getUserById(id));
        return user
    }

    deleteUserById = async (id) => {
        const user = await this.dao.deleteUserById(id);
        return user
    }

    getUserByEmail = async (email) => {
        const user = await this.dao.getUserByEmail(email);
        return user
    }

    updateUser = async (email, updates) => {
        const result = await this.dao.updateUser(email, updates);
        return result
    }
}