import { TREATMENT_INITIAL_STATE } from "../../data";

function treatmentReducer(state, data) {
  const { treatments } = data || {};
  if (treatments) {
    return {
      ...state,
      ...treatments,
    };
  } else {
    return {
      ...state,
    };
  }
}

export default (state = TREATMENT_INITIAL_STATE, action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return treatmentReducer(state, data)
  }
};
