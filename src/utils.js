import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer';
import { Faker, es } from '@faker-js/faker';

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