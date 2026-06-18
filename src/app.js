const express = require("express"); //Importing a express
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express(); //Creating a expressjs application or instance of expressjs application
const validator = require("validator");
const {validations} = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieparses = require("cookie-parser");
const jwt = require("jsonwebtoken");

//This is used to convert JSON data to JS Object
app.use(express.json());
//This is use to read the cookie
app.use(cookieparses());

//signUp 
app.post("/signUp", async (req, res) => {
    //console.log(req.body);
    
    try {
        validations(req);
        const userObj = req.body;
        // Either on schema level or we can do this
        // if(!validator.isEmail(req.body.emailId)){
        //     throw new Error("Invalid email id");
        // }

        // Either on schema level or we can do this
        // if(!validator.isStrongPassword(userObj?.password)){
        //     throw new Error("Password is not strong "+userObj.password);
        // }

        const {firstName, lastName, emailId, password} = req.body;
        //Use to hash the password
        const passwordHash = await bcrypt.hash(password, 10);
        //Creating a new instance of User model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });
        await user.save();
        res.send("User saved successfully");
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

//login
app.post("/login", async (req,res) => {
    try{
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Email or Password is Incorrect");
        }

        //This is use to check whether password is matched or not
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if(isPasswordMatch){

            //Create JWT token
            const token = await jwt.sign({_id: user._id}, "DEV@Tinder$790");
            console.log(token); 
            //Sends back a cookie with JWT to the user
            res.cookie("token", token);
            res.status(200).send("Login in successfully");
        }else{
            throw new Error("Email or Password is Incorrect");
        }
    }catch(err){
        res.status(500).send("ERROR : " + err.message);
    }
});


app.get("/profile", async (req, res) => {
    try{
        const cookies = req.cookies;
        const { token } = cookies;
        if(!token){
            throw new Error("Invalid Token");
        }
        const decodedMessage = await jwt.verify(token, "DEV@Tinder$790");
        const { _id } = decodedMessage;
        console.log("Logged in user is : " + _id);
        const user = await User.findById(_id);
        if(!user){
            throw new Error("User does not exist");
        }
        //console.log(cookies);
        res.send(user);
    }catch(err){
        res.status(500).send("ERROR : "+err.message);
    }
})

//get one user
app.get("/user", async (req, res) => {
    const userEmailId = req.body.emailId;

    try{
        const user = await User.findOne({emailId: userEmailId});
        if(!user){
            res.status(404).send("User not found");
        }else{
            res.send(user);
        }
    }catch(err){
        res.status(500).send("Something went wrong");
    }
    
})

//Get all user
app.get("/feed", async (req, res) => {
    try{
        const users = await User.find({});
        res.send(users);
    }catch(err){
        res.status(500).send("Something went wrong");
    }
})

//delete user
app.delete("/user", async (req, res) => {
    const userId = req.body.id;
    try{
        //await User.findByIdAndDelete(_id: userId);
        await User.findByIdAndDelete(userId);
        res.status(200).send("User deleted successfully");
    }catch(err){
        res.status(500).send("Something went wrong");
    }
})

//Update the user
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    try{
        const ALLOWED_UPDATE = ["photoUrl", "about", "gender", "age", "skills"];
        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATE.includes(k)
        );
        if(!isUpdateAllowed){
            throw new Error("Update not Allowed");
        }

        //Either on schema level or we can do this
        // if(data?.skills.length > 10){
        //     throw new Error("Skills can't be more than 10");
        // }

        const user = await User.findByIdAndUpdate(userId,
             data, 
             {returnDocument:"after", runValidators: true}
            );
        //console.log(user);
        res.send("User updated successfully");
    }catch(err){
        res.status(500).send("Failed to update user "+ err.message);
    }
})


connectDB().then(() => {
    console.log("Database connection successful");
    app.listen(3000, () => {
        console.log("Server is created on port 3000....");
    });   //Listen on some port
}).catch((err) => {
    console.log("Database connection failed");
});

