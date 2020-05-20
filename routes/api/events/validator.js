import Joi from "@hapi/joi";
import moment from "moment";
import {USER_CATEGORY} from "../../../constant";
import {raiseClientError} from "../helper";

const appointmentFormSchema = Joi.object().keys({
    participant_two: Joi.object().keys({
        id: Joi.number().required(),
        category: Joi.string().required(),
    }).required(),
    start_date: Joi.date().options({ convert: true }).required(),
    end_date: Joi.date(),
    description: Joi.string().optional().allow(""),
    // TODO: rr_rule here?
});

const validateStartTime = startTime => {
    const now = moment().subtract(3, "minutes");
    return moment(startTime).isAfter(now);
};

const validateTimeInterval = (startTime, endTime) => {
    return moment(startTime) < moment(endTime);
};

export const validateAppointmentFormData = (req, res, next) => {
    const { body: data = {} } = req;
    const { startTime, endTime } = data;
    // const isValid = Joi.validate(data, appointmentFormSchema);
    const isValid = appointmentFormSchema.validate(data);
    if (isValid && isValid.error != null) {
        return raiseClientError(res, 422, isValid.error, "");
        // const response = new Response(false, 422);
        // response.setError(isValid.error);
        // return res.status(422).json(response.getResponse());
    }
    // if (!validateStartTime(startTime)) {
    //     return raiseClientError(res, 422, "you can't create Appointment on passed time.", "");
    //     // const response = new Response(false, 422);
    //     // response.setError({
    //     //     error: "you can't create Appointment on passed time."
    //     // });
    //     // return res.status(422).json(response.getResponse());
    // }
    // if (!validateTimeInterval(startTime, endTime)) {
    //     return raiseClientError(res, 422, "start time should be less than end time", "");
    //     // const response = new Response(false, 422);
    //     // response.setError({ error: "start time should be less than end time" });
    //     // return res.status(422).json(response.getResponse());
    // }
    next();
};