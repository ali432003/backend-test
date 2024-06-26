import { cloudinaryUploader } from "../config/cloudinaryConfig.js";
import fs from "fs";
import User from "../Models/userModels.js";

export const imageUpload = async (req, res) => {
    try {
        const { id } = req.params; 

        const uploadResult = await cloudinaryUploader.upload(req.file.path);
        fs.unlinkSync(req.file.path); // Delete the temporary file after upload

        // Update user document with profile pic URL
        const user = await User.findByIdAndUpdate(
            id,
            { profilepic: uploadResult.secure_url }, 
            { new: true } 
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            data: user,
            status: true,
            message: "Image upload successfully!",
        });
    } catch (error) {
        res.status(500).json({
            data: [],
            status: false,
            message: error.message,
        });
    }
};
