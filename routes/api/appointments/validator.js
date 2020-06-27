import Joi from "@hapi/joi";
import moment from "moment";
import { USER_CATEGORY } from "../../../constant";
import Response from "../../../app/helper/responseFormat";
import { raiseClientError } from "../../helper";

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
  reason: Joi.string().required(),
  description: Joi.string()
    .optional()
    .allow(""),
  organizer: Joi.object()
    .keys({
      id: Joi.number().required(),
      category: Joi.string().required(),
    })
    .optional(),
  // description: Joi.string().optional(),
  treatment: Joi.string().optional().allow(""),
  // TODO: rr_rule here?
});

const validateStartTime = (startTime) => {
  const now = moment().subtract(3, "minutes");
  console.log("START TIME TEST ----------- ", moment(startTime), now, moment(startTime).isAfter(now));
  return moment(startTime).isAfter(now);
};

const validateTimeInterval = (startTime, endTime) => {
  return moment(startTime) < moment(endTime);
};

export const validateAppointmentFormData = (req, res, next) => {
  console.log("========================8971613136713671 getting here 1");
  const { body: data = {} } = req;
  const { start_time, end_time } = data;
  const isValid = appointmentFormSchema.validate(data);
  console.log("START TIME TEST ----------- 2", moment(start_time), moment(end_time));
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
  console.log("========================8971613136713671 getting here 2");
  next();
};
