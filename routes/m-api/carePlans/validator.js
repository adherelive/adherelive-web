import {validationError} from "../../helper";
import Joi from "@hapi/joi";

const templateCreateCarePlanForm = Joi.object().keys({
    medicationsData: Joi.array(),
    appointmentsData: Joi.array(),
    treatment_id: Joi.number().required().label("Incorrect Treatment value selected"),
    severity_id: Joi.number().required().label("Incorrect Severity value selected"),
    condition_id: Joi.number().required().label("Incorrect Condition value selected"),
    name: Joi.string().trim().required().messages({
        'string.empty' : "Template name cannot be empty"
    }),
    createTemplate: Joi.boolean()
});

export const validateCreateCarePlanFromTemplate = (req, res, next) => {
    const { body: data = {} } = req;
    const isValid = templateCreateCarePlanForm.validate(data);
    console.log("8931791 isValid ---> ", isValid);
    if (isValid && isValid.error != null) {
        return validationError(res, isValid);
    }
    next();
};