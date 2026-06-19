const express = require("express"); //Importing a express
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express(); //Creating a expressjs application or instance of expressjs application
const validator = require("validator");
const {validations} = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieparses = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middleware/auth");

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
        const isPasswordMatch = await user.vaildatePassword(password);

        if(isPasswordMatch){

            //Create JWT token
            const token = await user.getJWT();
            //console.log(token); 
            //Sends back a cookie with JWT to the user and it will expires in next 8 hrs
            res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000), httpOnly: true });
            res.status(200).send("Login in successfully");
        }else{
            throw new Error("Email or Password is Incorrect");
        }
    }catch(err){
        res.status(500).send("ERROR : " + err.message);
    }
});


app.get("/profile", userAuth, async (req, res) => {
    try{
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(500).send("ERROR : "+err.message);
    }
})

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const user = req.user;
    res.send(user.firstName + " sends the connection request");
})


connectDB().then(() => {
    console.log("Database connection successful");
    app.listen(3000, () => {
        console.log("Server is created on port 3000....");
    });   //Listen on some port
}).catch((err) => {
    console.log("Database connection failed");
});

