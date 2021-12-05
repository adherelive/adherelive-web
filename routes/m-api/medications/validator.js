import Joi from "@hapi/joi";
import moment from "moment";
import {USER_CATEGORY, WHEN_TO_TAKE_ABBREVATIONS} from "../../../constant";
import {raiseClientError} from "../../helper";
import Response from "../../../app/helper/responseFormat";

const medicationReminderFormSchema = Joi.object().keys({
  // medicine_id: Joi.number().required(),
  strength: Joi.number().required(),
  unit: Joi.string().required(),
  quantity: Joi.number().required(),
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
  participant_id: Joi.string().optional().allow(""),
  critical: Joi.boolean().optional().allow(""),
  description: Joi.string().max(500, "utf-8").optional().allow(""),
  care_plan_id: Joi.number().optional().allow("", null),
  patient_id: Joi.number().optional().allow("", null),
});

// const validateStartTime = startTime => {
//   const now = moment().subtract(3, "minutes");
//   return moment(startTime).isAfter(now);
// };
//
// const validateTimeInterval = (startTime, endTime) => {
//   return moment(startTime) < moment(endTime);
// };

export const validateMedicationReminderData = (req, res, next) => {
  const {body: data = {}} = req;
  const {start_date, end_date} = data;
  const isValid = medicationReminderFormSchema.validate(data);
  if (isValid && isValid.error != null) {
    // return raiseClientError(res, 422, isValid.error, "please check filled details");
    const response = new Response(false, 422);
    response.setError(isValid.error);
    response.setMessage("please check filled details");
    return res.status(422).json(response.getResponse());
  }
  next();
};
