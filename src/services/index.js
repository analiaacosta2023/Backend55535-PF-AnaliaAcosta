import { Users, Products, Carts, Messages, Tickets, ResetTokens } from "../dao/factory.js";
import UsersRepository from "./usersRepository.js";
import ProductsRepository from "./productsRepository.js";
import CartsRepository from "./cartsRepository.js";
import MessagesRepository from "./messagesRepository.js";
import TicketsRepository from "./ticketsRepository.js";
import ResetTokensRepository from "./resetTokensRepository.js";

export const usersService = new UsersRepository(new Users());
export const productsService = new ProductsRepository(new Products());
export const cartsService = new CartsRepository(new Carts());
export const messagesService = new MessagesRepository(new Messages());
export const ticketsService = new TicketsRepository(new Tickets());
export const resetTokensService = new ResetTokensRepository(new ResetTokens());