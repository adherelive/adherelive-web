import { TREATMENT_INITIAL_STATE } from "../../data";

export default (state = TREATMENT_INITIAL_STATE, action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return state;
  }
};
