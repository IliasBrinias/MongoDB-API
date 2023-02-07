const mongoose = require("mongoose");

const User = mongoose.model("User",new mongoose.Schema({
    name:String,
    age:Number,
    email:{
        type:String,
        lowercase:true,
        unique:true
    },
    photo:{
        type:String,
        default:"default.jpg"
    }
}));

module.exports = User;