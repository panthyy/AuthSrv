var express = require("express");
var router = express.Router();

// checks the health of the server
router.get("/", function (req, res) {
  res.json({
    status: "OK",
  });
});

module.exports = router;
