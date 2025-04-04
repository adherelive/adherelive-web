import Joi from "@hapi/joi";
import { validationError } from "../helper";
import { USER_FAV_ALL_TYPES } from "../../../constant";

const createFavourite = Joi.object().keys({
  type: Joi.string()
    .valid(...USER_FAV_ALL_TYPES)
    .required()
    .label("Please enter valid favourite type"),
  id: Joi.number().required().label("Please enter valid favourite Id"),
  details: Joi.object().optional(),
});

const getFavourites = Joi.object().keys({
  type: Joi.string()
    .valid(...USER_FAV_ALL_TYPES)
    .required()
    .label("Please enter valid favourite type"),
});

const removeFavourites = Joi.object().keys({
  id: Joi.number().required().label("Please enter valid favourite Id"),
});

export const validateCreateFavourite = (req, res, next) => {
  const { body: data = {} } = req;
  const isValid = createFavourite.validate(data);
  if (isValid && isValid.error != null) {
    return validationError(res, isValid);
  }
  next();
};

export const validateGetFavourites = (req, res, next) => {
  const { query: { type = "" } = {} } = req;
  const data = { type };
  const isValid = getFavourites.validate(data);
  if (isValid && isValid.error != null) {
    return validationError(res, isValid);
  }
  next();
};

export const validateRemoveFavourites = (req, res, next) => {
  const { params: { id = null } = {} } = req;
  const data = { id };
  const isValid = removeFavourites.validate(data);
  if (isValid && isValid.error != null) {
    return validationError(res, isValid);
  }
  next();
};
