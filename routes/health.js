var express = require("express");

const router = express.Router();

// checks the health of the server
router.get("/", async function (req, res) {
  res.status(200).json({
    status: "OK",
  });
});

module.exports = { healthRouter: router };
