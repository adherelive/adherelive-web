import Joi from "@hapi/joi";
import moment from "moment";
import { USER_CATEGORY } from "../../../constant";
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
  description: Joi.string()
    .optional()
    .allow(""),
  organizer: Joi.object()
    .keys({
      id: Joi.number().required(),
      category: Joi.string().required(),
    })
    .optional(),
  description: Joi.string().optional(),
  treatment: Joi.string().optional(),
  // TODO: rr_rule here?
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
    return raiseClientError(res, 422, isValid.error, "");
  }
  if (!validateStartTime(start_time)) {
    return raiseClientError(
      res,
      422,
      {},
      "You can't create Appointment on passed time"
    );
  }
  if (!validateTimeInterval(start_time, end_time)) {
    return raiseClientError(
      res,
      422,
      {},
      "Start time should be less than end time"
    );
  }
  next();
};
