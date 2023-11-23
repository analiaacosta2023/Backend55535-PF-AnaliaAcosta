import mongoose from 'mongoose';

const resetTokensCollection = 'reset tokens';

const resetTokenSchema = new mongoose.Schema({

    email: { type: String, required: true },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, expires: 3600 }
  });

export const resetTokenModel = mongoose.model(resetTokensCollection , resetTokenSchema);