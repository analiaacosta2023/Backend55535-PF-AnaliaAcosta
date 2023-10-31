import mongoose from 'mongoose';

const ticketsCollection = 'Tickets';

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    purchase_datetime: {
        type: Date,
        default: Date.now,
    },
    amount: Number,
    purchaser: {
        type: String,
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        require: true
    },
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products'
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
                _id: false
            }
        ]
    },
    status: {
        type: String,
        enum: ["Pending", "Processing", "Confirmed", "Shipped", "Out for Delivery", "Delivered", "Partially Shipped", "Canceled", "Refunded", "On Hold", "Returned", "Complete", "Failed"],
        default: "Pending"
    }
})

export const ticketModel = mongoose.model(ticketsCollection, ticketSchema);