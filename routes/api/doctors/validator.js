import Response from "../../../app/helper/responseFormat";
import Joi from "@hapi/joi";
import {validationError} from "../helper";
import {USER_CATEGORY} from "../../../constant";

const addDoctorForm = Joi.object().keys({
    // name: Joi.string().label(),
    // city: Joi.string().label(),
    // category: Joi.string().required().allow(USER_CATEGORY.DOCTOR).label(""),
    // mobile_number: Joi.string().regex().required().label(""),
    // prefix: Joi.string().regex().required().label(""),
    // profile_pic: Joi.string().uri().label("")
});


export const validateAddDoctorData = (req, res, next) => {
    const { body: data = {} } = req;
    const isValid = addDoctorForm.validate(data);
    if (isValid && isValid.error != null) {
        return validationError(res, isValid);
        // const {error: {details} = {}} = isValid || {};
        // const {context: {label} = {}} = details[0] || {};
        // // return raiseClientError(res, 422, isValid.error, "please check filled details");
        // const response = new Response(false, 422);
        // response.setError(isValid.error);
        // response.setMessage(label);
        // return res.status(422).json(response.getResponse());
    }
    next();
};