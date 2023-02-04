const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:String,
    age:Number,
    email:String
})
const user = mongoose.model("User",userSchema);

const getAllUsers = (req, res) => {
    user.find({}, (err, users) => {
        if (err) {
            return res.status(500).json({ message: err });
        }
        res.json(users);
    });
};
const addUser = (req, res) => {
    const newUser = new user({
        name:req.body.name,
        age:req.body.age,
        email:req.body.email,
    })
    newUser.save({}, (err, users) => {
        if (err) {
            return res.status(500).json({ message: err });
        }
        res.json(users);
    });
};
module.exports = {
    getAllUsers,
    addUser
}