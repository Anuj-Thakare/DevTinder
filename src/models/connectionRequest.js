const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum:{
            values: ["Ignored", "Interested", "Accepted", "Rejected"],
            messsage: `{VALUES} is not a status type`
        },
        required: true
    }
},{
    timestamps: true
});

connectionRequestSchema.index({fromUserId: 1, toUserId: 1});

//This method will call befor the every save
connectionRequestSchema.pre('save', function(next){
    const connectionRequest = this;

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Can't send connection request to yourself!!")
    }
})


const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;