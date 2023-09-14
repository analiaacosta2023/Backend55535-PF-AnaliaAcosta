import mongoose from 'mongoose';

const messagesCollection = 'message';

const messageSchema = new mongoose.Schema({

    user: {
        type: String,
        require: true,
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    },

    message: {
        type: String,
        require: true,
    }

})

export const messageModel = mongoose.model(messagesCollection, messageSchema);