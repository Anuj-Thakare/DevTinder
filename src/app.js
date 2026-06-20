const express = require("express"); //Importing a express
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express(); //Creating a expressjs application or instance of expressjs application
const validator = require("validator");
const cookieparses = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middleware/auth");
const authRouter = require('./routers/auth');
const profileRouter = require('./routers/profile');
const requestRouter = require('./routers/request');

//This is used to convert JSON data to JS Object
app.use(express.json());
//This is use to read the cookie
app.use(cookieparses());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

app.delete("/logout", userAuth, async (req, res) => {
    try{
        const user = req.body.emailId;

        if(!user){
            throw new Error("Need to login first");
        }
        const id = user._id;
        await User.findByIdAndDelete(id);

        res.status(200).send("Logout Successfully");
    }catch(err){
        res.status(500).send("ERROR " + err.message);
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

