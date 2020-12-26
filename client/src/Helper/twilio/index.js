import config from "../../config";

export const getRoomId = (doctor, patient) => {
  // console.log("21380138012 config", config, process.env);
  return`${doctor}-${config.CHANNEL_SERVER}-${patient}`;
};