const initialState = {};

export const UPDATE_FEATURES = "UPDATES_FEATURES";

export default function (state = initialState, action) {
  const { type, payload = {} } = action;
  switch (type) {
    case UPDATE_FEATURES:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
}
