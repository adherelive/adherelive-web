import Joi from "@hapi/joi";
import moment from "moment";
import { PASSWORD_LENGTH, USER_CATEGORY } from "../../../constant";
import Response from "../../../app/helper/responseFormat";
import { validationError } from "../../api/helper";

const credentialsFormSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/)
    .min(PASSWORD_LENGTH)
    .required(),
  readTermsOfService: Joi.boolean()
    .required()
    .label(
      "Please acknowledge if you have read the terms of service and privacy policy"
    ),
});

const updatedPasswordSchema = Joi.object().keys({
  new_password: Joi.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/)
    .min(PASSWORD_LENGTH)
    .required()
    .label(
      "Password must contain atleast 1 uppercase, lowercase, number & special character"
    ),
  confirm_password: Joi.when("password", {
    is: Joi.string(),
    then: Joi.string().allow(Joi.ref("new_password")),
  }),
});

const signInSchema = Joi.object().keys({
  prefix: Joi.string()
    .max(5)
    .regex(/^\d+$/)
    .required()
    .label("Please select correct country code"),
  mobile_number: Joi.string()
    .min(10)
    .max(10)
    .regex(/^\d+$/)
    .required()
    .label("Please enter a valid mobile number"),
  hash: Joi.string().optional().allow("", null),
});

const otpSchema = Joi.object().keys({
  user_id: Joi.number().required(),
  otp: Joi.string()
    .length(4)
    .regex(/^[0-9]*$/)
    .required(),
});

const doctorSignInSchema = Joi.object().keys({
  email: Joi.string().email().required().label("Please enter valid email"),
  password: Joi.string().required(),
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

const validateStartTime = (startTime) => {
  const now = moment().subtract(3, "minutes");
  return moment(startTime).isAfter(now);
};

const validateTimeInterval = (startTime, endTime) => {
  return moment(startTime) < moment(endTime);
};

export const validateCredentialsData = (req, res, next) => {
  const { body: data = {} } = req;
  const { email, password } = data;
  const isValid = credentialsFormSchema.validate(data);
  if (isValid && isValid.error != null) {
    console.log("00000000000000 isValid ---> ", isValid, isValid.error);
    let errorMessage = "Please check filled details";
    const { error: { details } = {} } = isValid || {};
    const { type } = details[0] || {};
    switch (type) {
      case "string.empty":
        const { context: { label } = {} } = details[0] || {};
        if (label === "email") {
          errorMessage = "Email cannot be empty";
        } else {
          errorMessage = "Password cannot be empty";
        }
        break;
      case "string.pattern.base":
        const { context: { label: passwordLabel } = {} } = details[0] || {};
        if (passwordLabel === "password") {
          errorMessage =
            "Password must contain at least 1 uppercase, lowercase, number & special character";
        }
        break;
      case "string.min":
        const { context: { label: passwordLengthLabel } = {} } =
          details[0] || {};
        if (passwordLengthLabel === "password") {
          errorMessage = "Password must be at least 12 characters long";
        }
        break;
      default:
        break;
    }
    const response = new Response(false, 422);
    response.setError(isValid.error);
    response.setMessage(errorMessage);
    return res.status(422).json(response.getResponse());
  }
  next();
};

export const validateSignInData = (req, res, next) => {
  const { body: data = {} } = req;
  const isValid = signInSchema.validate(data);
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

export const validateOtpData = (req, res, next) => {
  const { body: data = {} } = req;
  const isValid = otpSchema.validate(data);
  if (isValid && isValid.error != null) {
    const { error: { details } = {} } = isValid || {};
    const { type, context: { label } = {} } = details[0] || {};
    // return raiseClientError(res, 422, isValid.error, "please check filled details");
    let errorMessage = label;
    switch (type) {
      case "string.pattern.base":
        errorMessage = "OTP must contain only numbers";
        break;
      case "string.length":
        errorMessage = "OTP must be of 4 digits";
        break;
      default:
    }
    const response = new Response(false, 422);
    response.setError(isValid.error);
    response.setMessage(errorMessage);
    return res.status(422).json(response.getResponse());
  }
  next();
};

export const validateDoctorSignInData = (req, res, next) => {
  const { body: data = {} } = req;
  const isValid = doctorSignInSchema.validate(data);
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

export const forgotPassword = (req, res, next) => {
  const { body: data = {} } = req;
  const isValid = forgotPasswordSchema.validate(data);
  if (isValid && isValid.error != null) {
    return validationError(res, isValid);
  }
  next();
};

export const verifyLink = (req, res, next) => {
  const { params: data = {} } = req;
  const isValid = verifyLinkSchema.validate(data);
  if (isValid && isValid.error != null) {
    return validationError(res, isValid);
  }
  next();
};

export const updatePasswordForm = (req, res, next) => {
  const { body: data = {} } = req;
  const isValid = updatedPasswordSchema.validate(data);
  if (isValid && isValid.error != null) {
    return validationError(res, isValid);
  }
  next();
};
