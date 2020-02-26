import { USER_INITIAL_STATE } from "../../data";

export default (state = USER_INITIAL_STATE, action) => {
  const { data, type } = action;

  switch (type) {
    default:
      return state;
  }
};
