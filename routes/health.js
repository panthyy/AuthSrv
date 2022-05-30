var express = require("express");

const router = express.Router();

// checks the health of the server
router.get("/");

const getHealth = (database) => async (req, res) => {
  const result = await database.health();
  res.json({
    status: true,
    dbStatus: result,
  });
};

const init = (database) => {
  router.get("/", getHealth(database));
  return router;
};

module.exports = { healthRouter: init };
