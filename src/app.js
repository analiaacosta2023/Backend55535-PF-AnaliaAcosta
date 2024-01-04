import express from 'express';
import __dirname, {sendEmailToUser} from "./utils.js";
import { Server } from "socket.io";
import productsRouter from "./routes/products.js"
import cartsRouter from "./routes/carts.js"
import messagesRouter from './routes/messages.js'
import viewsRouter from "./routes/views.js"
import sessionsRouter from './routes/sessions.js'
import mockingRouter from './routes/mocking.js'
import loggerRouter from './routes/logger.js'
import usersRouter from './routes/users.js'
import handlebars from "express-handlebars";
import { productsService, messagesService } from "./services/index.js"
import passport from 'passport';
import { initializePassport } from './config/passport.js';
import cookieParser from 'cookie-parser'
import config from './config/config.js'
import errorHandler from './middlewares/errors/index.js'
import { addLogger } from './utils/logger.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express'

const app = express();

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentacion de e-commerce',
            description: 'API pensada para el curso de Desarrollo Backend de Coderhouse'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use(addLogger)

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars')

app.use(cookieParser());
initializePassport();
app.use(passport.initialize());

app.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerJSDoc(swaggerOptions)))
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/users', usersRouter)
app.use('/', viewsRouter);
app.use('/mockingproducts', mockingRouter);
app.use('/loggerTest', loggerRouter);

const server = app.listen(config.port, () => {
    console.log('Server ON')
})

app.use(errorHandler);

// socket server
const io = new Server(server)

io.on('connection', async (socket) => {
    console.log("Nuevo cliente conectado")

    const { docs } = await productsService.getAll({limit: 80});
    io.emit('products', docs);

    const messages = await messagesService.getAll();
    io.emit('messageLogs', messages);

    socket.on('new-product', async data => {

        try {
            await productsService.addProduct(data.message);

            const { docs } = await productsService.getAll({limit: 80});

            io.emit('products', docs);

        } catch (error) {
            io.emit('error', error);
        }
    })

    socket.on('delete-product', async data => {

        try {
            const result = await productsService.deleteProduct(data.message);

            if(result.owner && result.owner !=='admin'){
                const subject = "Producto eliminado"
                const email = result.owner
                const html = `<h1>Producto eliminado</h1><p>Tu producto ${result.title} fue eliminado de nuestra tienda por decisión del admin.<br>Contactate por los medios disponibles si querés restablecer tu producto.</p>`
                await sendEmailToUser(email, subject, html)
            }

            const { docs } = await productsService.getAll({limit: 80});

            io.emit('products', docs);

        } catch (error) {
            io.emit('error', error.message);
        }
    })

    socket.on('message', async data => {

        try {

            await messagesService.saveMessage(data);

            const messages = await messagesService.getAll();

            io.emit('messageLogs', messages);

        } catch (error) {

            io.emit('error', error.message);
        }

    })

    socket.on('authenticated', async data => {

        try {
            socket.broadcast.emit('newUserConnected', data);
            const messages = await messagesService.getAll();

            io.emit('messageLogs', messages);

        } catch (error) {
            io.emit('error', error.message);
        }

    })

})