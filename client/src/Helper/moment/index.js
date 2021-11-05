import moment from "moment";
import "moment-timezone";

const momentObj = moment;
export const setTimeZone = (timeZone = "Asia/Kolkata") => {
  console.log("1y31237812 momentObj, momentObj().format()", momentObj.tz);
  momentObj.tz.setDefault(timeZone);
};
export default momentObj;
