import { usersService } from '../services/index.js';
import { createHash } from "../utils.js";
import jwt from 'jsonwebtoken';
import UserDTOCurrent from '../dao/DTOs/userDTOCurrent.js';

export const login = async (req, res) => {

    const serializedUser = {
        id: req.user._id,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        cart: req.user.cart,
        role: req.user.role
    }
    const token = jwt.sign(serializedUser, 'coderSecret', { expiresIn: '1h' })
    res.cookie('coderCookie', token, { maxAge: 3600000 }).send({ status: "success", payload: serializedUser });
}

export const githubCallback = async (req, res) => {

    const serializedUser = {
        id: req.user._id,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        cart: req.user.cart,
        role: req.user.role
    }

    const token = jwt.sign(serializedUser, 'coderSecret', { expiresIn: '1h' })
    res.cookie('coderCookie', token, { maxAge: 3600000 })
    res.redirect('/products')
}

export const failLogin = (req, res) => {
    res.status(401).send({ status: "error", error: "Failed login" })
}

export const register = async (req, res) => {
    res.send({ status: "success", message: "Usuario registrado" })
}

export const failRegister = async (req, res) => {
    console.log("Fallo la estrategia");
    res.status(400).send({ status: "error", error: 'Failed register' });
}

export const logout = (req, res) => {
    try {
        res.clearCookie('coderCookie');
        res.redirect('/');
    } catch (error) {
        return res.status(500).send({ status: 'error', error: 'Internal Server Error' });
    }
}

export const restartPassword = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ status: "error", error: "Datos incompletos" });
    }
    const user = await usersService.getUserByEmail( email );
    if (!user) {
        return res.status(404).send({ status: "error", error: "No existe el usuario" });
    }
    const passwordHash = createHash(password);
    const updates = { password: passwordHash }
    await usersService.updateUser(email , updates)
    res.send({ status: "success" })

}

export const current = (req, res) => {
    console.log(req.user)
    const user = new UserDTOCurrent(req.user)
    res.send({ status: "success", payload: user })
}