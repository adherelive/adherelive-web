import Joi from "@hapi/joi";
import moment from "moment";
import Response from "../../../app/helper/responseFormat";

const appointmentFormSchema = Joi.object().keys({
  participant_two: Joi.object()
    .keys({
      id: Joi.number().required(),
      category: Joi.string().required(),
    })
    .required(),
  date: Joi.date().required(),
  start_time: Joi.date().required(),
  end_time: Joi.date().required(),
  reason: Joi.string().trim().required().max(200, "utf-8"),
  description: Joi.string().max(500, "utf-8").optional().allow("").trim(),
  type: Joi.number().required(),
  provider_id: Joi.number().optional().allow(""),
  provider_name: Joi.string().optional().allow(""),
  type_description: Joi.string().required(),
  // TODO: rr_rule here? Removed duplicate entry for radiology_type
  radiology_type: Joi.string().optional().allow(""),
  critical: Joi.boolean().optional().allow(""),
  organizer: Joi.object()
    .keys({
      id: Joi.number().required(),
      category: Joi.string().required(),
    })
    .optional(),
  // description: Joi.string().optional(),
  treatment_id: Joi.number().optional().allow(""),
});

const validateStartTime = (startTime) => {
  const now = moment().subtract(3, "minutes");

  return moment(startTime).isAfter(now);
};

const validateTimeInterval = (startTime, endTime) => {
  return moment(startTime) < moment(endTime);
};

export const validateAppointmentFormData = (req, res, next) => {
  const { body: data = {} } = req;
  const { start_time, end_time } = data;
  const isValid = appointmentFormSchema.validate(data);

  if (isValid && isValid.error != null) {
    // return raiseClientError(res, 422, isValid.error, "please check filled details");
    const response = new Response(false, 422);
    response.setError(isValid.error);
    response.setMessage("please check filled details");
    return res.status(422).json(response.getResponse());
  }
  // if (!validateStartTime(start_time)) {
  //   const response = new Response(false, 422);
  //   response.setMessage("you can't create Appointment on passed time.");
  //   return res.status(422).json(response.getResponse());
  // }
  if (!validateTimeInterval(start_time, end_time)) {
    const response = new Response(false, 422);
    response.setMessage("start time should be less than end time");
    return res.status(422).json(response.getResponse());
  }

  next();
};
