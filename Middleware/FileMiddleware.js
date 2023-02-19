const multer = require("multer");
const error_msg = require("../Constants/ErrorMessages");
const Book = require("../Model/Book");
const User = require("../Model/User");
const response_code = require("../Constants/HttpResponse");
const MINE_TYPE_MAP = {
    'image/png':  'png',
    'image/jpeg': 'jpeg',
    'image/jpg':  'jpg',
}
function checkIfUserExists(req, res, next){
    User.findById(req.params.id, (err, book) => {
        if (book === null){
            return res.status(response_code.BAD_REQUEST).json({
                success:false,
                msg:error_msg.USER_NOT_FOUND
            });
        }
        next();
    });
}
function checkIfBookExists(req, res, next){
    Book.findById(req.params.id, (err, book) => {
        if (book === null){
            return res.status(response_code.BAD_REQUEST).json({
                success:false,
                msg:error_msg.BOOK_NOT_FOUND
            });
        }
        next();
    });
}
const fileUpload = multer({
    limits: 500000,
    storage: multer.diskStorage({
        destination: (req,file,cb)=>{
            let url = req.originalUrl;
            let folder = url.substring(0,url.split("/",2).join("/").length);
            cb(null,`${__dirname}/../photo${folder}`);
        },
        filename:(req,file,cb)=>{
            cb(null,req.params.id+"."+MINE_TYPE_MAP[file.mimetype]);
        }
    }),
    fileFilter:(req,file,cb) => {
        const isValid = file.mimetype in MINE_TYPE_MAP;
        let error = isValid? null: new Error(error_msg.INVALID_MINE_TYPE);
        cb(error,isValid);
    }
})

module.exports = {
    fileUpload,
    checkIfBookExists,
    checkIfUserExists
};