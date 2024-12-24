import { validationError } from "../../api/helper";
import Joi from "@hapi/joi";

const carePlanTemplateForm = Joi.object().keys({});

export const validateCarePlanTemplateData = (req, res, next) => {
  const { body: data = {} } = req;
  const isValid = carePlanTemplateForm.validate(data);
  if (isValid && isValid.error != null) {
    return validationError(res, isValid);
  }
  next();
};
