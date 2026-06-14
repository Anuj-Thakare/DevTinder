const express = require("express"); //Importing a express
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express(); //Creating a expressjs application or instance of expressjs application

app.post("/signUp", async (req, res) => {
    const userObj = {
        firstName: "Sunil",
        lastName: "Pandye",
        emailId: "sunilpande@gmail.com",
        password: "sunil@989",
        age: 39,
        gender: "Male"
    }
    try {
        const user = new User(userObj);
        await user.save();
        res.send("User saved successfully");
    } catch (err) {
        res.status(400).send("Error while saving the data: " + err.message);
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

