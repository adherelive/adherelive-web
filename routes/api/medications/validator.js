import Joi from "@hapi/joi";
import moment from "moment";
import { USER_CATEGORY } from "../../../constant";
import { raiseClientError } from "../../helper";

const appointmentFormSchema = Joi.object().keys({
  participant_two: Joi.object()
    .keys({
      id: Joi.number().required(),
      category: Joi.string().required()
    })
    .required(),
  date: Joi.date().required(),
  start_time: Joi.date().required(),
  end_time: Joi.date().required(),
  description: Joi.string()
    .optional()
    .allow(""),
  organizer: Joi.object()
    .keys({
      id: Joi.number().required(),
      category: Joi.string().required()
    })
    .optional()
  // TODO: rr_rule here?
});

const medicationReminderFormSchema = Joi.object().keys({
  // medicine_id: Joi.number().required(),
  strength: Joi.number().required(),
  unit: Joi.string().required(),
  quantity: Joi.number().optional(),
  when_to_take: Joi.array().required(),
  repeat: Joi.string().required(),
  repeat_days: Joi.array(),
  repeat_interval: Joi.number().optional().allow(""),
  start_date: Joi.date().required(),
  end_date: Joi.date().optional().allow(""),
  medicine_id: Joi.number().optional().allow(""),
  participant_id: Joi.number().optional().allow(""),
  critical: Joi.boolean().optional().allow(""),
  description: Joi.string().max(500, 'utf-8').optional().allow("")
});

const validateStartTime = startTime => {
  const now = moment().subtract(3, "minutes");
  return moment(startTime).isAfter(now);
};

const validateTimeInterval = (startTime, endTime) => {
  console.log("397913717239 moment(startTime) < moment(endTime) --> ", moment(startTime) < moment(endTime));
  return moment(startTime) < moment(endTime);
};

export const validateMedicationReminderData = (req, res, next) => {
  const { body: data = {} } = req;
  const { start_date, end_date } = data;
  const isValid = medicationReminderFormSchema.validate(data);
  if (isValid && isValid.error != null) {
    return raiseClientError(res, 422, isValid.error, "");
  }
  // if (!validateStartTime(start_date)) {
  //     return raiseClientError(res, 422, {}, "you can't create Medication on passed time.");
  //     // const response = new Response(false, 422);
  //     // response.setError({
  //     //     error: "you can't create Appointment on passed time."
  //     // });
  //     // return res.status(422).json(response.getResponse());
  // }
  if (!validateTimeInterval(start_date, end_date)) {
    return raiseClientError(res, 422, {}, "start date should be less than end date");
    // const response = new Response(false, 422);
    // response.setError({ error: "start time should be less than end time" });
    // return res.status(422).json(response.getResponse());
  }
  next();
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
