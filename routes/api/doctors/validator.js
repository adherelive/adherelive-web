import Response from "../../../app/helper/responseFormat";
import Joi from "@hapi/joi";
import moment from "moment";
import { validationError } from "../helper";
import { USER_CATEGORY } from "../../../constant";

const addDoctorForm = Joi.object().keys({
  name: Joi.string()
    .optional()
    .allow("", null),
  city: Joi.string()
    .required()
    .label("Please enter your city"),
  category: Joi.string()
    .required()
    .valid(USER_CATEGORY.DOCTOR)
    .label("Please select correct category"),
  mobile_number: Joi.string()
    .min(10)
    .max(10)
    .regex(/^\d+$/)
    .optional()
    .allow("", null)
    .label("Please enter correct mobile number"),
  prefix: Joi.string()
    .regex(/^\d+$/)
    .required()
    .label("Please select correct prefix"),
  profile_pic: Joi.string()
    .uri()
    .label("Please check uploaded profile pic"),
  signature_pic: Joi.string()
    .uri()
    .label("Please check uploaded signature pic"),
  email: Joi.string()
    .required()
    .label("Email entered is not valid"),
  is_provider: Joi.boolean()
    .optional()
    .allow("", null),
  doctor_id: Joi.number()
    .optional()
    .allow("", null)
    .label("Incorrect doctor selected"),
  existing: Joi.boolean()
    .optional()
    .allow("", null),  
  existingDoctorId : Joi.string()
    .optional()
    .allow("", null),  
});

const addPatientForm = Joi.object().keys({
  mobile_number: Joi.string()
    .min(10)
    .max(10)
    .required()
    .label("Please enter correct mobile number"),
  name: Joi.string()
    .optional()
    .allow("", null),
  gender: Joi.string()
    .length(1)
    .optional()
    .allow("", null),
  date_of_birth: Joi.date()
    .required()
    .label("Please enter date of birth"),
  prefix: Joi.string()
    .regex(/^\d+$/)
    .required()
    .label("Please select prefix"),
  comorbidities: Joi.string()
    .trim()
    .optional()
    .allow(""),
  allergies: Joi.string()
    .trim()
    .optional()
    .allow(""),
  clinical_notes: Joi.string()
    .trim()
    .optional()
    .allow(""),
  diagnosis_type: Joi.number().required(),
  diagnosis_description: Joi.string()
    .trim()
    .max(500)
    .required(),
  treatment_id: Joi.number()
    .required()
    .label("Incorrect Treatment value selected"),
  severity_id: Joi.number()
    .optional()
    .allow("", null)
    .label("Incorrect Severity value selected"),
  condition_id: Joi.number()
    .optional()
    .allow("", null)
    .label("Incorrect Condition value selected"),
  height: Joi.string()
    .optional()
    .allow("", null),
  weight: Joi.string()
    .optional()
    .allow("", null),
  symptoms: Joi.string()
    .trim()
    .optional()
    .allow("", null),
  address: Joi.string()
    .optional()
    .allow("", null)
});

const addQualificationRegistrationForm = Joi.object().keys({
  gender: Joi.string()
    .required()
    .label("Gender is required"),
  speciality_id: Joi.number()
    .required()
    .label("Speciality is required"),
  doctor_id: Joi.number()
    .optional()
    .allow("", null),
  qualification_details: Joi.array().items(
    Joi.object().keys({
      college_id: Joi.string()
        .optional()
        .allow(""),
      college_name: Joi.string().when("college_id", {
        is: "",
        then: Joi.string().required(),
        otherwise: Joi.string()
          .optional()
          .allow("", null)
      }),
      degree_id: Joi.string()
        .regex(/^\d+$/)
        .required("Degree is required"),
      photos: Joi.array().items(
        Joi.string()
          .uri()
          .label("Please upload valid qualification document")
      ),
      year: Joi.number()
        .max(3000)
        .required("Qualification Year is required"),
      id: Joi.number()
        .optional()
        .allow(0, null),
      photo: Joi.array()
        .optional()
        .allow("")
    })
  ),
  registration_details: Joi.array().items(
    Joi.object().keys({
      expiry_date: Joi.date()
        .required()
        .label("Expiry date is required"),
      number: Joi.string()
        .regex(/^[a-zA-Z0-9]*$/)
        .required()
        .label("Please enter valid registration number"),
      registration_council_id: Joi.string()
        .regex(/^\d+$/)
        .required()
        .label("Registration Council is required"),
      year: Joi.number()
        .max(3000)
        .required("Registration Year is required"),
      photos: Joi.array().items(
        Joi.string()
          .uri()
          .label("Please upload valid registration document")
      ),
      id: Joi.number()
        .optional()
        .allow(0, null),
      photo: Joi.array()
        .optional()
        .allow("")
    })
  )
});

