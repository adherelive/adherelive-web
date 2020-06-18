import { DOCTOR_INITIAL_STATE } from "../../data";

function doctorReducer(state, data) {
  const { doctors } = data || {};
  if (doctors) {
    return {
      ...state,
      // ...DOCTOR_INITIAL_STATE,
      ...doctors,
    };
  } else {
    return {
      ...state,
      // ...DOCTOR_INITIAL_STATE,
    };
  }
}

export default (state = DOCTOR_INITIAL_STATE, action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return doctorReducer(state, data);
  }
};
