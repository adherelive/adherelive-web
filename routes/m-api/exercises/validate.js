import Joi from "joi";
import { validationError } from "../../helper";

// schema
const createExerciseSchema = Joi.object({
  name: Joi.string().max(50).required().messages({
    "string.base": `Exercise name should be a type of text`,
    "string.empty": `Exercise name cannot be empty`,
    "any.required": `Exercise name is required`,
  }),
  repetition_id: Joi.number().integer().min(1).strict().required().messages({
    "number.base": `Repetition Id must be of type number`,
    "number.empty": `Repetition Id cannot be empty`,
    "any.required": `Repetition Id is required`,
  }),
  repetition_value: Joi.number().integer().min(1).strict().required().messages({
    "number.base": `Repetiton Value must be of type number`,
    "number.empty": `Repetiton Value cannot be empty`,
    "any.required": `Repetiton Value is required`,
  }),
  calorific_value: Joi.number()
    .min(1)
    .strict()
    .optional()
    .allow("", null)
    .messages({
      "number.base": `Calorific Value must be of type number`,
      "any.optional": `Calorific Value must be of type number`,
    }),
  video: Joi.object({
    content_type: Joi.string().optional().allow("", null),
    content: Joi.string().optional().allow("", null),
  })
    .optional()
    .allow("", null),
});

export const create = (req, res, next) => {
  const { body: data = {} } = req;
  const isValid = createExerciseSchema.validate(data, { convert: false });

  const { error: { details = [] } = {} } = isValid || {};

  if (details.length > 0) {
    return validationError(res, details[0].message);
  } else {
    next();
  }
};
