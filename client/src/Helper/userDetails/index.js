import { USER_CATEGORY } from "../../constant";

export const getUserDetails = (data) => {
  const { type, id, patients, doctors, care_takers } = data || {};
  switch (type) {
    case USER_CATEGORY.PATIENT:
      return patients[id];
    case USER_CATEGORY.DOCTOR:
      return doctors[id];
    case USER_CATEGORY.HSP:
      return doctors[id];
    case USER_CATEGORY.CARE_TAKER:
      return care_takers[id];
    default:
      return {};
  }
};
