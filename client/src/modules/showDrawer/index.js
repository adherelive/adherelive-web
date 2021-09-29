import { ADD_PATIENT_COMPLETED } from "../patients/index";
import { GET_PATIENT_CARE_PLAN_DETAILS_COMPLETED } from "../carePlans/index";

function showDrawerReducer(state, data) {
  const { show = false } = data || {};
  // if (show===true || show===true) {
  return { ...state, show };
  // } else {
  // return { ...state };
  // }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    case ADD_PATIENT_COMPLETED:
    case GET_PATIENT_CARE_PLAN_DETAILS_COMPLETED:
      return showDrawerReducer(state, data);

    default:
      return state;
  }
};
