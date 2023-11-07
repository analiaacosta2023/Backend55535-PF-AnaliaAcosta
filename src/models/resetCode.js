import mongoose from 'mongoose';

const resetCodesCollection = 'reset codes';

const resetCodeSchema = new mongoose.Schema({

    email: { type: String, required: true },
    code: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, expires: 3600 }
  });

export const resetCodeModel = mongoose.model(resetCodesCollection , resetCodeSchema);