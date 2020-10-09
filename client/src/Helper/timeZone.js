import moment from "moment";
export const momentObj = moment;
export const setTimeZone = (timeZone = "Asia/Kolkata") => {
 momentObj.tz.setDefault(timeZone);
};
export default momentObj;