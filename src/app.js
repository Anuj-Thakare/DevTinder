const express = require("express"); //Importing a express

const app = express(); //Creating a expressjs application or instance of expressjs application

//This will handle only get API calls
app.get("/user", (req, res) => {
    res.send("This is the GET API Call");
});

//This will handle only post API calls
app.post("/user", (req, res) => {
    res.send("This is the POST API Call");
});

//This will handle only patch API call
app.patch("/user", (req, res) => {
    res.send("This is the PATCH API Call");
});

//This will handle only DELETE API Call
app.delete("/user", (req, res) => {
    res.send("This is the DELETE API Call");
});

//This will match all the HTTP method API calls to /test
app.use("/test", (req, res) => {
    res.send("Hello from the server");
}); //Handling a incomming request or listing to request


app.listen(3000, () => {
    console.log("Server is created on port 3000....");
});   //Listen on some port