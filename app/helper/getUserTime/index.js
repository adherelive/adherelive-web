import moment from "moment";

export const getDoctorCurrentTime = doctorUserId => {
  // fetch timezone for doctor user id and use the same to share current time
  // todo: need to fetch timezone from device. using IST for now

  return moment().tz("Asia/Kolkata");
};

export const getConvertedTime = ({ time, userId }) => {
  return moment(time).tz("Asia/Kolkata");
};
