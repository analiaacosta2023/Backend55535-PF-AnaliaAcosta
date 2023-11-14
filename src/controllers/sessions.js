import { usersService, resetCodesService } from '../services/index.js';
import { createHash, generateRandomCode, sendEmailToUser } from "../utils.js";
import jwt from 'jsonwebtoken';
import UserDTOCurrent from '../dao/DTOs/userDTOCurrent.js';
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import {generateGetUserByEmailErrorInfo, generateEmailErrorInfo} from "../services/errors/info.js";

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
    CustomError.createError({
        name: 'Login error',
        cause: 'Credenciales incorrectas',
        message: "Failed login",
        code: EErrors.UNAUTHORIZED
    })
}

export const register = async (req, res) => {
    res.send({ status: "success", message: "Usuario registrado" })
}

export const failRegister = async (req, res) => {
    CustomError.createError({
        name: 'Register error',
        cause: 'Fallo la estrategia',
        message: "Failed register",
        code: EErrors.INVALID_PARAM_ERROR
    })
}

export const logout = (req, res) => {
    try {
        res.clearCookie('coderCookie');
        res.redirect('/');
    } catch (error) {
        CustomError.createError({
            name: 'Internal Server Error',
            cause: 'Error del servidor',
            message: error.message,
            code: EErrors.SERVER_ERROR
        })
    }
}

export const resetPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        CustomError.createError({
            name: 'Email error',
            cause: "No se ingresó email válido",
            message: 'Not valid email',
            code: EErrors.INVALID_PARAM_ERROR
        })
    }
    const user = await usersService.getUserByEmail(email);
    if (!user) {
        CustomError.createError({
            name: 'User get error',
            cause: generateGetUserByEmailErrorInfo(email),
            message: 'User not found',
            code: EErrors.INVALID_PARAM_ERROR
        })
    }

    const code = generateRandomCode();

    const newCode = await resetCodesService.saveCode(email, code);

    if (!newCode) {
        CustomError.createError({
            name: 'Internal Server Error',
            cause: 'Error guardando el código de recuperación.',
            message: 'Error saving code',
            code: EErrors.SERVER_ERROR
        })
    }

    const subject = "Código de recuperación de tu contraseña"

    const html = `<p>El código para recuperar tu contraseña es: ${code}<br>Si no fuiste tú quién lo solicitó, ignora este mensaje.</p>`

    const result = await sendEmailToUser(email, subject, html)

    if (result.rejected.length > 0) {
        CustomError.createError({
            name: 'Email rejected',
            cause: generateEmailErrorInfo(email),
            message: "El email con el código de recuperación fue rechazado.",
            code: EErrors.INVALID_PARAM_ERROR
        })
    }

    res.status(200).json({ message: 'Código de recuperación enviado exitosamente' });
}

export const restartPassword = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const passwordHash = createHash(password);
    const updates = { password: passwordHash }
    await usersService.updateUser(email, updates)
    res.send({ status: "success" })

}

export const current = (req, res) => {
    
    if(!req.user) {
        req.logger.error('No authenticated user')
        return res.send({ status: "error", message: 'No authenticated user' })
    }

    const user = new UserDTOCurrent(req.user)
    res.send({ status: "success", payload: user })
}