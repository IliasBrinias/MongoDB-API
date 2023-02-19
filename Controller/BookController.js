const Book = require("../Model/Book");
const error_msg = require("../Constants/ErrorMessages");
const response_code = require("../Constants/HttpResponse");
const path = require("path");

const getBooks = (req, res) => {
    if (req.query.title != null){
        return findBookWithEmail(req, res);
    }
    Book.find({}, (err, books) => {
        if (err) {
            return res.status(response_code.SERVER_ERROR).json({
                success:false,
                message: err
            });
        }
        res.status(response_code.OK).json(books);
    });
};
const addBook = (req, res) => {
    const book = new Book({
        title:req.body.title,
        dsc:req.body.dsc,
        pages:req.body.pages,
        publicationDate:req.body.publicationDate,
        language:req.body.language
    })

    book.save({}, (err, book) => {
        if (err) {
            return res.status(response_code.BAD_REQUEST).json({
                success:false,
                msg:error_msg.BOOK_EXISTS
            });
        }
        res.status(response_code.OK).json(book);
    });

};
const getBook = (req, res) => {
    Book.findById(req.params.id, (err, book) => {
        if (book == null){
            return res.status(response_code.BAD_REQUEST).json({
                success:false,
                msg:error_msg.BOOK_NOT_FOUND
            });
        }
        res.status(response_code.OK).json(book);
    });
};
const updateBook = async (req, res) => {
    try {
        let updBook = await Book.findOneAndUpdate({_id: req.params.id}, req.body, {
            new: true,
            upsert: true
        });
        if (updBook == null) {
            res.status(response_code.BAD_REQUEST).json({
                message: error_msg.BOOK_NOT_FOUND
            });
        }
        res.json(updBook);
    } catch (error) {
        res.status(response_code.SERVER_ERROR).json({
            message: error.message
        });
    }
};
const deleteBook = async (req, res) => {
    Book.findByIdAndDelete(req.params.id,(err, book) => {
        if (book == null){
            return res.status(response_code.BAD_REQUEST).json({
                success:false,
                msg:error_msg.BOOK_NOT_FOUND
            });
        }
        res.status(response_code.OK).json();
    });
};
const findBookWithEmail = async (req, res) => {
    Book.find({email: {'$regex': req.query.title} },(err, books) => {
        if (books == null){
            return res.status(response_code.BAD_REQUEST).json({
                success:false,
                msg:error_msg.BOOK_NOT_FOUND
            });
        }
        const bookResponse = [];
        books.forEach(b=>bookResponse.push({title:b.title}));
        res.status(response_code.OK).json(bookResponse);
    });
};
const getPhoto = (req, res) => {
    Book.findById(req.params.id, async (err, book) => {
        if (book == null) {
            return res.status(response_code.BAD_REQUEST).json({
                success: false,
                msg: error_msg.BOOK_NOT_FOUND
            });
        }
        const fileName = book.photo
        const options = {
            root: path.join(__dirname, '/../photo/book/'),
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        }
        if (fileName === "default.png"){
            options.root = path.join(__dirname, '/../photo/');
        }
        res.sendFile(fileName, options, function (err) {
            if (err) {
                return res.status(response_code.BAD_REQUEST)
                    .json({
                        success: false,
                        msg: error_msg.BOOK_NOT_FOUND
                    });
            }
        })
    });
}
const uploadPhoto = (req, res) => {
    if (!req.file){
        return  res.status(response_code.BAD_REQUEST).json({
            message: error_msg.PHOTO_NOT_FOUND
        });
    }
    Book.findById(req.params.id, async (err, book) => {
        if (book == null) {
            return res.status(response_code.BAD_REQUEST).json({
                success: false,
                msg: error_msg.USER_NOT_FOUND
            });
        }
        book.photo = req.file.filename;
        const updBook = await Book.findOneAndUpdate({_id: req.params.id}, book, {
            new: true,
        });
        if (updBook == null) {
            res.status(response_code.BAD_REQUEST).json({
                message: error_msg.USER_NOT_FOUND
            });
        }
        res.status(response_code.OK).json(updBook);
    });
}

module.exports = {
    findBookWithEmail,
    deleteBook,
    updateBook,
    getBook,
    addBook,
    getBooks,
    getPhoto,
    uploadPhoto
}