import mongoose from 'mongoose';

const nutritionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: String, 
      required: true,
      // Stores as "2026-02-13" exactly
      default: () => new Date().toISOString().split('T')[0] 
    },
    calories: {
      type: Number,
      required: [true, 'Calories are required'],
      min: [0, 'Calories cannot be negative'],
    },
    protein: {
      type: Number,
      min: [0, 'Protein cannot be negative'],
    },
    carbs: {
      type: Number,
      min: [0, 'Carbs cannot be negative'],
    },
    fats: {
      type: Number,
      min: [0, 'Fat cannot be negative'],
    },
    steps: {
      type: Number,
      min: [0, 'Steps cannot be negative'],
      max: [50000, 'Steps cannot exceed 50,000'],
    },
  },
  { timestamps: true }
);

// Compound index to ensure one nutrition entry per user per day
nutritionSchema.index({ user: 1, date: 1 }, { unique: true });

export const Nutrition = mongoose.model('Nutrition', nutritionSchema);
