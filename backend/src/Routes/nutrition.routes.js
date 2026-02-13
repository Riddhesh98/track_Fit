import express from "express"
import {addNutrition,getLast10DaysNutrition ,editNutritionEntry ,deleteNutritionEntry} from "../Controllers/nutrition.controller.js"
import userMiddleware from "../Middleware/user.middleware.js";

const router = express.Router();

// /api/nutrition
router.post("/add", 
    userMiddleware,
    addNutrition);
router.get("/last10days",
    userMiddleware,
    getLast10DaysNutrition);
router.put("/edit/:id", userMiddleware, editNutritionEntry);
router.delete("/delete/:id", userMiddleware, deleteNutritionEntry);




export default router