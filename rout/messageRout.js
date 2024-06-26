import express from "express"
import { getMessages, sendMessage } from "../routControlers/messageroutControler.js";
import isLogin from "../middleware/isLogin.js";

const router = express.Router();

router.post('/send/:id' , sendMessage)

router.get('/:id', getMessages);

export default router