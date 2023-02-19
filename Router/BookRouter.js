const express = require('express');
const router = express.Router();
const bookController = require("../Controller/BookController")
const bookMiddleware = require("../Middleware/bookMiddleware")
const fileMiddleware = require("../Middleware/fileMiddleware")

router.route('/')
    .get(bookController.getBooks)
    .post(bookMiddleware.checkInputPost,bookMiddleware.checkInputFormat, bookController.addBook);

router.route('/:id/photo')
    .get(bookController.getPhoto)
    .post(fileMiddleware.checkIfBookExists,fileMiddleware.fileUpload.single("photo"), bookController.uploadPhoto);

router.route('/:id')
    .get(bookController.getBook)
    .patch(bookMiddleware.checkInputPatch,bookMiddleware.checkInputFormat, bookController.updateBook)
    .delete(bookController.deleteBook);

module.exports = router;
