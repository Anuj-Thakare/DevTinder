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
const userRouter = require("./routers/user");
const cors = require("cors");
const http = require("http");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routers/chat");

require('dotenv').config()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

// This will allow CORS preflight handling through the global middleware.
// Express 5 already supports OPTIONS for registered routes, so a separate app.options call is not needed here.
//This is used to convert JSON data to JS Object
app.use(express.json());
//This is use to read the cookie
app.use(cookieparses());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

const server = http.createServer(app);

initializeSocket(server);


connectDB().then(() => {
    console.log("Database connection successful");
    server.listen(process.env.PORT, () => {
        console.log("Server is created on port " + process.env.PORT);
    });   //Listen on some port
}).catch((err) => {
    console.log("Database connection failed");
});

