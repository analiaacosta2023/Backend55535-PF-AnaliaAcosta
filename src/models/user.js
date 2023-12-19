import mongoose from "mongoose";

const usersCollection = 'users';

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        require: true
    },
    last_name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        unique: true,
        require: true
    },
    age: Number,
    password: {
        type: String,
        require: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    },
    role: {
        type: String,
        enum: ["usuario", "admin", "premium"],
        default: "usuario"
    },
    documents: {
        type: [
            {
                name: String,
                reference: String
            }
        ]
    },
    last_connection: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: {
            id_doc: Boolean,
            address_doc: Boolean,
            account_doc: Boolean,
            _id: false
        },
        default: {
            id_doc: false,
            address_doc: false,
            account_doc: false
        }
    }
});

userSchema.pre('findOne', function () {
    this.populate('cart');
})

export const userModel = mongoose.model(usersCollection, userSchema)