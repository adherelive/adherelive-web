const fs = require("fs");

export const getSeparateName = name => {
  const nameArr = name.split(" ");
  const [first = null, middle = null, ...rest] = nameArr || [];
  console.log("first middle last ---------------->>>> ", first, middle, rest);
  switch (nameArr.length) {
    case 1:
      return { first_name: nameArr[0], middle_name: null, last_name: null };
    case 2:
      return {
        first_name: nameArr[0],
        middle_name: nameArr[1],
        last_name: null
      };
    case 3:
      return {
        first_name: nameArr[0],
        middle_name: nameArr[1],
        last_name: nameArr[2]
      };
    default:
      return {
        first_name: nameArr[0],
        middle_name: nameArr[2],
        last_name: nameArr.slice(2, nameArr.length)
      };
  }
};

export const getFullName = ({ first_name, middle_name, last_name }) => {
  return `${first_name}${middle_name ? ` ${middle_name}` : ""}${
    last_name ? ` ${last_name}` : ""
  }`;
};

export const checkAndCreateDirectory = directoryPath => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }
};

export const fileExists = filePath => fs.existsSync(filePath);

export const getRoomId = (doctor, patient) => {
  // console.log("21380138012 config", config, process.env);
  return`${doctor}-${process.config.twilio.CHANNEL_SERVER}-${patient}`;
};