const express = require("express"); //Importing a express
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express(); //Creating a expressjs application or instance of expressjs application

//This is used to convert JSON data to JS Object
app.use(express.json());

app.post("/signUp", async (req, res) => {
    //console.log(req.body);
    const userObj = req.body;
    try {
        //Creating a new instance of User model
        const user = new User(userObj);
        await user.save();
        res.send("User saved successfully");
    } catch (err) {
        res.status(400).send("Error while saving the data: " + err.message);
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


connectDB().then(() => {
    console.log("Database connection successful");
    app.listen(3000, () => {
        console.log("Server is created on port 3000....");
    });   //Listen on some port
}).catch((err) => {
    console.log("Database connection failed");
});

