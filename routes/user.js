const express = require('express');
const router = express.Router();
const user = require("../models/User")
/* GET users listing. */
router.get('/', user.getAllUsers);

router.post('/',user.addUser);

module.exports = router;
