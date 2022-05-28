var express = require("express");
var router = express.Router();
var Joi = require("joi");
const ValidateSchema = require("../utils/validateSchema");

const registerUserSchema = Joi.object().keys({
  email: Joi.string().email().min(5).required(),
  username: Joi.string().min(1).required(),
  password: Joi.string()
    .regex(
      /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/
    )
    .message(
      "Password must contain at least one uppercase letter, three lowercase letter, two numbers and one special character"
    )
    .required(),
  repeatPassword: Joi.any().valid(Joi.ref("password")).required(),
  firstName: Joi.string().min(1).required(),
  lastName: Joi.string().min(1).required(),
  phoneNumber: Joi.string().min(1),
});

const AuthSchema = Joi.object().keys({
  email: Joi.string().email().min(5).required(),
  password: Joi.string(),
});

/**
 * Register a new user
 */
router.post("/", function (req, res) {
  if (!ValidateSchema(registerUserSchema, req.body, res)) {
    return;
  }

  res.json({ users: [{ name: "Timmy" }] });
});

/**
 * Get userInfo
 *
 */
router.get("/:id", function (req, res) {
  res.json({ users: [{ name: "Timmy" }] });
});

/**
 * Authenticate user
 */
router.post("/auth", function (req, res) {
  if (!ValidateSchema(AuthSchema, req.body, res)) {
    return;
  }

  res.json({ users: [{ name: "Timmy" }] });
});

module.exports = router;
