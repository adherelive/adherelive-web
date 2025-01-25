import * as fs from 'fs';

export const getSeparateName = (name) => {
  const nameArr = name.split(" ");
  const [first = null, middle = null, ...rest] = nameArr || [];

  let first_name = first || null;
  let middle_name = middle || null;
  let last_name = rest.length > 1 ? rest.join(" ") : null;

  return {
    first_name,
    middle_name,
    last_name,
  };
};

export const getFullName = ({ first_name, middle_name, last_name }) => {
  return `${first_name}${middle_name ? ` ${middle_name}` : ""}${
    last_name ? ` ${last_name}` : ""
  }`;
};

export const checkAndCreateDirectory = (directoryPath) => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }
};

export const fileExists = (filePath) => fs.existsSync(filePath);

export const getRoomId = (doctor, patient) => {
  return `careplan-${doctor}-${patient}-${process.config.twilio.CHANNEL_SERVER}`;
};

export const getRoomUsers = (room = "") =>
  room.split(`-${process.config.twilio.CHANNEL_SERVER}-`);

export const separateNameForSearch = (value) => {
  let firstName = value;
  let middleName = value;
  let lastName = value;
  const name = value.split(" ");

  if (name.length > 1) {
    if (name.length === 2) {
      firstName = name[0];
      middleName = name[1];
    } else {
      const [first = null, middle = null, ...rest] = name || [];
      firstName = name[0];
      middleName = name[1];
      // lastName = name[2];
      lastName = rest.length > 1 ? rest.join(" ") : null;
    }
  }

  return { firstName, middleName, lastName };
};
