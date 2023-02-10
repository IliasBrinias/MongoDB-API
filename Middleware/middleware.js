const response_code = require("../Constants/HttpResponse");
const error_msg = require("../Constants/ErrorMessages");
const multer = require("multer");
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

const fileUpload = multer({
    limits: 500000,
    storage: multer.diskStorage({
        destination: (req,file,cb)=>{
            cb(null,`${__dirname}/../photo`);
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
    checkInputPost,
    checkInputPatch,
    checkInputFormat,
    fileUpload
}