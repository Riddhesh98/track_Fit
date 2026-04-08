import express from "express";
import {
  signin,
  signup,
  logout,
  requestUser,
  getMyUsers,
  getUserDetails,
  createSubscription,
  getSubscription,
  addUserWithSubscription,
  removeUser,
} from "../Controllers/gymOwner.controller.js";
import { verifyOwner } from "../Middleware/owner.middleware.js";

const router = express.Router();

// /api/gymOwner
router.post("/signup", signup);
router.post("/login", signin);
router.post("/logout", logout);

// Owner → User link (legacy)
router.post("/request-user", verifyOwner, requestUser);

// Add user by email + create subscription in one step
router.post("/add-user-with-subscription", verifyOwner, addUserWithSubscription);

// Get all users linked to this owner (with subscription status)
router.get("/my-users", verifyOwner, getMyUsers);

// Get single user details
router.get("/user/:userId", verifyOwner, getUserDetails);

// Subscription (for renewals)
router.post("/subscription", verifyOwner, createSubscription);
router.get("/subscription/:userId", verifyOwner, getSubscription);

// Remove user from gym
router.delete("/user/:userId", verifyOwner, removeUser);

export default router;