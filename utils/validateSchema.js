var Joi = require("joi");

const ValidateSchema = (schema, data, res) => {
  const { error, value } = Joi.validate(data, schema);
  if (error) {
    res.status(400).send(error.details[0].message);
    return false;
  } else {
    return true;
  }
};

module.exports = ValidateSchema;
