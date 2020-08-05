import Response from "../../../app/helper/responseFormat";
import Joi from "@hapi/joi";
import moment from "moment";
import {validationError} from "../helper";
import {USER_CATEGORY} from "../../../constant";

const addDoctorForm = Joi.object().keys({
    name: Joi.string().optional().allow("", null),
    city: Joi.string().required().label("Please enter your city"),
    category: Joi.string().required().valid(USER_CATEGORY.DOCTOR).label("Please select correct category"),
    mobile_number: Joi.string().length(10).regex(/^[1-9][0-9]*$/).optional().allow("", null).label("Please enter correct mobile number"),
    prefix: Joi.string().regex(/^\d+$/).required().label("Please select correct prefix"),
    profile_pic: Joi.string().uri().label("Please check uploaded profile pic"),
    email: Joi.string().required().label("Email entered is not valid"),
});

const addPatientForm = Joi.object().keys({
    mobile_number: Joi.string().length(10).regex(/^[1-9][0-9]*$/).required().label("Please enter correct mobile number"),
    name: Joi.string().optional().allow("", null),
    gender: Joi.string().length(1).optional().allow("", null),
    date_of_birth: Joi.date().required().label("Please enter date of birth"),
    prefix: Joi.string().regex(/^\d+$/).required().label("Please select prefix"),
    treatment_id: Joi.number().required().label("Incorrect Treatment value selected"),
    severity_id: Joi.number().required().label("Incorrect Severity value selected"),
    condition_id: Joi.number().required().label("Incorrect Condition value selected"),
});

const addQualificationRegistrationForm = Joi.object().keys({
    gender: Joi.string().required().label("Gender is required"),
    speciality: Joi.string().required().label("Speciality is required"),
    qualification_details: Joi.array().items(
        Joi.object().keys({
            college_id: Joi.string().regex(/^\d+$/).required("College is required"),
            degree_id: Joi.string().regex(/^\d+$/).required("Degree is required"),
            photos: Joi.array().items(Joi.string().uri().label("Please upload valid qualification document")),
            year: Joi.number().max(3000).required("Qualification Year is required"),
            id: Joi.number().optional().allow(0, null),
            photo: Joi.array().optional().allow("")
        })
    ),
    registration_details: Joi.array().items(
        Joi.object().keys({
            expiryDate: Joi.date().required().label("Expiry date is required"),
            number: Joi.string().regex(/^\d+$/).required().label("Please enter valid registration number"),
            registration_council_id: Joi.string().regex(/^\d+$/).required().label("Registration Council is required"),
            year: Joi.number().max(3000).required("Registration Year is required"),
            photos: Joi.array().items(Joi.string().uri().label("Please upload valid registration document")),
            id: Joi.number().optional().allow(0, null),
            photo: Joi.array().optional().allow("")
        }),
    ),
});

const addQualificationStepForm = Joi.object().keys({
    gender: Joi.string().required().label("Gender is required"),
    speciality: Joi.string().required().label("Speciality is required"),
    qualification: Joi.object().keys({
       college_id: Joi.string().regex(/^\d+$/).required("College is required"),
       degree_id: Joi.string().regex(/^\d+$/).required("Degree is required"),
        year: Joi.number().max(3000).required("Qualification Year is required"),
        photos: Joi.array().items(Joi.string().uri().label("Please upload valid qualification document")),
        id: Joi.number().optional().allow(0, null),
    }),
});

const addRegistrationStepForm = Joi.object().keys({
    gender: Joi.string().required().label("Gender is required"),
    speciality: Joi.string().required().label("Speciality is required"),
    qualification_details: Joi.array().items(
        Joi.object().keys({
            photo: Joi.array().optional().allow(""),
            college_id: Joi.string().regex(/^\d+$/).required("College is required"),
            degree_id: Joi.string().regex(/^\d+$/).required("Degree is required"),
            year: Joi.number().max(3000).required("Qualification Year is required"),
            photos: Joi.array().items(Joi.string().uri().label("Please upload valid qualification document")),
            id: Joi.number().optional().allow(0, null),
        })
    ),
    registration: Joi.object().keys({
        expiry_date: Joi.date().required().label("Expiry date is required"),
        number: Joi.string().regex(/^\d+$/).required().label("Please enter valid registration number"),
        registration_council_id: Joi.string().regex(/^\d+$/).required().label("Registration Council is required"),
        year: Joi.number().max(3000).required("Registration Year is required"),
        photos: Joi.array().items(Joi.string().uri().label("Please upload valid registration document")),
        id: Joi.number().optional().allow(0, null),
    }),
});

const addClinicsForm = Joi.object().keys({
    clinics: Joi.array().items(
        Joi.object().keys({
            name: Joi.string().required().label("Clinic name is required"),
            location: Joi.string().required().label("Location of clinic is required"),
            time_slots: Joi.object()
        })
    ),
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

export const validateDoctorQualificationData = (req, res, next) => {
    const { body: data, data: {} = {} } = req;
    const isValid = addQualificationRegistrationForm.validate(data);
    if (isValid && isValid.error != null) {
        return validationError(res, isValid);
    }
    next();
};

export const validateQualificationStepData = (req, res, next) => {
    const { body: data, data: {} = {} } = req;
    const isValid = addQualificationStepForm.validate(data);
    if (isValid && isValid.error != null) {
        return validationError(res, isValid);
    }
    next();
};

export const validateRegistrationStepData = (req, res, next) => {
    const { body: data, data: {} = {} } = req;
    const isValid = addRegistrationStepForm.validate(data);
    if (isValid && isValid.error != null) {
        return validationError(res, isValid);
    }
    next();
};

export const validateClinicData = (req, res, next) => {
    const { body: data, data: {} = {} } = req;
    const isValid = addClinicsForm.validate(data);
    if (isValid && isValid.error != null) {
        return validationError(res, isValid);
    }
    next();
};