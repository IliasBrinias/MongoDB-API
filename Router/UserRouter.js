const express = require('express');
const router = express.Router();
const userController = require("../Controller/UserController")
const userMiddleware = require("../Middleware/UserMiddleware")
const fileMiddleware = require("../Middleware/FileMiddleware")

router.route('/')
    .get(userController.getUsers)
    .post(userMiddleware.checkInputPost,userMiddleware.checkInputFormat, userController.addUser);

router.route('/:id/photo')
    .get(userController.getPhoto)
    .post(fileMiddleware.checkIfUserExists,fileMiddleware.fileUpload.single("photo"), userController.uploadPhoto);

router.route('/:id')
    .get(userController.getUser)
    .patch(userMiddleware.checkInputPatch,userMiddleware.checkInputFormat, userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
