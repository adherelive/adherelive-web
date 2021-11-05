import { SEARCH_DOCTOR_COMPLETE } from "../doctors";

function emailsReducer(state, data) {
  const { emails = {} } = data || {};
  if (emails) {
    return {
      ...state,
      ...emails,
    };
  } else {
    return state;
  }
}

export default (state = {}, payload) => {
  const { type, data } = payload || {};
  switch (type) {
    case SEARCH_DOCTOR_COMPLETE:
      return emailsReducer(state, data);
    default:
      return state;
  }
};
