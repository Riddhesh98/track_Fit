import express from "express"
import { signin, signup, logout,requestUser } from "../Controllers/gymOwner.controller.js";
import { verifyOwner } from "../Middleware/owner.middleware.js";

const router = express.Router();

// /api/gymOwner
router.post("/signup", signup);
router.post("/login", signin);
router.post("/logout", logout);

router.post("/request-user", verifyOwner, requestUser);

export default router