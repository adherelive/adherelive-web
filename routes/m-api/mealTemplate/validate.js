import Joi from "joi";
import { validationError } from "../../helper";

// schema
const createMealTemplateSchema = Joi.object({
    name: Joi.string().max(50).required().messages({
        'string.base': `Template name should be a type of text`,
        'string.empty': `Template name cannot be empty`,
        'any.required': `Template name is required`
    }),
    food_item_detail_ids: Joi.array().items(
        Joi.number().integer().strict().required().messages({
            'number.base': `Food item Detail ID must be of type number`,
            'any.required': `Food item Detail ID is required`
        })
    ).min(1).required().messages({
        'array.base': `Food item Detail IDs must be of type array`,
        'array.min': `At least one Food Item Detail ID is required`,
        'array.includesRequiredUnknowns': `Food Item Detail IDs cannot be empty`,
        'any.required': `Food item Detail IDs are required`
    })
});

const updateMealTemplateSchema= Joi.object({

    name: Joi.string().max(50).required().messages({
        'string.base': `Template name should be a type of text`,
        'string.empty': `Template name cannot be empty`,
        'any.required': `Template name is required`
    }),
    food_item_detail_ids: Joi.array().items(
        Joi.number().integer().strict().required().messages({
            'number.base': `Food item Detail ID must be of type number`,
            'any.required': `Food item Detail ID is required`
        })
    ).min(1).required().messages({
        'array.base': `Food item Detail IDs must be of type array`,
        'array.min': `At least one Food Item Detail ID is required`,
        'array.includesRequiredUnknowns': `Food Item Detail IDs cannot be empty`,
        'any.required': `Food item Detail IDs are required`
    })
});

export const create = (req, res, next) => {
  const { body: data = {} } = req;
  const isValid = createMealTemplateSchema.validate(data, { convert: false });

  const { error: { details = [] } = {} } = isValid || {};

  if (details.length > 0) {
    return validationError(res, details[0].message);
  } else {
    next();
  }
};

export const update = (req, res, next) => {
  const { body: data = {} } = req;
  const isValid = updateMealTemplateSchema.validate(data, { convert: false });

  const { error: { details = [] } = {} } = isValid || {};

  if (details.length > 0) {
    return validationError(res, details[0].message);
  } else {
    next();
  }
};
