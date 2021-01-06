import Joi from "@hapi/joi";
import {validationError} from "../helper";
import {PASSWORD_LENGTH} from "../../../constant";

const addProviderSchema = Joi.object().keys({
    email: Joi.string()
        .email()
        .required()
        .label("Please enter valid email"),
    password: Joi.string()
        .min(PASSWORD_LENGTH)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/)
        .required()
        .label("Password must contain atleast 1 uppercase, lowercase, number & special character"),
    confirm_password: Joi.any().valid(Joi.ref("password")).required().label("Password does not match"),
    mobile_number: Joi.string()
        .min(10)
        .max(10)
        .regex(/^\d+$/)
        .optional()
        .allow("", null)
        .label("Please enter correct mobile number"),
    prefix: Joi.string()
        .max(4)
        .regex(/^\d+$/)
        .optional()
        .allow("", null)
        .label("Please select correct prefix"),
    name: Joi.string().trim().required().label("Please enter name of provider"),
    address: Joi.string()
        .trim()
        .required()
        .label("Please enter correct address"),
});


const updateProviderSchema = Joi.object().keys({
    email: Joi.string()
        .email()
        .required()
        .label("Please enter valid email"),
    mobile_number: Joi.string()
        .min(10)
        .max(10)
        .regex(/^\d+$/)
        .optional()
        .allow("", null)
        .label("Please enter correct mobile number"),
    prefix: Joi.string()
        .max(4)
        .regex(/^\d+$/)
        .optional()
        .allow("", null)
        .label("Please select correct prefix"),
    name: Joi.string().trim().required().label("Please enter name of provider"),
    address: Joi.string()
        .trim()
        .required()
        .label("Please enter correct address"),
});


export const validateAddProviderData = (req, res, next) => {
    const { body: data = {} } = req;
    const isValid = addProviderSchema.validate(data);
    console.log("18923718923 isValid ---> ", isValid);
    if (isValid && isValid.error != null) {
        return validationError(res, isValid);
    }
    next();
};


export const validateUpdateProviderData = (req, res, next) => {
    const { body: data = {} } = req;
    const isValid = updateProviderSchema.validate(data);
    console.log("18923718923 isValid ---> ", isValid);
    if (isValid && isValid.error != null) {
        return validationError(res, isValid);
    }
    next();
};



