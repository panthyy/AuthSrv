var express = require("express");

const router = express.Router();

// checks the health of the server
router.get("/", async function (req, res) {});

module.exports = { healthRouter: router };
