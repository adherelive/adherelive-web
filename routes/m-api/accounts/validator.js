import Joi from "@hapi/joi";
import Response from "../../../app/helper/responseFormat";
import {validationError} from "../../api/helper";

const accountFormSchema = Joi.object().keys({
  account_type: Joi.string().required(),
  customer_name: Joi.string().required(),
  account_number: Joi.string().required(),
  ifsc_code: Joi.string().required(),
  prefix: Joi.string().regex(/^\d+$/).required(),
  account_mobile_number: Joi.string()
    .min(10)
    .max(10)
    .regex(/^\d+$/)
    .required()
    .label("Please enter correct mobile number"),
  use_as_main: Joi.boolean().required(),
  upi_id: Joi.string().trim().optional().allow("", null),
});

export const validateAccountFormData = (req, res, next) => {
  const {body: data = {}} = req;
  const isValid = accountFormSchema.validate(data);
  if (isValid && isValid.error != null) {
    return validationError(res, isValid);
  }
  next();
};
