import express from 'express'
import isLogin from '../middleware/isLogin.js'
import { getCorrentChatters, getUserBySearch, getUserForProfile } from '../routControlers/userhandlerControler.js'
const router = express.Router()
import upload from "../middleware/multer.js";
import { imageUpload } from "../routControlers/imageUpload.js"

router.get('/search',isLogin,getUserBySearch);

router.get('/currentchatters',isLogin,getCorrentChatters)

router.put("/imageupload/:id", upload.single("userImg"), imageUpload);

export default router