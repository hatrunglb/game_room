import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './libs/db.js';
import cookieParser from 'cookie-parser';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import { protctedRoute } from './middlewares/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3108;

// middlewares

app.use(express.json());
app.use(cookieParser());

app.get('/test', (req, res) => {
    res.send("Cổng 3108 đã thông!");
});

// publich routes
app.use('/api/auth', authRoute);

// private routes
app.use(protctedRoute);
app.use('/api/users', userRoute);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server start on port ${PORT}`)
    })
})
