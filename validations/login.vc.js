const { body } = require('express-validator');
const messages = require('../locales/es.json');
const loginValidationRules = () => {
  return [
    body('email')
      .notEmpty()
      .withMessage(messages.validation.email.empty)
      .isEmail()
      .withMessage(messages.validation.email.invalid)
      .trim()
      .escape()
      .normalizeEmail(),

    body('password')
      .notEmpty()
      .withMessage(messages.validation.password.empty)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>\/?]).{8,}$/
      )
      .withMessage(messages.validation.password.complexity)
      .trim()
      .escape(),
  ];
};

module.exports = loginValidationRules;
