const express = require('express');
const router = express.Router();
const userController = require("../Controller/UserController")
const middleware = require("../Middleware/middleware")

/* GET users listing. */
router.route('/')
    .get(userController.getAllUsers)
    .get(userController.findUserWithEmail)
    .post(middleware.checkAge, userController.addUser);

router.route('/:id')
    .get(userController.getUser)
    .patch(middleware.checkAge, userController.updateUser)
    .delete(userController.deleteUser);


module.exports = router;
