const User = require("../Model/User");
const error_msg = require("../Constants/ErrorMessages");
const response_code = require("../Constants/HttpResponse");

const getAllUsers = (req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            return res.status(response_code.SERVER_ERROR).json({
                success:false,
                message: err
            });
        }
        res.json(users);
    });
};
const addUser = (req, res) => {

    if (req.body.name === undefined || req.body.age === undefined || req.body.email === undefined){
        return res.status(response_code.BAD_REQUEST).json({
            success:false,
            msg:error_msg.COMPLETE_ALL_THE_FIELDS
        });
    }
    const regExp = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
    if (!regExp.test(req.body.email)){
        return res.status(response_code.BAD_REQUEST).json({
            success:false,
            msg:error_msg.EMAIL_BAD_FORMAT
        });
    }
    if (isNaN(req.body.age)) {
        return res.status(response_code.BAD_REQUEST).json({
            success:false,
            msg:error_msg.NO_VALID_AGE
        });
    }

    const user = new User({
        name:req.body.name,
        age:req.body.age,
        email:req.body.email,
    })
    user.save({}, (err, user) => {
        if (err) {
            return res.status(response_code.BAD_REQUEST).json({
                success:false,
                msg:error_msg.USER_EXISTS
            });
        }
        res.json(user);
    });
};
const getUser = (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (user === null){
            return res.status(response_code.BAD_REQUEST).json({
                success:false,
                msg:error_msg.USER_NOT_FOUND
            });
        }
        res.json(user);
    });
};
const updateUser = async (req, res) => {
    try {
        if (req.body.age !== undefined){
            if (req.body.age<18) return res.status(response_code.BAD_REQUEST).send(error_msg.USE_API_WITH_CAUTION);
        }
        const updUser = await User.findOneAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (updUser === undefined) {
            res.status(response_code.BAD_REQUEST).json({
                message: error_msg.USER_NOT_FOUND
            });
        }
        res.json(updUser);
    } catch (error) {
        res.status(response_code.SERVER_ERROR).json({
            message: error.message
        });
    }
};
const deleteUser = async (req, res) => {
    User.findByIdAndDelete(req.params.id,(err, user) => {
        if (user === null){
            return res.status(response_code.BAD_REQUEST).json({
                success:false,
                msg:error_msg.USER_NOT_FOUND
            });
        }
        res.json(user);
    });
};
const findUserWithEmail = async (req, res) => {
    User.find(req.query.email,(err, user) => {
        if (user === null){
            return res.status(response_code.BAD_REQUEST).json({
                success:false,
                msg:error_msg.USER_NOT_FOUND
            });
        }
        res.json(user);
    });
};

module.exports = {
    getAllUsers,
    addUser,
    getUser,
    updateUser,
    deleteUser,
    findUserWithEmail
}