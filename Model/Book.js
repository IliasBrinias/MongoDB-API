const mongoose = require("mongoose");

const Book = mongoose.model("Book",new mongoose.Schema({
    title:{
        type:String,
        unique:true
    },
    dsc:String,
    pages:Number,
    publicationDate:Number,
    language:String,
    photo:{
        type:String,
        default:"default.png"
    }
}));

module.exports = Book;