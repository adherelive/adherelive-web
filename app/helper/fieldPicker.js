import get from "lodash/get";
import set from "lodash/set";

export const fieldPicker = (fields, data) => {
  let obj = {};
  fields.forEach((element, index) => {
    set(obj, element, get(data, element));
  });
  return obj;
};
