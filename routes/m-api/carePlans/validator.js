import {validationError} from "../../helper";
import Joi from "@hapi/joi";

const templateCreateCarePlanForm = Joi.object().keys({
    medicationsData: Joi.array(),
    appointmentsData: Joi.array(),
    treatment_id: Joi.number().required().label("Incorrect Treatment value selected"),
    severity_id: Joi.number().optional().allow("", null).label("Incorrect Severity value selected"),
    condition_id: Joi.number().optional().allow("", null).label("Incorrect Condition value selected"),
    createTemplate: Joi.boolean(),
    name: Joi.string().when('createTemplate', {
        is: Joi.boolean().valid(true),
        then: Joi.string().trim().required().messages({
                'string.empty' : "Template name cannot be empty"
            }),
        otherwise: Joi.string().optional().allow("")
    }),
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