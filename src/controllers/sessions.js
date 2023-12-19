import { usersService, resetTokensService } from '../services/index.js';
import { createHash, sendEmailToUser, isValidPassword } from "../utils.js";
import jwt from 'jsonwebtoken';
import UserDTOCurrent from '../dao/DTOs/userDTOCurrent.js';
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { generateGetUserByEmailErrorInfo, generateEmailErrorInfo } from "../services/errors/info.js";
import config from '../config/config.js'

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

    const updates = { last_connection: new Date() }
    await usersService.updateUser(serializedUser.email, updates)

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

    const updates = { last_connection: new Date() }
    await usersService.updateUser(serializedUser.email, updates)

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

export const logout = async (req, res, next) => {
    try {
        if (!req.user) {
            res.redirect('/');
        }

        const updates = { last_connection: new Date() }
        await usersService.updateUser(req.user.email, updates)

        res.clearCookie('coderCookie');
        res.redirect('/');
    } catch (error) {
        req.logger.error(error.message)
        next(error)
    }
}

export const resetPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
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
                code: EErrors.ROUTING_ERROR
            })
        }

        const token = jwt.sign({ email }, config.restartPassKey, { expiresIn: '1h' });

        const newToken = await resetTokensService.saveToken(email, token);

        if (!newToken) {
            CustomError.createError({
                name: 'Internal Server Error',
                cause: 'Error guardando el token de recuperación.',
                message: 'Error saving code',
                code: EErrors.SERVER_ERROR
            })
        }

        const subject = "Recuperación de tu contraseña";
        const changePasswordLink = `http://localhost:8080/restartpassword/${token}`;

        const html = `<p>Haz clic en el siguiente enlace para cambiar tu contraseña:</p>
        <button><a href="${changePasswordLink}">Link</a></button>`

        const result = await sendEmailToUser(email, subject, html)

        if (result.rejected.length > 0) {
            CustomError.createError({
                name: 'Email rejected',
                cause: generateEmailErrorInfo(email),
                message: "El email para la recuperación de la contraseña fue rechazado.",
                code: EErrors.INVALID_PARAM_ERROR
            })
        }

        res.status(200).json({ message: 'Email de recuperación enviado exitosamente' });
    } catch (error) {
        req.logger.error(error.message)
        next(error)
    }

}

export const restartPassword = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {

        let user = await usersService.getUserByEmail(email);

        if (!user) {
            CustomError.createError({
                name: 'User get error',
                cause: generateGetUserByEmailErrorInfo(email),
                message: 'User not found',
                code: EErrors.ROUTING_ERROR
            })
        }

        if (isValidPassword(user, password)) {
            CustomError.createError({
                name: 'Password rejected',
                cause: 'No se permite el uso de contraseñas anteriores.',
                message: "This password is not allowed",
                code: EErrors.INVALID_PARAM_ERROR
            })
        }

        await resetTokensService.deleteToken(email)
        const passwordHash = createHash(password);
        const updates = { password: passwordHash }
        await usersService.updateUser(email, updates)
        res.send({ status: "success" })
    } catch (error) {
        req.logger.error(error.message)
        next(error)
    }
}

export const current = (req, res) => {

    if (!req.user) {
        req.logger.error('No authenticated user')
        return res.send({ status: "error", message: 'No authenticated user' })
    }

    const user = new UserDTOCurrent(req.user)
    res.send({ status: "success", payload: user })
}