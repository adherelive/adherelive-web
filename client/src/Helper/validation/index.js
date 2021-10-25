export const required = (key, data) => {
  if (!data || data.length === 0) {
    return {
      valid: false,
      msg: key + " field is required",
    };
  } else {
    return {
      valid: true,
      msg: "",
    };
  }
};

export const isNumber = (data, positiveOnly = true) => {
  if (isNaN(Number(data)) || !positiveOnly || Number(data) <= 0) {
    return {
      valid: false,
      msg: data + " is not a number",
    };
  } else if (Number.isInteger(Number(data)))
    return {
      valid: true,
      msg: "",
      value: Number(data),
    };
  else {
    return {
      valid: false,
      msg: data + " is not a number",
    };
  }
};

export const hasErrors = (fieldsError) => {
  return Object.keys(fieldsError).some((field) => fieldsError[field]);
};

export const getName = (nameInput) => {
  if (nameInput) {
    return nameInput;
  } else {
    return "";
  }
};
