var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const cors = require("cors")
var logger = require('morgan');
const dotenv = require("dotenv")
dotenv.config()
const connectdb = require("./config/db")
connectdb()

const { predictPitch } = require('./services/gradio.service');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var uploadRouter = require('./routes/upload');
var taskRouter = require('./routes/Task')
var pitchRouter = require('./routes/pitch')
var profileRouter = require('./routes/profile')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: "https://taskhiveinvincibles.vercel.app/",
  credentials: true
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/task',taskRouter);
app.use('/api/pitch',pitchRouter)
app.use('/api/profile',profileRouter)

const warmupGradio = async () => {
  try {
    if (!process.env.FRIEND_API_URL) {
      console.log('Gradio warmup skipped — FRIEND_API_URL is not set');
      return;
    }

    await predictPitch('warmup');
    console.log('Gradio warmed up ✓');
  } catch (error) {
    console.log('Gradio warmup failed — will retry on first request');
    console.log(error?.message || error);
  }
};

warmupGradio()

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
