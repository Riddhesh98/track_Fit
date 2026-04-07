import express from "express";
import {createPR,editPR,deletePR,getAllPRs} from "../Controllers/PR.controller.js";
import userMiddleware from "../Middleware/user.middleware.js";


const router = express.Router();

router.post("/create",userMiddleware,createPR);
router.put("/edit/:id",userMiddleware,editPR);
router.delete("/delete/:id",userMiddleware,deletePR);
router.get("/all",userMiddleware,getAllPRs);




export default router;