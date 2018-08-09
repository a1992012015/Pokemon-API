/**
 * Created by 圆环之理 on 2018/8/4.
 *
 * 功能：项目入口
 *
 */
'use strict';

const createError = require("http-errors");
const FileStreamRotator = require("file-stream-rotator");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const fs = require("fs");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const childRouter = require("./routes/child");
const requestAbility = require("./getData/requestAbility");// 爬取特性列表信息

// require("./getData/requestProp");

const app = express();

requestAbility();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// 自定义token
morgan.token('from', function(req, res){
    return req.query.from || '-';
});

morgan.format('dev', '[dev] :date[iso] :remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms');

const logDirectory = path.join(__dirname, 'log');

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
const accessLogStream = FileStreamRotator.getStream({
    date_format: 'YYYYMMDD',
    filename: path.join(logDirectory, 'access-%DATE%.log'),
    frequency: 'daily',
    verbose: false
});

app.use(morgan('dev', {stream: accessLogStream}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/child', childRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
