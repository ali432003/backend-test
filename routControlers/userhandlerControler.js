import Conversation from "../Models/conversationModels.js";
import User from "../Models/userModels.js";

export const getUserBySearch = async (req, res) => {
    try {
        const search = req.query.search || '';
        const currentUserID = req.user._conditions._id;
        const user = await User.find({
            $and: [
                {
                    $or: [
                        { username: { $regex: '.*' + search + '.*', $options: 'i' } },  // this $option makes it reliable wheather user is typing in upperCase or lower
                        { fullname: { $regex: '.*' + search + '.*', $options: 'i' } }   // for other users we have to search by their username 
                    ]
                }, {
                    _id: { $ne: currentUserID }  // this is for we donot want to search ourselves like if we are searching ali and i have also username ali i didnt want my name to appear in searchbox
                }
            ]
        }).select("-password").select("email")  // it removes password and email from the user obj for security purposes

        res.status(200).json(user)

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        })
        console.log(error);
    }
}


export const getCorrentChatters = async (req, res) => {
    try {
        const currentUserID = req.user._conditions._id;
        const currenTChatters = await Conversation.find({
            participants: currentUserID //getting both participants id
        }).sort({
            updatedAt: -1    // by default mongoDB sort firsly added doc i want to make it which is recently updated to sort it we use .sort()
        });

        if (!currenTChatters || currenTChatters.length === 0) return res.status(200).json([]);  //if there is no current chatter like if we are lonely :(

        // this is for reducing the full name of currently logged in user with currentParticepants 

        const partcipantsIDS = currenTChatters.reduce((ids, conversation) => {
            const otherParticipents = conversation.participants.filter(id => id !== currentUserID);
            return [...ids, ...otherParticipents]
        }, [])

        const otherParticipentsIDS = partcipantsIDS.filter(id => id.toString() !== currentUserID.toString());

        const user = await User.find({ _id: { $in: otherParticipentsIDS } }).select("-password").select("-email");  //neglecting pass and email

        const users = otherParticipentsIDS.map(id => user.find(user => user._id.toString() === id.toString()));

        res.status(200).json(users)

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        })
        console.log(error);
    }
}

export const getUserForProfile = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.json({ message: "ID parameter not provided" });
        }

        const user = await User.findOne({ _id: id }); // Use id directly in query
        if (user) {
            return res.json({ status: true, data: user });
        } else {
            return res.json({ message: "User not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};