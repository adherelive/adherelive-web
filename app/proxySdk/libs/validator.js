const Joi = require("joi");

const mailSchema = Joi.object().keys({
  programId: Joi.string(),
  activityId: Joi.string(),
  loggedInUserId: Joi.string(),
  toAddress: Joi.string()
    .email()
    .required(),
  title: Joi.string(),
  templateData: Joi.object(),
  templateName: Joi.string()
});

const smsSchema = Joi.object().keys({});

let validateMailData = mailData => {
  let isValid = Joi.validate(mailData, mailSchema);
  if (isValid.error != null) throw isValid.error;
  return isValid;
};

let validateSmsData = smsData => {
  let isValid = Joi.validate(smsData, smsSchema);
  if (isValid.error != null) throw isValid.error;
  return isValid;
};
module.exports = { validateMailData, validateSmsData };
