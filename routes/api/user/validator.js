import Joi from "@hapi/joi";
import moment from "moment";
import { validationError } from "../helper";
import { PASSWORD_LENGTH } from "../../../constant";
import Response from "../../../app/helper/responseFormat";

const credentialsFormSchema = Joi.object().keys({
  email: Joi.string().email().required().label("Please enter valid email"),
  password: Joi.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/)
    .min(PASSWORD_LENGTH)
    .required()
    .label(
      "Password must contain atleast 1 uppercase, lowercase, number & special character"
    ),
  readTermsOfService: Joi.boolean()
    .required()
    .label(
      "Please acknowledge if you have read the terms of service and privacy policy"
    ),
});

const signInSchema = Joi.object().keys({
  email: Joi.string().email().required().label("Please enter valid email"),
  password: Joi.string()
    .required()
    .label(
      "Password must contain atleast 1 uppercase, lowercase, number & special character"
    ),
});

const forgotPasswordSchema = Joi.object().keys({
  email: Joi.string().email().required().label("Please enter valid email"),
});

const verifyLinkSchema = Joi.object().keys({
  link: Joi.string()
    .guid({ version: "uuidv4" })
    .required()
    .label("Verification link is not correct"),
});

const matchPassword = (value, helpers) => {
  const { state: { ancestors = [] } = {} } = helpers || {};
  const { new_password } = ancestors[0] || {};
  if (new_password === value) {
    return value;
  } else {
    return helpers.error("any.invalid");
  }
};

const updatePasswordSchema = Joi.object().keys({
  new_password: Joi.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/)
    .required()
    .label(
      "Password must contain atleast 1 uppercase, lowercase, number & special character"
    ),
  confirm_password: Joi.string()
    .custom(matchPassword)
    .label("Password does not match. Please try again"),
});

const validateStartTime = (startTime) => {
  const now = moment().subtract(3, "minutes");

  return moment(startTime).isAfter(now);
};

const validateTimeInterval = (startTime, endTime) => {
  return moment(startTime) < moment(endTime);
};

export const validateCredentialsData = (req, res, next) => {
  const { body: data = {} } = req;
  const isValid = credentialsFormSchema.validate(data);

  if (isValid && isValid.error != null) {
    const { error: { details } = {} } = isValid || {};
    const { context: { label } = {} } = details[0] || {};
    // return raiseClientError(res, 422, isValid.error, "please check filled details");
    const response = new Response(false, 422);
    response.setError(isValid.error);
    response.setMessage(label);
    return res.status(422).json(response.getResponse());
  }
  next();
};

export const validateUpdatePasswordData = (req, res, next) => {
  const { body: data = {} } = req;
  const isValid = updatePasswordSchema.validate(data);
  if (isValid && isValid.error != null) {
    return validationError(res, isValid);
  }
  next();
};

export const forgotPasswordForm = (req, res, next) => {
  const { body: data = {} } = req;
  const isValid = forgotPasswordSchema.validate(data);
  if (isValid && isValid.error != null) {
    return validationError(res, isValid);
  }
  next();
};

export const verifyLinkValidation = (req, res, next) => {
  const { params: data = {} } = req;
  const isValid = verifyLinkSchema.validate(data);
  if (isValid && isValid.error != null) {
    return validationError(res, isValid);
  }
  next();
};

export const validateSignInData = (req, res, next) => {
  const { body: data = {} } = req;
  const isValid = signInSchema.validate(data);

  if (isValid && isValid.error != null) {
    return validationError(res, isValid);
  }
  next();
};
