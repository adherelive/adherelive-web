import Response from "../../../app/helper/responseFormat";
import Joi from "@hapi/joi";

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
    .regex(/^\d+$/)
    .length(10)
    .required()
    .label("Mobile number cannot be empty"),
  prefix: Joi.string()
    .required()
    .regex(/^\d+$/)
    .label("Prefix cannot be empty"),
  profile_pic: Joi.string()
    .required()
    .label("Profile pic cannot be empty")
});

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
