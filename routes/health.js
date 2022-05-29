var express = require("express");
const getDb = require("../utils/database");

const router = express.Router();

// checks the health of the server
router.get("/", async function (req, res) {
  getDb().then((db) => {
    db.getTables().then((tables) => {
      res.status(200).json({
        status: "ok",
        tables: tables,
      });
    });
  });
});

module.exports = { healthRouter: router };
