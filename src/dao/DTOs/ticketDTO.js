export default class TicketDTO {
    constructor(ticket) {

        this.code = 'ORDER' + Date.now() + Math.floor(Math.random() * 10000 + 1);
            this.amount = ticket.total ? ticket.total : ticket.amount,
            this.purchaser = ticket.purchaser ? ticket.purchaser : ticket.email,
            this.products = ticket.products
    }
}