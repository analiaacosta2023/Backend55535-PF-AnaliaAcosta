import { ticketModel } from '../../models/ticket.js'

class TicketMongo {

    constructor() {
    }

    getAll = async () => {

        const tickets = await ticketModel.find()
        return tickets.map(ticket => ticket.toObject());
    }

    createTicket = async (ticket) => {

        try {
            const result = await ticketModel.create(ticket);
            return result
        } catch (error) {
            throw error
        }
    }

    getTicket = async (tid) => {
        try {
            const result = await ticketModel.findById(tid).lean();
            return result
        } catch (error) {
            throw error
        }
    }
}

export default TicketMongo;