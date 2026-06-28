const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const User = require("../models/user");
const bycrypt = require("bcrypt");
const { validateProfileData, validateSignUpData, validateForgotPassword } = require("../utils/validation");
//getProfile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try{
        const user = req.user;
        res.status(200).json({message: "User Fetch Successfully", data: user});
    }catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
});

profileRouter.put("/profile/edit", userAuth, async (req, res) => {
    try{
    if(!validateProfileData(req)){
        return res.status(400).send("Invalid Field");
    }
    
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();

    res.json({Message: `${loggedInUser.firstName}, your profile is updated successfully`,
        data: loggedInUser
    });
    }catch(err){
        res.status(400).send("ERROR " + err.message);
    }
})

profileRouter.patch("/profile/forgotPassword", userAuth, async (req, res) => {
    try{
        validateForgotPassword(req);
        const {oldPassword, newPassword, confirmNewPassword } = req.body;
        const user = req.user;
        const _id = user._id;
        const hashPassword = user.password;
        const isMatches = await bycrypt.compare(oldPassword, hashPassword);
        if(!isMatches){
            throw new Error("Password does not matched");
        }
        if(newPassword != confirmNewPassword){
            throw new Error("New Password and Confirm New Password does not match");
        }
        const newPass = await bycrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(_id, {password: newPass});
        res.send("Passward updated successfully");
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
})

module.exports = profileRouter;