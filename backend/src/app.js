import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();


const app = express();

app.use(cors({
    origin: [
        // for 5173
        'http://localhost:5173',
        // for 3000
        'http://localhost:3000'
    ],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));




// --->Routes

import userRoutes from './Routes/user.routes.js';
import gymOwnerRoutes from './Routes/gymOwner.routes.js';



app.use('/api/users', userRoutes);
app.use('/api/gymOwner', gymOwnerRoutes);


export default app;