const addQualificationStepForm = Joi.object().keys({
  gender: Joi.string()
    .required()
    .label("Gender is required"),
  speciality_id: Joi.number()
    .required()
    .label("Speciality is required"),
  doctor_id: Joi.number()
    .optional()
    .allow("", null),
  qualification: Joi.object().keys({
    college_id: Joi.string()
      .optional()
      .allow(""),
    college_name: Joi.string().when("college_id", {
      is: "",
      then: Joi.string().required(),
      otherwise: Joi.string()
        .optional()
        .allow("", null)
    }),
    degree_id: Joi.string()
      .regex(/^\d+$/)
      .required("Degree is required"),
    year: Joi.number()
      .max(3000)
      .required("Qualification Year is required"),
    photos: Joi.array().items(
      Joi.string()
        .uri()
        .label("Please upload valid qualification document")
    ),
    id: Joi.number()
      .optional()
      .allow(0, null)
  })
});

const addRegistrationStepForm = Joi.object().keys({
  gender: Joi.string()
    .required()
    .label("Gender is required"),
  speciality_id: Joi.number()
    .required()
    .label("Speciality is required"),
  doctor_id: Joi.number()
    .optional()
    .allow("", null),
  qualification_details: Joi.array().items(
    Joi.object().keys({
      photo: Joi.array()
        .optional()
        .allow(""),
      college_id: Joi.string()
        .optional()
        .allow(""),
      college_name: Joi.string().when("college_id", {
        is: "",
        then: Joi.string().required(),
        otherwise: Joi.string()
          .optional()
          .allow("", null)
      }),
      degree_id: Joi.string()
        .regex(/^\d+$/)
        .required("Degree is required"),
      year: Joi.number()
        .max(3000)
        .required("Qualification Year is required"),
      photos: Joi.array().items(
        Joi.string()
          .uri()
          .label("Please upload valid qualification document")
      ),
      id: Joi.number()
        .optional()
        .allow(0, null)
    })
  ),
  registration: Joi.object().keys({
    expiry_date: Joi.date()
      .required()
      .label("Expiry date is required"),
    number: Joi.string()
      .regex(/^[a-zA-Z0-9]*$/)
      .required()
      .label("Please enter valid registration number"),
    registration_council_id: Joi.string()
      .regex(/^\d+$/)
      .required()
      .label("Registration Council is required"),
    year: Joi.number()
      .max(3000)
      .required("Registration Year is required"),
    photos: Joi.array().items(
      Joi.string()
        .uri()
        .label("Please upload valid registration document")
    ),
    id: Joi.number()
      .optional()
      .allow(0, null),
    photo: Joi.array()
      .optional()
      .allow("")
  }),
  id: Joi.number()
    .optional()
    .allow(0, null)
});

const addClinicsForm = Joi.object().keys({
  doctor_id: Joi.number()
    .optional()
    .allow("", null),
  clinics: Joi.array().items(
    Joi.object().keys({
      name: Joi.string()
        .optional()
        .allow(null, ""),
      location: Joi.string()
        .optional()
        .allow("", null),
      // .label("Location of clinic is required"),
      time_slots: Joi.object(),
      clinic_id: Joi.number()
        .optional()
        .allow("", null)
    })
  )
});

export const validateAddDoctorData = (req, res, next) => {
  const { body: data = {} } = req;
  const isValid = addDoctorForm.validate(data);
  if (isValid && isValid.error != null) {
    return validationError(res, isValid);
  }
  next();
};

const validDOB = date => {
  return moment().diff(date, "d") <= 0;
};

export const validateAddPatientData = (req, res, next) => {
  const { body: data, data: { date_of_birth } = {} } = req;
  const isValid = addPatientForm.validate(data);
  if (isValid && isValid.error != null) {
    return validationError(res, isValid);
  }
  if (!validDOB(date_of_birth)) {
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
