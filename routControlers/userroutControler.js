import User from "../Models/userModels.js";
import bcryptjs from 'bcryptjs'
import jwtToken from '../utils/jwtwebToken.js'

export const userRegister = async (req, res) => {
    try {
        const { fullname, username, email, gender, password } = req.body;

        const user = await User.findOne({ username, email });
        if (user) return res.status(500).json({ success: false, message: " UserName or Email Alredy Exist " });
        const hashPassword = bcryptjs.hashSync(password, 10);


        const newUser = new User({
            fullname,
            username,
            email,
            password: hashPassword,
            gender,
        })

        if (newUser) {
            await newUser.save();
            jwtToken(newUser._id, res)
        } else {
            res.status(500).json({ success: false, message: "Inavlid User Data" })
        }

        res.status(201).json({
            _id: newUser._id,
            fullname: newUser.fullname,
            username: newUser.username,
            email: newUser.email,
            message:"user is registered"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
        console.log(error);
    }
}

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (!user) return res.status(500).json({ success: false, message: "Email Dosen't Exist Register" })
        const comparePasss = bcryptjs.compareSync(password, user.password || "");
        if (!comparePasss) return res.status(500).json({ success: false, message: "Email Or Password dosen't Matching" })

        jwtToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            profilepic: user.profilepic,
            email: user.email,
            gender:user.gender,
            message: `Hey! ${user.username}`
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        })
        console.log(error);
    }
}


export const userLogOut = async (req, res) => {

    try {
        res.cookie("jwt", '', {
            maxAge: 0
        })
        res.status(200).json({ success: true, message: "User Logged Out" })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        })
        console.log(error);
    }
}

