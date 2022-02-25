import { validationError } from "../helper";
import Joi from "@hapi/joi";

const userDeviceSchema = Joi.object().keys({
  platform: Joi.string().required().label("Platform is required"),
  one_signal_user_id: Joi.string().required().label("Device ID is required"),
  push_token: Joi.string().required().label("Push Token is required"),
});

export const addUserDeviceSchema = (req, res, next) => {
  const { body: data = {} } = req;
  const isValid = userDeviceSchema.validate(data);
  if (isValid && isValid.error != null) {
    return validationError(res, isValid);
  }
  next();
};
