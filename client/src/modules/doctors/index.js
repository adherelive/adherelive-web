import { DOCTOR_INITIAL_STATE } from "../../data";

export default (state = DOCTOR_INITIAL_STATE, action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return state;
  }
};
