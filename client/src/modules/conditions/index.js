// import { TREATMENT_INITIAL_STATE } from "../../data";

function conditionReducer(state, data) {
  const { conditions } = data || {};
  if (conditions) {
    return {
      ...state,
      ...conditions,
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
      return conditionReducer(state, data)
  }
};
