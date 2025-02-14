var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
var app = express();
// mongodb+srv://user-mihai:2FLQ3m87qr5fFP35@cluster0.qyhcm.mongodb.net/accounts?retryWrites=true&w=majority

// mongodb+srv://demo:demo@cluster0.nvhvm.mongodb.net/demo?retryWrites=true&w=majority

mongoose.connect(
  "mongodb+srv://user-mihai:2FLQ3m87qr5fFP35@cluster0.qyhcm.mongodb.net/accounts?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
);

const corsOptions = {
  origin: "*", // chestie de security
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Content-Length",
    "X-Requested-With",
    "Accept",
  ],
  mehods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  optionSuccessStatus: 200, // some lagecy browsers (IE11, smartTVs) 204
};
app.use(cors(corsOptions));

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
