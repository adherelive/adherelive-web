import { PROVIDER_INITIAL_STATE } from "../../data";

export default (state = PROVIDER_INITIAL_STATE, action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return {
        ...PROVIDER_INITIAL_STATE
      };
  }
};
