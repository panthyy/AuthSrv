var express = require("express");
const getDb = require("../utils/database");

const router = express.Router();

// checks the health of the server
router.get("/", async function (req, res) {
  const db = await getDb();
  const result = await db.health();
  res.json({
    status: true,
    dbStatus: result,
  });
});

module.exports = { healthRouter: router };
