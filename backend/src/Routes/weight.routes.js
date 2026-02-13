import express from "express";
import { addWeight, getWeightData, deleteWeight, updateWeight } from "../controllers/weight.controller.js";
import isAuthenticated from "../Middleware/user.middleware.js";


const router = express.Router();

router.post("/add", isAuthenticated, addWeight);
router.get("/data", isAuthenticated, getWeightData);
// New Routes 👇
router.delete("/delete/:id", isAuthenticated, deleteWeight);
router.put("/edit/:id", isAuthenticated, updateWeight);

export default router;