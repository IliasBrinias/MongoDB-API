const response_code = require("../Constants/HttpResponse");
const error_msg = require("../Constants/ErrorMessages");
const multer = require("multer");

function checkInputPost(req, res, next) {
    if (req.body.title === undefined ||
        req.body.dsc === undefined ||
        req.body.pages === undefined ||
        req.body.publicationDate === undefined ||
        req.body.language === undefined ){
        return res.status(response_code.BAD_REQUEST).json({
            success:false,
            msg:error_msg.COMPLETE_ALL_THE_FIELDS
        });
    }
    next();
}

function checkInputFormat(req, res, next) {
    if (req.body.pages !=null) {
        if (isNaN(req.body.pages)) {
            return res.status(response_code.BAD_REQUEST).json({
                success: false,
                msg: error_msg.NO_VALID_AGE
            });
        }
    }
    next();
}

function checkInputPatch(req, res, next) {
    if (req.body.title === undefined &&
        req.body.dsc === undefined &&
        req.body.pages === undefined &&
        req.body.publicationDate === undefined &&
        req.body.language === undefined ){
        return res.status(response_code.BAD_REQUEST).json({
            success:false,
            msg:error_msg.COMPLETE_AT_LEAST_ONE_FIELD
        });
    }
    next();
}

module.exports = {
    checkInputPost,
    checkInputPatch,
    checkInputFormat
}