import mongoose from "mongoose";

let spaceSchema =new mongoose.Schema({
    name: {
        type:String,
        required: true,
        trim:true
    },
    location: {
        type:String,
        required: true,
        trim:true
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId, // the value stored in an _id, not a String
        ref:"User", // that _id belongs to "User" model
        required: true, // a space can't exist without an admin
    }
})


let Space= mongoose.model("Space",spaceSchema)

export default Space