import Joi from "@hapi/joi";
import {validationError} from "../helper";

const accountFormSchema = Joi.object().keys({
  account_type: Joi.string().required(),
  customer_name: Joi.string().required(),
  account_number: Joi.string().required(),
  ifsc_code: Joi.string().required(),
  prefix: Joi.string()
    .regex(/^\d+$/)
    .required(),
  account_mobile_number: Joi.string()
      .min(10)
      .max(10)
    .regex(/^\d+$/)
    .required()
    .label("Please enter correct mobile number"),
  use_as_main: Joi.boolean().required(),
  upi_id: Joi.string()
    .optional()
    .allow("", null)
});

export const validateAccountFormData = (req, res, next) => {
  const { body: data = {} } = req;
  const isValid = accountFormSchema.validate(data);
    if (isValid && isValid.error != null) {
      return validationError(res, isValid);
    }
    // const response = new Response(false, 422);
    // response.setError(isValid.error);
    // response.setMessage("Please check filled details");
    // return res.status(422).json(response.getResponse());
  next();
};
