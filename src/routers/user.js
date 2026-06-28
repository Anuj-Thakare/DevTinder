const express = require("express");
const userRouter = express.Router();
const {userAuth} = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl skills age gender about"

//Get all pending connection request for the logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
      try{
         const loggedInUser = req.user;
         const connectionRequest = await ConnectionRequestModel.find({
             toUserId: loggedInUser._id,
             status: "Interested"
         }).populate("fromUserId", USER_SAFE_DATA);
         //}).populate("fromUserId", ["firstName", "lastName"]);

         if(!connectionRequest){
            return res.status(400).send("No pending request");
         }
         res.status(200).json({
             message: "Pending Requests",
             data: connectionRequest
         })
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
});

//All the persons who is connected to logged in user
userRouter.get("/user/connections", userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequestModel.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ], 
            status: "Accepted"
        }).populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequest.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.status(200).json({
            message: "Your Connections",
            data: data
        })
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
});

//This API will fetch all the user who has a account on devTinder
userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50:limit;
        const skip = (page - 1)*limit;

        const connectionRequest = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select( "fromUserId toUserId" )

        //Create Array
        // const hideUsers = [loggedInUser._id];

        // connectionRequest.forEach((request) => {
        //     if (request.fromUserId.toString() === loggedInUser._id.toString()) {
        //         hideUsers.push(request.toUserId);
        //     } else {
        //         hideUsers.push(request.fromUserId);
        //     }
        // });

        //create set
        const hideUsers = new Set();
        connectionRequest.forEach(req => {
            hideUsers.add(req.fromUserId.toString());
            hideUsers.add(req.toUserId.toString());
        })
        
        const users = await User.find({
            //_id: { $nin: hideUsers } This is for array
            $and: [
                {_id: { $nin: Array.from(hideUsers) }},
                {_id: { $ne: loggedInUser._id}}
            ]
        }).select("firstName lastName about age gender photoUrl skills").skip(skip).limit(limit);

        res.status(200).json({
            data: users
        });

    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});


module.exports = userRouter;
