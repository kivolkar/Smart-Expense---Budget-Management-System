import dotenv from "dotenv";

dotenv.config();

import express from "express";
import connectDB from "./config/database.js";

connectDB();

const app = express();

app.use(express.json());

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
