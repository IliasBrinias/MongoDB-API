const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./Router/UserRouter');
const bookRouter = require('./Router/BookRouter');
const dotenv = require('dotenv');
const app = express();

dotenv.config({path: './config.env'});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//Router
app.use('/user', userRouter);
app.use('/book', bookRouter);
//DB connect
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL+process.env.DBNAME);

module.exports = app;
