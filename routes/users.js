var express = require("express");

var Joi = require("joi");
const ValidateSchema = require("../utils/validateSchema");
const router = express.Router();
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
const registerUser = (req, res) => {
  if (!ValidateSchema(registerUserSchema, req.body, res)) {
    return;
  }

  res.status(201).json({ users: [{ name: "Timmy" }] });
};

const getUser = (req, res) => {
  const { id } = req.params;

  res.status(200).json({
    email: "test@hotmail.com",
    username: "test",
    phoneNumber: "test",
    firstName: "test",
    lastName: "test",
  });
};

const authenticateUser = (req, res) => {
  if (!ValidateSchema(AuthSchema, req.body, res)) {
    return;
  }

  res.status(200).json({
    token: "asdasdjansd21983unj<x",
  });
};

router.post("/", registerUser);
router.get("/:id", getUser);
router.post("/auth", authenticateUser);

module.exports = {
  usersRouter: router,
  registerUser,
  getUser,
  authenticateUser,
};
