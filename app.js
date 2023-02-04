const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/user');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/user', usersRouter);

mongoose.connect('mongodb://127.0.0.1:27017/JsProject');

module.exports = app;
