const Joi = require("joi");

const registerSchemas = Joi.object({
  email: Joi.string().required().messages({
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
});

const loginSchemas = Joi.object({
  email: Joi.string().required().messages({
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
});

module.exports = { registerSchemas, loginSchemas };
