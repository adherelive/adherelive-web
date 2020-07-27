import Joi from "@hapi/joi";
import moment from "moment";
import { USER_CATEGORY } from "../../../constant";
import Response from "../../../app/helper/responseFormat";

const credentialsFormSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/).min(12).required()
});

const updatedPasswordSchema = Joi.object().keys({
   password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/).required().label("Password must contain atleast 1 uppercase, lowercase, number & special character"),
   confirm_password: Joi.when('password', {is: Joi.string(), then: Joi.string().required()})
});

const signInSchema = Joi.object().keys({
   // user_name: Joi.when('user_name', {is: Joi.string().email(), then: Joi.string().email().required()}).concat(
   //     Joi.when('user_name', {is: Joi.number(), then: Joi.number().max(10).required()})
   // ),
    user_name: Joi.alternatives().try(
        Joi.string().email().required().label("Please enter valid email"),
        Joi.string().length(10).regex(/^\d+$/).required().label("Please enter a valid mobile number"),
    ),
    password: Joi.string().required()
});

const doctorSignInSchema = Joi.object().keys({
   email:  Joi.string().email().required().label("Please enter valid email"),
    password: Joi.string().required()
});

const validateStartTime = (startTime) => {
    const now = moment().subtract(3, "minutes");
    console.log("START TIME TEST ----------- ", moment(startTime), now, moment(startTime).isAfter(now));
    return moment(startTime).isAfter(now);
};

const validateTimeInterval = (startTime, endTime) => {
    return moment(startTime) < moment(endTime);
};

export const validateCredentialsData = (req, res, next) => {
    const { body: data = {} } = req;
    const { email, password } = data;
    const isValid = credentialsFormSchema.validate(data);
    if (isValid && isValid.error != null) {
        console.log("00000000000000 isValid ---> ", isValid, isValid.error);
        let errorMessage = "Please check filled details";
        const {error : {details} = {} } = isValid || {};
        const {type} = details[0] || {};
        switch(type) {
            case "string.empty":
                const {context: {label} = {}} = details[0] || {};
                if(label === "email") {
                    errorMessage = "Email cannot be empty";
                } else {
                    errorMessage = "Password cannot be empty";
                }
                break;
            case "string.pattern.base":
                const {context: {label : passwordLabel} = {}} = details[0] || {};
                if(passwordLabel === "password") {
                    errorMessage = "Password must contain at least 1 uppercase, lowercase, number & special character";
                }
                break;
            case "string.min":
                const {context: {label : passwordLengthLabel} = {}} = details[0] || {};
                if(passwordLengthLabel === "password") {
                    errorMessage = "Password must be at least 12 characters long";
                }
                break;
            default:
                break;
        }
        // return raiseClientError(res, 422, isValid.error, "please check filled details");
        const response = new Response(false, 422);
        response.setError(isValid.error);
        response.setMessage(errorMessage);
        return res.status(422).json(response.getResponse());
    }
    next();
};

export const validateSignInData = (req, res, next) => {
    const { body: data = {} } = req;
    const isValid = signInSchema.validate(data);
    if (isValid && isValid.error != null) {
        const {error: {details} = {}} = isValid || {};
        const {context: {label} = {}} = details[0] || {};
        // return raiseClientError(res, 422, isValid.error, "please check filled details");
        const response = new Response(false, 422);
        response.setError(isValid.error);
        response.setMessage(label);
        return res.status(422).json(response.getResponse());
    }
    next();
};

export const validateDoctorSignInData = (req, res, next) => {
    const { body: data = {} } = req;
    const isValid = doctorSignInSchema.validate(data);
    if (isValid && isValid.error != null) {
        const {error: {details} = {}} = isValid || {};
        const {context: {label} = {}} = details[0] || {};
        // return raiseClientError(res, 422, isValid.error, "please check filled details");
        const response = new Response(false, 422);
        response.setError(isValid.error);
        response.setMessage(label);
        return res.status(422).json(response.getResponse());
    }
    next();
};

export const validateUpdatePasswordData = (req, res, next) => {
    const { body: data = {} } = req;
    const isValid = updatedPasswordSchema.validate(data);
    if (isValid && isValid.error != null) {
        // console.log("39013093 ----------- isValid --> ", isValid.error.details[0].message);
        // return raiseClientError(res, 422, isValid.error, "please check filled details");
        const response = new Response(false, 422);
        response.setError(isValid.error);
        response.setMessage("Password must contain atleast 1 uppercase, lowercase, number & special character");
        return res.status(422).json(response.getResponse());
    }
    next();
};
