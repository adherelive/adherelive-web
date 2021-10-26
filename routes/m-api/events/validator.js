import Joi from "@hapi/joi";
import moment from "moment";
import { USER_CATEGORY, WHEN_TO_TAKE_ABBREVATIONS } from "../../../constant";
import { raiseClientError } from "../../helper";
import Response from "../../../app/helper/responseFormat";

const appointmentFormSchema = Joi.object().keys({
  participant_two: Joi.object()
    .keys({
      id: Joi.number().required(),
      category: Joi.string().required(),
    })
    .required(),
  organizer_type: Joi.string().optional(),
  // organizer_id: Joi.with('organizer_type', USER_CATEGORY.CARE_TAKER).number(),
  organizer_id: Joi.when("organizer_type", {
    is: USER_CATEGORY.CARE_TAKER,
    then: Joi.number().required(),
    otherwise: Joi.number().optional(),
  }),
  date: Joi.date().options({ convert: true }).required(),
  start_time: Joi.date().required(),
  end_time: Joi.date().required(),
  description: Joi.string().optional().allow(""),
  // TODO: rr_rule here?
});

const medicationReminderFormSchema = Joi.object().keys({
  // medicine_id: Joi.number().required(),
  strength: Joi.number().required(),
  unit: Joi.string().required(),
  quantity: Joi.number().optional().allow(null),
  when_to_take_abbr: Joi.number().optional(),
  when_to_take: Joi.array().when("when_to_take_abbr", {
    is: Joi.exist(),
    then: Joi.when("when_to_take_abbr", {
      is: WHEN_TO_TAKE_ABBREVATIONS.SOS,
      then: Joi.optional(),
      otherwise: Joi.required(),
    }),
    otherwise: Joi.required(),
  }),
  repeat: Joi.string().required(),
  repeat_days: Joi.array().when("when_to_take_abbr", {
    is: Joi.exist(),
    then: Joi.when("when_to_take_abbr", {
      is: WHEN_TO_TAKE_ABBREVATIONS.SOS,
      then: Joi.optional(),
      otherwise: Joi.required(),
    }),
    otherwise: Joi.required(),
  }),
  repeat_interval: Joi.number().optional(),
  start_date: Joi.date().required(),
  end_date: Joi.date().optional().allow(null),
  medication_stage: Joi.string().optional(),
  medicine_id: Joi.number().required(),
  medicine_type: Joi.number().required(),
  participant_id: Joi.number().optional().allow(""),
  critical: Joi.boolean().optional().allow(""),
  description: Joi.string().max(500, "utf-8").optional().allow(""),
  care_plan_id: Joi.number().optional().allow("", null),
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
  // const isValid = Joi.validate(data, appointmentFormSchema);
  const isValid = appointmentFormSchema.validate(data);
  if (isValid && isValid.error != null) {
    // return raiseClientError(res, 422, isValid.error, "please check filled details");
    const response = new Response(false, 422);
    response.setError(isValid.error);
    response.setMessage("please check filled details");
    return res.status(422).json(response.getResponse());
  }
  if (!validateStartTime(start_time)) {
    const response = new Response(false, 422);
    response.setMessage("you can't create Appointment on passed time.");
    return res.status(422).json(response.getResponse());
  }
  if (!validateTimeInterval(start_time, end_time)) {
    const response = new Response(false, 422);
    response.setMessage("start time should be less than end time");
    return res.status(422).json(response.getResponse());
  }
  next();
};

export const validateMedicationReminderData = (req, res, next) => {
  const { body: data = {} } = req;
  const { start_date, end_date } = data;
  const isValid = medicationReminderFormSchema.validate(data);
  if (isValid && isValid.error != null) {
    // return raiseClientError(res, 422, isValid.error, "please check filled details");
    const response = new Response(false, 422);
    response.setError(isValid.error);
    response.setMessage("please check filled details");
    return res.status(422).json(response.getResponse());
  }
  if (!validateStartTime(start_date)) {
    const response = new Response(false, 422);
    response.setMessage("you can't create Medication on passed time.");
    return res.status(422).json(response.getResponse());
  }
  if (end_date && !validateTimeInterval(start_date, end_date)) {
    const response = new Response(false, 422);
    response.setMessage("start date should be less than end date");
    return res.status(422).json(response.getResponse());
  }
  next();
};
