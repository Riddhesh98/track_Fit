import mongoose from "mongoose";
import jwt from "jsonwebtoken";
const gymOwnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false,
    },
    gymOwnerToken:{
        type: String,

    }

},
{
    timestamps: true
}

);

gymOwnerSchema.methods.generateGymOwnerToken = function () {
    return jwt.sign({ id: this._id }, process.env.GYM_OWNER_SECRET, {
      expiresIn: 30 * 24 * 60 * 60,
    });
  };



export const GymOwner = mongoose.model('GymOwner', gymOwnerSchema);