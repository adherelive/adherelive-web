import Joi from "joi";
import {validationError} from "../../helper";

// schema
const createFoodItemSchema = Joi.object({
    name: Joi.string().max(50).required().messages({
        'string.base': `Food Item name should be a type of text`,
        'string.empty': `Food Item name cannot be empty`,
        'any.required': `Food Item name is required`
    }),
    portion_id: Joi.number().integer().min(1).strict().required().messages({
        'number.base': `Portion Id must be of type number`,
        'number.empty': `Portion Id cannot be empty`,
        'any.required': `Portion Id is required`
    }),
    portion_size: Joi.number().strict().required().messages({
        'number.base': `Portion Size must be of type number`,
        'number.empty': `Portion Size cannot be empty`,
        'any.required': `Portion Size is required`
    }),
    calorific_value: Joi.number().min(1).strict().optional().allow("", null).messages({
        'number.base': `Calorific Value must be of type number`,
        'any.optional': `Calorific Value must be of type number`
    }),
    carbs: Joi.number().strict().optional().allow("", null).messages({
        'number.base': `Carbs must be of type number`,
        'any.optional': `Carbs must be of type number`
    }),
    fats: Joi.number().strict().optional().allow("", null).messages({
        'number.base': `Fats must be of type number`,
        'any.optional': `Fats must be of type number`
    }),
    proteins: Joi.number().strict().optional().allow("", null).messages({
        'number.base': `Proteins must be of type number`,
        'any.optional': `Proteins must be of type number`
    }),
    fibers: Joi.number().strict().optional().allow("", null).messages({
        'number.base': `Fibers must be of type number`,
        'any.optional': `Fibers must be of type number`
    }),
    details: Joi.object().optional()
});

const updateFoodItemSchema = Joi.object({
    name: Joi.string().max(50).required().messages({
        'string.base': `Food Item name should be a type of text`,
        'string.empty': `Food Item name cannot be empty`,
        'any.required': `Food Item name is required`
    }),
    portion_id: Joi.number().integer().min(1).strict().required().messages({
        'number.base': `Portion Id must be of type number`,
        'number.empty': `Portion Id cannot be empty`,
        'any.required': `Portion Id is required`
    }),
    portion_size: Joi.number().strict().required().messages({
        'number.base': `Portion Size must be of type number`,
        'number.empty': `Portion Size cannot be empty`,
        'any.required': `Portion Size is required`
    }),
    calorific_value: Joi.number().min(1).strict().optional().allow("", null).messages({
        'number.base': `Calorific Value must be of type number`,
        'any.optional': `Calorific Value must be of type number`
    }),
    carbs: Joi.number().strict().optional().allow("", null).messages({
        'number.base': `Carbs must be of type number`,
        'any.optional': `Carbs must be of type number`
    }),
    fats: Joi.number().strict().optional().allow("", null).messages({
        'number.base': `Fats must be of type number`,
        'any.optional': `Fats must be of type number`
    }),
    proteins: Joi.number().strict().optional().allow("", null).messages({
        'number.base': `Proteins must be of type number`,
        'any.optional': `Proteins must be of type number`
    }),
    fibers: Joi.number().strict().optional().allow("", null).messages({
        'number.base': `Fibers must be of type number`,
        'any.optional': `Fibers must be of type number`
    }),
    details: Joi.object().optional()
});

export const create = (req, res, next) => {
    const {body: data = {}} = req;
    const isValid = createFoodItemSchema.validate(data, {convert: false});

    const {error: {details = []} = {}} = isValid || {};

    if (details.length > 0) {
        return validationError(res, details[0].message);
    } else {
        next();
    }
};

export const update = (req, res, next) => {
    const {body: data = {}} = req;
    const isValid = updateFoodItemSchema.validate(data, {convert: false});

    const {error: {details = []} = {}} = isValid || {};

    if (details.length > 0) {
        return validationError(res, details[0].message);
    } else {
        next();
    }
};
