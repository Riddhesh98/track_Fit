import mongoose from 'mongoose';
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
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
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [13, 'Age must be at least 13'],
      max: [120, 'Invalid age'],
    },
    gender: {
        required: [true, 'Gender is required'],
      type: String,
      enum: ['male', 'female', 'other'],
    },
    height: {
      type: Number,
      min: [50, 'Height must be at least 50 cm'],
      max: [300, 'Invalid height'],
    },
    // Extra fields for fitness app
    weight: {
      type: Number,
      min: [20, 'Invalid weight'],
      max: [500, 'Invalid weight'],
    },
    frequency:{
      type: String,
    
    },
    userToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true }
);

//token generate for USER_SECRET

userSchema.methods.generateUserToken = function () {
  return jwt.sign({ id: this._id }, process.env.USER_SECRET, {
    expiresIn: 30 * 24 * 60 * 60,
  });
};






export const User = mongoose.model('User', userSchema);
