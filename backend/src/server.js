import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './libs/db.js';
import cookieParser from 'cookie-parser';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import friendRoute from './routes/friendRoute.js';
import messageRoute from "./routes/messageRoute.js";
import conversationRoute from "./routes/conversationRoute.js";
import { protctedRoute } from './middlewares/authMiddleware.js';
import cors from 'cors';
import { app, server } from './socket/index.js';
import { v2 as cloudinary } from "cloudinary";


dotenv.config();

const PORT = process.env.PORT || 3108;

// middlewares

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))

// CLOUDINARY Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.get('/test', (req, res) => {
    res.send("Cổng 3108 đã thông!");
});

// publich routes
app.use('/api/auth', authRoute);

// private routes
app.use(protctedRoute);
app.use('/api/users', userRoute);
app.use('/api/friends', friendRoute);
app.use("/api/messages", messageRoute);
app.use("/api/conversations", conversationRoute);

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`server start on port ${PORT}`)
    })
})
