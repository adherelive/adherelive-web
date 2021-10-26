import config from "../../config";

export const getRoomId = (doctor, patient) => {
  // console.log("21380138012 config", config, process.env);
  return `${doctor}-${config.CHANNEL_SERVER}-${patient}`;
};

export const getDoctorFromRoomId = (roomId) => {
  return roomId.split(`-${config.CHANNEL_SERVER}-`)[0] || null;
};

export const getPatientFromRoomId = (roomId) => {
  return roomId.split(`-${config.CHANNEL_SERVER}-`)[1] || null;
};
