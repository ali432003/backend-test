import express from "express"
import dotenv from 'dotenv'
import dbConnect from "./DB/dbConnect.js";
import authRouter from './rout/authUser.js'
import messageRouter from './rout/messageRout.js'
import userRouter from './rout/userRout.js'
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors"
import { app, server } from './Socket/socket.js'
import { cloudinaryConfig } from './config/cloudinaryConfig.js';


// const __dirname = path.resolve();

dotenv.config();


app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: "https://chatappmernbyme.netlify.app",
    credentials: true
}));

//Cloudinary Config
cloudinaryConfig()

app.get("/", (req, res) => {
    res.json({ message: "Welcome to chatapp" })
})
app.use('/auth', authRouter)
app.use('/message', messageRouter)
app.use('/user', userRouter)
// app.use(express.static(path.join(__dirname, "./frontend/dist")))

// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"))
// })

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
    dbConnect();
    console.log(`Running at http://localhost:${PORT}`);
})