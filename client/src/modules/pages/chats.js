import { PAGE_INITIAL } from "../../data";

export default (state = PAGE_INITIAL.CHAT_IDS, action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return [...PAGE_INITIAL.CHAT_IDS];
  }
};
