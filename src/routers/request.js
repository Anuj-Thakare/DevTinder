const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(500).json({message: "Enter the correct user id"});
        }

        const allowedStatus = ["Interested", "Ignored"];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                 message: "Invalid Status " + status,
                 status
                });
        }

        const existingRequest = await ConnectionRequestModel.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId , toUserId: fromUserId}
            ]
        });

        if(existingRequest){
            return res.status(400).send("Connection Request Already Exist");
        }

        const connectionRequests = new ConnectionRequestModel({
         fromUserId,
         toUserId,
         status
        });

        //Before save its checking fromUserId is equal to toUserId in schema level only
        const data = await connectionRequests.save();
        res.status(200).json({
        message: req.user.firstName + " is " + status + " in " + toUser.firstName,
        data
    })
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
})


requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const { status, requestId } = req.params;

        const allowedStatus = ["Accepted", "Rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message: "Status is not allowed"
            });
        }
        const connectionRequest = await ConnectionRequestModel.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "Interested"
        });

        if(!connectionRequest){
            return res.status(404).json({
                message: "Request does not exist"
            });
        }
        connectionRequest.status = status;
        await connectionRequest.save();
        res.status(200).json({
            message: "Request " + status,
            connectionRequest
        })
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
})

module.exports = requestRouter;