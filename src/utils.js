import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'
import passport from "passport";
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { resetCodesService } from './services/index.js';
import { Faker, es } from '@faker-js/faker';
import CustomError from "./services/errors/CustomError.js";
import EErrors from "./services/errors/enums.js";
import {generateAuthorizationErrorInfo} from "./services/errors/info.js";


const faker = new Faker({ locale: [es] })

// Para handlebars
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

// Para bcrypt

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

// Para jwt con cookies

export const cookieExtractor = (req) => {
    let token;
    if (req && req.cookies) {
        token = req.cookies['coderCookie']
    }
    return token;
}

// Para manejo de errores con passport

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err);
            if (!user) {
                req.message = ((info.messages ? info.messages : info.toString()))
                return next();;
            }
            req.user = user;
            next();
        })(req, res, next)
    }
}

export const authorization = (role) => {
    return async (req, res, next) => {
        if (!req.user) {
            CustomError.createError({
                name: 'Authorization error',
                cause: 'Credenciales incorrectas, no autorizado',
                message: 'Unauthorized',
                code: EErrors.UNAUTHORIZED
            })
        }
        if (req.user.role != role) {
            CustomError.createError({
                name: 'No permissions',
                cause: generateAuthorizationErrorInfo(role),
                message: 'Forbidden',
                code: EErrors.FORBIDDEN
            })
        }
        next();
    }
}

// Para generar random code en reset password

export const generateRandomCode = () => {
    const codeLength = 6;
    return crypto.randomBytes(Math.ceil(codeLength / 2))
        .toString('hex')
        .slice(0, codeLength);
}

// Para enviar mail al usuario

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: 'analia.a.acosta@gmail.com',
        pass: 'apqa omgy zvqq zriw'

    }
})

export const sendEmailToUser = async (email, subject, html) => {

    const result = await transport.sendMail({
        from: 'Tu tienda de remeras <analia.a.acosta@gmail.com>',
        to: email,
        subject: subject,
        html: html

    })
    return (result);
}

// Validar codigo de recuperacion

export const validateResetCode = () => {
    return async (req, res, next) => {
        const { code, email, password } = req.body;
        if (!email || !password || !code) {
            return res.status(400).send({ status: "error", error: "Datos incompletos" });
        }

        const resetCode = await resetCodesService.getCode(email, code)

        if (!resetCode) {
            return res.status(404).json({ error: 'Código inválido' });
          }

          if (resetCode.expiresAt <= new Date()) {
            return res.status(400).json({ error: 'Código expirado' });
          }

          await resetCodesService.deleteCode(email, code)

        next();
    }
}

// Mocking

export const generateProduct = () => {
 return {
    _id: faker.database.mongodbObjectId(), 
    title: faker.commerce.product(),
    description: faker.commerce.productName(),
    code: faker.string.alphanumeric({ length: { min: 5, max: 10 } }),
    price: faker.commerce.price({ min: 10, max: 50 }),
    stock: faker.number.int({ max: 100 }),
    category: faker.commerce.department(),
    thumbnail: [faker.image.url(), faker.image.url()],
    status: faker.datatype.boolean()
 }
}