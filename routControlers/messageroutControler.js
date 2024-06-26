import Conversation from "../Models/conversationModels.js";
import Message from "../Models/messageSchema.js";
import User from "../Models/userModels.js";
import { getReceiverSocketId, io } from "../Socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const { messages } = req.body;
        const { id: reciverId } = req.params;
        const senderId = req.user._conditions._id;


        let chats = await Conversation.findOne({
            participants: { $all: [senderId, reciverId] }
        })

        if (!chats) {
            chats = await Conversation.create({
                participants: [senderId, reciverId],
            })
        }

        const newMessages = new Message({
            senderId,
            reciverId,
            message: messages,
            conversationId: chats._id
        })

        if (newMessages) {
            chats.messages.push(newMessages._id);
        }

        await Promise.all([chats.save(), newMessages.save()]);

        //SOCKET.IO function 
        const reciverSocketId = getReceiverSocketId(reciverId);
        if (reciverSocketId) {
            io.to(reciverSocketId).emit("newMessage", newMessages)
        }


        res.status(201).send(newMessages)

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(`error in sendMessage ${error}`);
    }
}


export const getMessages = async (req, res) => {
    try {
        const { id: reciverId } = req.params;
        const senderId = req.user._conditions._id;

        const chats = await Conversation.findOne({
            participants: { $all: [senderId, reciverId] }
        }).populate("messages")

        if (!chats) return res.status(200).send([]);
        const message = chats.messages;
        res.status(200).send(message)

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(`error in getMessage ${error}`);
    }
}

//  i 'm working here 

export const deleteMsg = async (req, res) => {
    const { id: messageId } = req.params;
    const senderId = req.user._conditions._id;

    try {
        
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).send({
                success: false,
                message: "Message not found"
            });
        }

        // Check if the sender is authorized to delete the message
        if (message.senderId.toString() !== senderId.toString()) {
            return res.status(403).send({
                success: false,
                message: "You are not authorized to delete this message"
            });
        }

        // Remove the message from the Messages collection
        await message.remove();

        // Remove the message ID from the corresponding Conversation document
        const conversation = await Conversation.findById(message.conversationId);

        if (conversation) {
            conversation.messages = conversation.messages.filter(
                (msgId) => msgId.toString() !== messageId.toString()
            );
            await conversation.save();
        }

        res.status(200).send({
            success: true,
            message: "Message deleted successfully"
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: `Error deleting message: ${error.message}`
        });
        console.log(`Error in deleteMsg: ${error}`);
    }
};
