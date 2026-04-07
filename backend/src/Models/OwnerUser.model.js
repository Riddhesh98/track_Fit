import mongoose from "mongoose";

const ownerUserSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GymOwner",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
}, { timestamps: true });

// prevent duplicate linking
ownerUserSchema.index({ ownerId: 1, userId: 1 }, { unique: true });

export const OwnerUser =
  mongoose.models.OwnerUser || mongoose.model("OwnerUser", ownerUserSchema);