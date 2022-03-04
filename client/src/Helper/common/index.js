export const getAuthCategory = ({ doctors, authenticated_user }) => {
  let userData = {};
  if (doctors) {
    Object.keys(doctors).forEach((id) => {
      const { basic_info: { user_id } = {} } = doctors[id] || {};

      if (user_id === authenticated_user) {
        userData = doctors[id];
      }
    });
  }

  return userData;
};

export const getFullName = ({ first_name, middle_name, last_name }) => {
  return `${first_name ? ` ${first_name}` : ""}  ${
    middle_name ? ` ${middle_name}` : ""
  }${last_name ? ` ${last_name}` : ""}`;
};

export const isJSON = (obj) => {
  obj = typeof obj !== "string" ? JSON.stringify(obj) : obj;

  try {
    obj = JSON.parse(obj);
  } catch (e) {
    return false;
  }

  return typeof obj === "object" && obj !== null;
};

export const getAbbreviation = (str = "") => {
  return str
    .split(" ")
    .map((word) => word.charAt(0))
    .join(" ");
};
