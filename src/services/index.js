import { Users, Products, Carts, Messages, Tickets, ResetCodes } from "../dao/factory.js";
import UsersRepository from "./usersRepository.js";
import ProductsRepository from "./productsRepository.js";
import CartsRepository from "./cartsRepository.js";
import MessagesRepository from "./messagesRepository.js";
import TicketsRepository from "./ticketsRepository.js";
import ResetCodesRepository from "./resetCodesRepository.js";

export const usersService = new UsersRepository(new Users());
export const productsService = new ProductsRepository(new Products());
export const cartsService = new CartsRepository(new Carts());
export const messagesService = new MessagesRepository(new Messages());
export const ticketsService = new TicketsRepository(new Tickets());
export const resetCodesService = new ResetCodesRepository(new ResetCodes());