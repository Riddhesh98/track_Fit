import express from "express";
import { signup,
         login,
         logout,
         updateProfile ,
         fetchUserData
     } from "../Controllers/user.controller.js";
import userMiddleware from "../Middleware/user.middleware.js"; 

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update",
     userMiddleware,
     updateProfile);

router.get("/me",
     userMiddleware,
     fetchUserData);



export default router;