import express from "express";
import app from "./src/app.js";
import connectDB from "./src/dataBase/db.js";


const PORT= process.env.PORT || 5000;

connectDB();

app.listen(PORT,
    () => console.log(`Server running on port ${PORT}`)
);



