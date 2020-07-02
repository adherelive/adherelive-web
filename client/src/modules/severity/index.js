// import { TREATMENT_INITIAL_STATE } from "../../data";

function severityReducer(state, data) {
    const { severity } = data || {};
    if (severity) {
      return {
        ...state,
        ...severity,
      };
    } else {
      return {
        ...state,
      };
    }
  }
  
  export default (state = {}, action) => {
    const { type, data } = action;
    switch (type) {
      default:
        return severityReducer(state, data)
    }
  };
  