import express from 'express';
import __dirname from "./utils.js";
import { Server } from "socket.io";
import productsRouter from "./routes/products.js"
import cartsRouter from "./routes/carts.js"
import messagesRouter from './routes/messages.js'
import viewsRouter from "./routes/views.js"
import sessionsRouter from './routes/sessions.js'
import mockingRouter from './routes/mocking.js'
import loggerRouter from './routes/logger.js'
import handlebars from "express-handlebars";
import {productsService} from "./services/index.js"
import passport from 'passport';
import { initializePassport } from './config/passport.js';
import cookieParser from 'cookie-parser'
import config from './config/config.js'
import errorHandler from './middlewares/errors/index.js'
import { addLogger } from './utils/logger.js';

const app = express();

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

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/sessions', sessionsRouter);
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

    const {docs} = await productsService.getAll({});
    io.emit('products', docs);

    socket.on('new-product', async data => {

        try {
            await productsService.addProduct(data.message);

            const {docs} = await productsService.getAll({});

            io.emit('products', docs);

        } catch (error) {
            io.emit('error', error);
        }
    })

    socket.on('delete-product', async data => {

        try {
            await productsService.deleteProduct(data.message);

            const {docs} = await productsService.getAll({});

            io.emit('products', docs);

        } catch (error) {
            io.emit('error', error.message);
        }
    })

    socket.on('message', async data => {

        try {

            io.emit('messageLogs', data);

        } catch (error) {

            io.emit('error', error.message);
        }

    })

    socket.on('authenticated', async data => {
        socket.broadcast.emit('newUserConnected', data);
                    io.emit('messageLogs', data);
    })

})