const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect
    ("mongodb+srv://Anuj1942:anujthakare@datastore.ougzmr6.mongodb.net/devTinder");
};

module.exports = connectDB;
