var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
const getDb = require("./utils/database");
var { usersRouter } = require("./routes/users");
var dvb;
var { healthRouter } = require("./routes/health");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// ??? Quickfix
(async () => {
  const database = await getDb();

  app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      return res.status(400).send({ result: err.message }); // Bad request
    }
    next();
  });
  app.use("/api/v1/user", usersRouter(database));
  app.use("/health", healthRouter(database));
})();
module.exports = app;
