import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:3000'
    ],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// --->Routes
import userRoutes from './Routes/user.routes.js';
import nutritionRoutes from './Routes/nutrition.routes.js';
import weightRoutes from './Routes/weight.routes.js';
import PRRoutes from './Routes/PR.routes.js';
import aiRoutes from './Routes/ai.routes.js';
import gymOwnerRoutes from './Routes/gymOwner.routes.js';

app.use('/api/users', userRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/weight', weightRoutes);
app.use('/api/pr', PRRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/gymOwner', gymOwnerRoutes);

export default app;