const express = require("express");
const { userAuth } = require("../middleware/auth");
const Chat = require("../models/Chat");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
    try{
        const { targetUserId } = req.params;
        const userId = req.user._id;
        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
        }).populate({
            path: "messages.senderId",
            select: "firstName lastName",
        });

        if(!chat){
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: [],
            });
            await chat.save();
            return res.status(200).json({ message: "Chat created successfully", data: chat});
        }
        res.status(200).json({ message: "Chat already exists", data: chat });
    }catch(err){
        res.status(400).json({ message: "Error creating chat"});
    }
})

module.exports = chatRouter;