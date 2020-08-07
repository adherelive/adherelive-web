import Joi from "@hapi/joi";
import moment from "moment";
import { USER_CATEGORY } from "../../../constant";
import { raiseClientError } from "../../helper";
import Response from "../../../app/helper/responseFormat";

const medicationReminderFormSchema = Joi.object().keys({
    // medicine_id: Joi.number().required(),
    strength: Joi.number().required(),
    unit: Joi.string().required(),
    quantity: Joi.number().required(),
    when_to_take: Joi.array().optional(),
    repeat: Joi.string().required(),
    repeat_days: Joi.array(),
    repeat_interval: Joi.number().optional(),
    start_date: Joi.date().required(),
    end_date: Joi.date().optional().allow(null),
    medication_stage: Joi.string().optional(),
    medicine_id: Joi.number().required(),
    participant_id: Joi.string().optional().allow(""),
    critical: Joi.boolean().optional().allow(""),
    description: Joi.string().max(500, 'utf-8').optional().allow("")
});

const validateStartTime = startTime => {
  const now = moment().subtract(3, "minutes");
  return moment(startTime).isAfter(now);
};

const validateTimeInterval = (startTime, endTime) => {
  return moment(startTime) < moment(endTime);
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
