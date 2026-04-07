import express from 'express';
import userMiddleware from '../Middleware/user.middleware.js';
import {getAICoachResponse} from '../Controllers/ai.controller.js';

const router = express.Router();

router.post("/ask", userMiddleware, getAICoachResponse);


export default router;