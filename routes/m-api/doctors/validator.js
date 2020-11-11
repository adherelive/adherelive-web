import Response from "../../../app/helper/responseFormat";
import Joi from "@hapi/joi";
import moment from "moment";
import { validationError } from "../../api/helper";

const updateDoctorSchema = Joi.object().keys({
  name: Joi.string()
    .required()
    .label("Name cannot be empty"),
  city: Joi.string()
    .required()
    .label("City cannot be empty"),
  category: Joi.string()
    .required()
    .label("Category cannot be empty"),
  mobile_number: Joi.string()
    .min(6)
    .max(20)
    .regex(/^\d+$/)
    .required()
    .label("Mobile number cannot be empty"),
  prefix: Joi.string()
    .required()
    .regex(/^\d+$/)
    .label("Prefix cannot be empty"),
  profile_pic: Joi.string()
    .required()
    .label("Profile pic cannot be empty"),
  signature_pic: Joi.string()
    .required()
    .label("Signature pic cannot be empty")
});

const addPatientForm = Joi.object().keys({
  mobile_number: Joi.string()
    .min(6)
    .max(20)
    .regex(/^\d+$/)
    .required()
    .label("Please enter correct mobile number"),
  name: Joi.string()
    .optional()
    .allow("", null),
  gender: Joi.string()
    .length(1)
    .optional()
    .allow("", null),
  date_of_birth: Joi.date()
    .required()
    .label("Please enter date of birth"),
  prefix: Joi.string()
    .regex(/^\d+$/)
    .required()
    .label("Please select prefix"),
  comorbidities: Joi.string()
    .trim()
    .optional()
    .allow("", null),
  allergies: Joi.string()
    .trim()
    .optional()
    .allow("", null),
  clinical_notes: Joi.string()
    .trim()
    .optional()
    .allow("", null),
  diagnosis_type: Joi.number().required(),
  diagnosis_description: Joi.string()
    .trim()
    .max(500)
    .required(),
  treatment_id: Joi.number()
    .required()
    .label("Incorrect Treatment value selected"),
  severity_id: Joi.number()
    .optional()
    .allow("", null)
    .label("Incorrect Severity value selected"),
  condition_id: Joi.number()
    .optional()
    .allow("", null)
    .label("Incorrect Condition value selected"),
  height: Joi.string()
    .optional()
    .allow("", null),
  weight: Joi.string()
    .optional()
    .allow("", null),
  symptoms: Joi.string()
    .trim()
    .optional()
    .allow(""),
  address: Joi.string()
    .optional()
    .allow("", null)
});

const validDOB = date => {
  return moment().diff(date, "d") <= 0;
};

export const validateAddPatientData = (req, res, next) => {
  const { body: data, data: { date_of_birth } = {} } = req;
  const isValid = addPatientForm.validate(data);
  if (isValid && isValid.error != null) {
    return validationError(res, isValid);
    // const {error: {details} = {}} = isValid || {};
    // const {context: {label} = {}} = details[0] || {};
    // // return raiseClientError(res, 422, isValid.error, "please check filled details");
    // const response = new Response(false, 422);
    // response.setError(isValid.error);
    // response.setMessage(label);
    // return res.status(422).json(response.getResponse());
  }
  if (!validDOB(date_of_birth)) {
    const response = new Response(false, 422);
    response.setError({});
    response.setMessage("Incorrect date of birth");
    return res.status(422).json(response.getResponse());
  }
  next();
};

export const validateUpdateDoctorData = (req, res, next) => {
  const { body: data = {} } = req;
  const isValid = updateDoctorSchema.validate(data);
  if (isValid && isValid.error != null) {
    const { error: { details } = {} } = isValid || {};
    const { type, context: { label } = {} } = details[0] || {};
    let errorMessage = label;

    switch (type) {
      case "string.pattern.base":
        const { context: { key } = {} } = details[0] || {};
        if (key === "mobile_number") {
          errorMessage = "Please check the mobile number entered";
        } else {
          errorMessage = "Please check the prefix selected";
        }
        break;
      case "string.length":
        errorMessage = "Mobile number must be 10 characters long";
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
