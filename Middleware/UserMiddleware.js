const response_code = require("../Constants/HttpResponse");
const error_msg = require("../Constants/ErrorMessages");
const multer = require("multer");
const Book = require("../Model/Book");
const MINE_TYPE_MAP = {
    'image/png':  'png',
    'image/jpeg': 'jpeg',
    'image/jpg':  'jpg',
}

function checkInputPost(req, res, next) {
    if (req.body.name === undefined || req.body.age === undefined || req.body.email === undefined ){
        return res.status(response_code.BAD_REQUEST).json({
            success:false,
            msg:error_msg.COMPLETE_ALL_THE_FIELDS
        });
    }
    next();
}

function checkInputFormat(req, res, next) {
    if (req.body.email !=null){
        const regExp = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
        if (!regExp.test(req.body.email)){
            return res.status(response_code.BAD_REQUEST).json({
                success:false,
                msg:error_msg.EMAIL_BAD_FORMAT
            });
        }
    }
    if (req.body.age !=null) {
        if (isNaN(req.body.age)) {
            return res.status(response_code.BAD_REQUEST).json({
                success: false,
                msg: error_msg.NO_VALID_AGE
            });
        }
        if (req.body.age < 18) {
            res.msg = error_msg.USE_API_WITH_CAUTION;
        }
    }
    next();
}
function checkInputPatch(req, res, next) {
    if (req.body.name === undefined && req.body.age === undefined && req.body.email === undefined){
        return res.status(response_code.BAD_REQUEST).json({
            success:false,
            msg:error_msg.COMPLETE_AT_LEAST_ONE_FIELD
        });
    }
    next();
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


module.exports = {
    checkInputPost,
    checkInputPatch,
    checkInputFormat
}