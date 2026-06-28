const express = require('express');
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { userAuth } = require("../middleware/auth");


//signUp 
authRouter.post("/signUp", async (req, res) => {
    //console.log(req.body);

    try {
        validateSignUpData(req);
        //const userObj = req.body;
        // Either on schema level or we can do this
        // if(!validator.isEmail(req.body.emailId)){
        //     throw new Error("Invalid email id");
        // }

        // Either on schema level or we can do this
        // if(!validator.isStrongPassword(userObj?.password)){
        //     throw new Error("Password is not strong "+userObj.password);
        // }

        const { firstName, lastName, emailId, password } = req.body;
        //Use to hash the password
        const passwordHash = await bcrypt.hash(password, 10);
        //Creating a new instance of User model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });
        const savedUser = await user.save();
        //Create JWT token
        const token = await savedUser.getJWT();
        //console.log(token); 
        //Sends back a cookie with JWT to the user and it will expires in next 8 hrs
        res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000), httpOnly: true });
        res.status(200).json({message: "User saved successfully", data: savedUser});
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

//login
authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Email or Password is Incorrect");
        }

        //This is use to check whether password is matched or not
        const isPasswordMatch = await user.vaildatePassword(password);

        if (isPasswordMatch) {

            //Create JWT token
            const token = await user.getJWT();
            //console.log(token); 
            //Sends back a cookie with JWT to the user and it will expires in next 8 hrs
            res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000), httpOnly: true });
            res.status(200).json({message: "User logged in successfully", data: user});
        } else {
            throw new Error("Email or Password is Incorrect");
        }
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

//logout
authRouter.post("/logout", async (req, res) => {
    try {
        res.cookie("token", null, { expires: new Date(Date.now()) });
        res.send("logout successfully");
    } catch (err) {
        res.status(400).send("ERROR " + err.message);
    }
})

module.exports = authRouter;