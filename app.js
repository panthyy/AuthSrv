var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var { usersRouter, registerUser } = require("./routes/users");

var { healthRouter } = require("./routes/health");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/v1/user", usersRouter);
app.use("/health", healthRouter);
module.exports = app;
