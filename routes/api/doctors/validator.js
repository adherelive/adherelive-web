import Response from "../../../app/helper/responseFormat";
import Joi from "@hapi/joi";
import moment from "moment";
import {validationError} from "../helper";
import {USER_CATEGORY} from "../../../constant";

const addDoctorForm = Joi.object().keys({
    name: Joi.string().optional().allow("", null),
    city: Joi.string().required().label("Please enter your city"),
    category: Joi.string().required().valid(USER_CATEGORY.DOCTOR).label("Please select correct category"),
    mobile_number: Joi.string().length(10).regex(/^\d+$/).optional().allow("", null).label("Please enter correct mobile number"),
    prefix: Joi.string().regex(/^\d+$/).required().label("Please select correct prefix"),
    profile_pic: Joi.string().uri().label("Please check uploaded profile pic")
});

const addPatientForm = Joi.object().keys({
    mobile_number: Joi.string().length(10).regex(/^\d+$/).required().label("Please enter correct mobile number"),
    name: Joi.string().optional().allow("", null),
    gender: Joi.string().length(1).optional().allow("", null),
    date_of_birth: Joi.date().required().label("Please enter date of birth"),
    prefix: Joi.string().regex(/^\d+$/).required().label("Please select prefix"),
    treatment_id: Joi.number().required().label("Incorrect Treatment value selected"),
    severity_id: Joi.number().required().label("Incorrect Severity value selected"),
    condition_id: Joi.number().required().label("Incorrect Condition value selected"),
});


export const validateAddDoctorData = (req, res, next) => {
    const { body: data = {} } = req;
    const isValid = addDoctorForm.validate(data);
    if (isValid && isValid.error != null) {
        return validationError(res, isValid);
    }
    next();
};

const validDOB = (date) => {
  return moment().diff(date, 'd') <= 0;
};

export const validateAddPatientData = (req, res, next) => {
    const { body: data, data: {date_of_birth} = {} } = req;
    const isValid = addPatientForm.validate(data);
    if (isValid && isValid.error != null) {
        return validationError(res, isValid);
    } if(!validDOB(date_of_birth)) {
        const response = new Response(false, 422);
        response.setError({});
        response.setMessage("Incorrect date of birth");
        return res.status(422).json(response.getResponse());
    }
    next();
};