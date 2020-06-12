import { CHAT_INITIAL_STATE } from "../../data";

export default (state = CHAT_INITIAL_STATE, action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return {
        ...CHAT_INITIAL_STATE
      };
  }
};
