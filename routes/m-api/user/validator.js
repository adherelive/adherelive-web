import Joi from "@hapi/joi";
import moment from "moment";
import { USER_CATEGORY } from "../../../constant";
import Response from "../../../app/helper/responseFormat";

const credentialsFormSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const validateStartTime = (startTime) => {
    const now = moment().subtract(3, "minutes");
    console.log("START TIME TEST ----------- ", moment(startTime), now, moment(startTime).isAfter(now));
    return moment(startTime).isAfter(now);
};

const validateTimeInterval = (startTime, endTime) => {
    return moment(startTime) < moment(endTime);
};

export const validateCredentialsData = (req, res, next) => {
    const { body: data = {} } = req;
    const { email, password } = data;
    const isValid = credentialsFormSchema.validate(data);
    if (isValid && isValid.error != null) {
        // return raiseClientError(res, 422, isValid.error, "please check filled details");
        const response = new Response(false, 422);
        response.setError(isValid.error);
        response.setMessage("please check filled details");
        return res.status(422).json(response.getResponse());
    }
    next();
};
