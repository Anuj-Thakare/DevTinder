const express = require("express"); //Importing a express

const app = express(); //Creating a expressjs application or instance of expressjs application

app.use("/hello", (req, res) => {
    res.send("Hello hello hello");
}); //Handling a incomming request or listing to request

app.use("/test", (req, res) => {
    res.send("Hello from the server");
}); //Handling a incomming request or listing to request

app.use("/", (req, res) => {
    res.send("Server Created and Running");
}); //Handling a incomming request or listing to request

app.listen(3000, () => {
    console.log("Server is created on port 3000....");
});   //Listen on some port