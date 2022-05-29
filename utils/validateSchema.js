var Joi = require("joi");

const ValidateSchema = (schema, data, res) => {
  const { error, value } = schema.validate(data);
  if (error) {
    console.log(error.details[0].message);
    res.status(422).json({ error: error.details[0].message });
    return false;
  } else {
    return true;
  }
};

module.exports = ValidateSchema;
