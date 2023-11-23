import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'
import passport from "passport";
import nodemailer from 'nodemailer';
import { Faker, es } from '@faker-js/faker';
import CustomError from "./services/errors/CustomError.js";
import EErrors from "./services/errors/enums.js";
import { generateAuthorizationErrorInfo } from "./services/errors/info.js";


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

export const authorization = (roles) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                CustomError.createError({
                    name: 'Authorization error',
                    cause: 'Credenciales incorrectas, no autorizado',
                    message: 'Unauthorized',
                    code: EErrors.UNAUTHORIZED
                })
            }
            if (!roles.includes(req.user.role)) {
                CustomError.createError({
                    name: 'No permissions',
                    cause: generateAuthorizationErrorInfo(req.user.role),
                    message: 'Forbidden',
                    code: EErrors.FORBIDDEN
                })
            }
            next();
        } catch (error) {
            req.logger.error(error.message)
            next(error)
        }
    }
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