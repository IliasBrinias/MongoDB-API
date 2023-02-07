const response_code = require("../Constants/HttpResponse");
const error_msg = require("../Constants/ErrorMessages");
const multer = require("multer");
const MINE_TYPE_MAP = {
    'image/png':  'png',
    'image/jpeg': 'jpeg',
    'image/jpg':  'jpg',
}

function checkAge(req, res, next) {
    const userAge = req.body.age;
    if (userAge < 18) {
        res.status(response_code.BAD_REQUEST).send({
            success:false,
            msg:error_msg.USE_API_WITH_CAUTION
        });
    } else {
        next();
    }
}

const fileUpload = multer({
    limits: 500000,
    storage: multer.diskStorage({
        destination: (req,file,cb)=>{
            cb(null,`${__dirname}/../public/img/user`);
        },
        filename:(req,file,cb)=>{
            cb(null,file.originalname);
        }
    }),
    fileFilter:(req,file,cb) => {
        const isValid = file.mimetype in MINE_TYPE_MAP;
        let error = isValid? null: new Error(error_msg.INVALID_MINE_TYPE);
        cb(error,isValid);
    }
})

module.exports = {
    checkAge,
    fileUpload
}