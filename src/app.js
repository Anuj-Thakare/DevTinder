const express = require("express"); //Importing a express

const app = express(); //Creating a expressjs application or instance of expressjs application

const {adminAuth, userAuth} = require("./middleware/auth")

app.get("/", (req, res) => {
    res.send("Server Created and Running");
}); //Handling a incomming request or listing to request

app.get("/hello", (req, res) => {
    res.send("Hello hello hello");
}); //Handling a incomming request or listing to request

app.get("/test", (req, res) => {
    res.send("Hello from the server");
}); //Handling a incomming request or listing to request



app.listen(3000, () => {
    console.log("Server is created on port 3000....");
});   //Listen on some port