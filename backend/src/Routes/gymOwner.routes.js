import express from "express"
import { signin, signup, logout } from "../Controllers/gymOwner.controller.js";

const router = express.Router();

// /api/gymOwner
router.post("/signup", signup);
router.post("/login", signin);
router.post("/logout", logout);


export default router