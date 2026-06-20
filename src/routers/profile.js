const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const User = require("../models/user");
const { validateProfileData, validateSignUpData } = require("../utils/validation");
//getProfile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try{
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(500).send("ERROR : "+err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try{
    if(!validateProfileData(req)){
        res.status(500).send("Invalid Field");
    }
    
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();

    res.json({Message: `${loggedInUser.firstName}, your profile is updated successfully`,
        Data: loggedInUser
    });
    }catch(err){
        res.status(500).send("ERROR " + err.message);
    }
})

module.exports = profileRouter;