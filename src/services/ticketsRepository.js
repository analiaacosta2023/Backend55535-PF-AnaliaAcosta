import TicketDTO from "../dao/DTOs/ticketDTO.js";
export default class TicketsRepository {
    constructor(dao) {
        this.dao = dao
    }

    getAll = async () => {
        const tickets = await this.dao.getAll();
        return tickets
    }

    createTicket = async (ticket) => {
        const newTicket = new TicketDTO(ticket)
        const result = await this.dao.createTicket(newTicket);
        return result
    }

    getTicket = async (id) => {
        const ticket = await this.dao.getTicket(id);
        return ticket
    }
}