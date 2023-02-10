const User = require("../Model/User");
const error_msg = require("../Constants/ErrorMessages");
const response_code = require("../Constants/HttpResponse");
const path = require("path");

const uploadPhoto = (req, res) => {
    if (!req.file){
        return  res.status(response_code.BAD_REQUEST).json({
            message: error_msg.PHOTO_NOT_FOUND
        });
    }
    User.findById(req.params.id, async (err, user) => {
        if (user === null) {
            return res.status(response_code.BAD_REQUEST).json({
                success: false,
                msg: error_msg.USER_NOT_FOUND
            });
        }
        user.photo = req.file.filename;
        const updUser = await User.findOneAndUpdate({_id: req.params.id}, user, {
            new: true,
        });
        if (updUser === undefined) {
            res.status(response_code.BAD_REQUEST).json({
                message: error_msg.USER_NOT_FOUND
            });
        }
        res.json(updUser);
    });
}
const getPhoto = (req, res) => {
    User.findById(req.params.id, async (err, user) => {
        if (user === null) {
            return res.status(response_code.BAD_REQUEST).json({
                success: false,
                msg: error_msg.USER_NOT_FOUND
            });
        }
        const fileName = user.photo
        if (fileName === "default.png"){
            return res.status(response_code.BAD_REQUEST).json({
                success: false,
                msg: error_msg.PHOTO_NOT_FOUND
            });
        }
        const options = {
            root: path.join(__dirname, '/../photo/'),
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        }
        res.sendFile(fileName, options, function (err) {
            if (err) {
                return res.status(response_code.BAD_REQUEST)
                          .json({
                              success: false,
                              msg: error_msg.USER_NOT_FOUND
                          });
            }
        })
    });
}
const getUsers = (req, res) => {
    if (req.query.email != null){
        return findUserWithEmail(req, res);
    }
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

    const user = new User({
        name:req.body.name,
        age:req.body.age,
        email:req.body.email
    })

    user.save({}, (err, user) => {
        if (err) {
            return res.status(response_code.BAD_REQUEST).json({
                success:false,
                msg:error_msg.USER_EXISTS
            });
        }
        res.json({
            id:user.id,
            name:user.name,
            age:user.age,
            email:user.email,
            msg:res?.msg
        });
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
            if (req.body.age<18) res.msg = error_msg.USE_API_WITH_CAUTION;
        }
        let updUser = await User.findOneAndUpdate({_id: req.params.id}, req.body, {
            new: true,
            upsert: true
        });
        if (updUser === undefined) {
            res.status(response_code.BAD_REQUEST).json({
                message: error_msg.USER_NOT_FOUND
            });
        }
        res.json({
            id:updUser.id,
            name:updUser.name,
            age:updUser.age,
            email:updUser.email,
            msg:res?.msg
        });
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
        res.json();
    });
};
const findUserWithEmail = async (req, res) => {
    User.find({email: {'$regex': req.query.email} },(err, users) => {
        if (users === null || users === undefined){
            return res.status(response_code.BAD_REQUEST).json({
                success:false,
                msg:error_msg.USER_NOT_FOUND
            });
        }
        const userResponse = [];
        users.forEach(u=>userResponse.push({name:u.name}));
        res.json(userResponse);
    });
};
module.exports = {
    getUsers,
    addUser,
    getUser,
    updateUser,
    deleteUser,
    uploadPhoto,
    getPhoto
}