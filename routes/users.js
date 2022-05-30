var express = require("express");
var Joi = require("joi");
const ValidateSchema = require("../utils/validateSchema");
var jwt = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require("bcrypt");

const getUserSchema = Joi.object().keys({
  id: Joi.number().integer().required(),
});
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
  stayLoggedIn: Joi.boolean(),
});

const updateUserSchema = Joi.object().keys({
  id: Joi.number().integer().min(1).required(),
  email: Joi.string().email().min(5),
  username: Joi.string().min(1),
  password: Joi.string()
    .regex(
      /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/
    )
    .message(
      "Password must contain at least one uppercase letter, three lowercase letter, two numbers and one special character"
    ),
  repeatPassword: Joi.any().valid(Joi.ref("password")),
  firstName: Joi.string().min(1),
  lastName: Joi.string().min(1),
  phoneNumber: Joi.string().min(1),
});

const registerUser = (database) => async (req, res) => {
  if (!ValidateSchema(registerUserSchema, req.body, res)) {
    return;
  }
  const user = await database.getUserByEmail(req.body.email);
  if (user) {
    res.status(422).json({ error: "Email already in use" });
    return;
  }

  const newUserdata = {
    ...req.body,
    password: bcrypt.hashSync(req.body.password, 10),
  };

  const newUser = await database.createUser(newUserdata);
  res.setHeader("Location", `/users/${newUser.id}`);
  res.status(201).json({
    result: "User created",
  });
};

const getUser = (database) => async (req, res) => {
  if (!ValidateSchema(getUserSchema, req.params, res)) {
    return;
  }
  const token = req.headers.authorization;

  const user = await database.getUserById(req.params.id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const PUBLIC_KEY = Buffer.from(process.env.JWT_PUBLIC_KEY, "base64").toString(
    "ascii"
  );

  jwt.verify(
    token,
    PUBLIC_KEY,
    {
      algorithms: "RS256",
    },
    async (err, decoded) => {
      if (err) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      if (decoded.id !== user.id) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      res.status(200).json({
        result: user,
      });
    }
  );
};

const authenticateUser = (database) => async (req, res) => {
  if (!ValidateSchema(AuthSchema, req.body, res)) {
    return;
  }

  const user = await database.getUserByEmail(req.body.email);
  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const isValid = bcrypt.compareSync(req.body.password, user.password);
  if (!isValid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const SECRET_KEY = Buffer.from(process.env.JWT_SECRET, "base64").toString(
    "ascii"
  );
  var token = await jwt.sign({ id: user.id }, SECRET_KEY, {
    expiresIn: "1h",
    algorithm: "RS256",
  });

  var refreshToken = req.body.stayLoggedIn
    ? await jwt.sign({ id: user.id }, SECRET_KEY, {
        expiresIn: "7d",
      })
    : null;
  console.log(token, refreshToken);
  const returndata = {
    token: token,
  };
  if (refreshToken) {
    returndata.refreshToken = refreshToken;
  }

  res.status(200).json(returndata);
};

const updateUser = (database) => async (req, res) => {
  if (!ValidateSchema(updateUserSchema, req.body, res)) {
    return;
  }

  const affectedRows = await database.updateUser(req.body);
  if (affectedRows === 0) {
    res.status(404).json({ error: "User not found" });
  }

  res.setHeader("Location", `/users/${req.body.id}`);
  res.status(201).json({
    result: "User updated",
  });
};

const initRoutes = (database) => {
  router.post("/", registerUser(database));
  router.get("/:id", getUser(database));
  router.post("/auth", authenticateUser(database));
  router.patch("/", updateUser(database));
  return router;
};

module.exports = {
  usersRouter: initRoutes,
  updateUser,
  registerUser,
  getUser,
  authenticateUser,
};
