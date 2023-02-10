const express = require('express');
const router = express.Router();
const userController = require("../Controller/UserController")
const middleware = require("../Middleware/middleware")

router.route('/')
    .get(userController.getUsers)
    .post(middleware.checkInputPost,middleware.checkInputFormat, userController.addUser);

router.route('/:id/photo')
    .get(userController.getPhoto)
    .post(middleware.fileUpload.single("photo"), userController.uploadPhoto);

router.route('/:id')
    .get(userController.getUser)
    .patch(middleware.checkInputPatch,middleware.checkInputFormat, userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
