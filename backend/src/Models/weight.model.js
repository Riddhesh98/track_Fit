import mongoose from "mongoose";

const weightSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    date: {
      type: String, // Storing as "YYYY-MM-DD" to ensure uniqueness
      required: true,
      default: () => new Date().toISOString().split('T')[0]
    },
  },
  { timestamps: true }
);

// Compound index: One weight entry per user per day
weightSchema.index({ user: 1, date: 1 }, { unique: true });

export const Weight = mongoose.model("Weight", weightSchema);