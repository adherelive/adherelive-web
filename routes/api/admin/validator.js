import Joi from "joi";
import { validationError } from "../helper";
import { PASSWORD_LENGTH } from "../../../constant";

const addProviderSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required()
    .label("Please enter valid email"),
  password: Joi.string()
    .min(PASSWORD_LENGTH)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/)
    .required()
    .label(
      "Password must contain atleast 1 uppercase, lowercase, number & special character"
    ),
  confirm_password: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .label("Password does not match"),
  mobile_number: Joi.string()
    .min(10)
    .max(10)
    .regex(/^\d+$/)
    .optional()
    .allow("", null)
    .label("Please enter correct mobile number"),
  prefix: Joi.string()
    .max(4)
    .regex(/^\d+$/)
    .optional()
    .allow("", null)
    .label("Please select correct prefix"),
  name: Joi.string()
    .trim()
    .required()
    .label("Please enter name of provider"),
  address: Joi.string()
    .trim()
    .required()
    .label("Please enter correct address"),

    // custom ui
    icon: Joi.string().optional().allow(null, ''),

  // account details
    razorpay_account_id: Joi.string().optional().allow("", null),
    razorpay_account_name: Joi.string().optional().allow("", null),
  account_type: Joi.string()
    .optional()
    .allow("", null),
  customer_name: Joi.when("account_type", {
    is: Joi.string().disallow("", null),
    then: Joi.string().required().label("Please enter customer name as registered with the bank"),
    otherwise: Joi.string()
      .optional()
      .allow("", null)
  }),
  account_number: Joi.when("account_type", {
      is: Joi.string().disallow("", null),
      then: Joi.string().required().label("Please enter account number"),
      otherwise: Joi.string()
          .optional()
          .allow("", null)
  }),
  ifsc_code: Joi.when("account_type", {
      is: Joi.string().disallow("", null),
      then: Joi.string().required().label("Please enter IFSC Code"),
      otherwise: Joi.string()
          .optional()
          .allow("", null)
  }),
  use_as_main: Joi.boolean()
      .optional()
      .default(true),
  upi_id: Joi.string()
    .optional()
    .allow("", null)
});

const updateProviderSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required()
    .label("Please enter valid email"),
  mobile_number: Joi.string()
    .min(10)
    .max(10)
    .regex(/^\d+$/)
    .optional()
    .allow("", null)
    .label("Please enter correct mobile number"),
  prefix: Joi.string()
    .max(4)
    .regex(/^\d+$/)
    .optional()
    .allow("", null)
    .label("Please select correct prefix"),
  name: Joi.string()
    .trim()
    .required()
    .label("Please enter name of provider"),
  address: Joi.string()
    .trim()
    .required()
    .label("Please enter correct address"),

    // custom ui
    icon: Joi.string().optional().allow(null, ''),

    // account details
    razorpay_account_id: Joi.string().optional().allow("", null),
    razorpay_account_name: Joi.string().optional().allow("", null),
    account_type: Joi.string()
        .optional()
        .allow("", null),
    customer_name: Joi.when("account_type", {
        is: Joi.string().disallow("", null),
        then: Joi.string().required().label("Please enter customer name as registered with the bank"),
        otherwise: Joi.string()
            .optional()
            .allow("", null)
    }),
    account_number: Joi.when("account_type", {
        is: Joi.string().disallow("", null),
        then: Joi.string().required().label("Please enter account number"),
        otherwise: Joi.string()
            .optional()
            .allow("", null)
    }),
    ifsc_code: Joi.when("account_type", {
        is: Joi.string().disallow("", null),
        then: Joi.string().required().label("Please enter IFSC Code"),
        otherwise: Joi.string()
            .optional()
            .allow("", null)
    }),
    use_as_main: Joi.boolean()
        .optional()
        .default(true),
    upi_id: Joi.string()
        .optional()
        .allow("", null)
});

const addMedicineSchema = Joi.object().keys({
    name: Joi.string()
    .required()
    .label("Please enter valid medicine name"),
    type: Joi.string()
      .required()
      .label("Please select valid medicine type"),
    generic_name: Joi.string()
        .optional()
        .allow("", null)
});

export const validateAddProviderData = (req, res, next) => {
  const { body: data = {} } = req;
  const isValid = addProviderSchema.validate(data);
  if (isValid && isValid.error != null) {
    return validationError(res, isValid);
  }
  next();
};

export const validateUpdateProviderData = (req, res, next) => {
  const { body: data = {} } = req;
  const isValid = updateProviderSchema.validate(data);
  if (isValid && isValid.error != null) {
    return validationError(res, isValid);
  }
  next();
};


export const validateAddMedicineData = (req, res, next) => {
  const { body: data = {} } = req;
  const isValid = addMedicineSchema.validate(data);
  if (isValid && isValid.error != null) {
    return validationError(res, isValid);
  }
  next();
};