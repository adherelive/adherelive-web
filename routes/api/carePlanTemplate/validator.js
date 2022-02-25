import { validationError } from "../../api/helper";
import Joi from "@hapi/joi";

const careplanTemplateForm = Joi.object().keys({});

export const validateCareplanTemplateData = (req, res, next) => {
  const { body: data = {} } = req;
  const isValid = careplanTemplateForm.validate(data);
  if (isValid && isValid.error != null) {
    return validationError(res, isValid);
  }
  next();
};
