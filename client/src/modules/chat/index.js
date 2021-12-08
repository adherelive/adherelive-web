const MINIMIZED_POPUP = "MINIMIZED_POPUP";
const OPEN_POPUP = "OPEN_POPUP";
const MAXIMIZED_POPUP = "MAXIMIZED_POPUP";
const CLOSE_POPUP = "CLOSE_POPUP";

const intial_state = {
  minimized: false,
  visible: false,
};

export const openPopUp = () => {
  return {
    type: OPEN_POPUP,
  };
};

export const closePopUp = () => {
  return {
    type: CLOSE_POPUP,
  };
};

export const minimizePopUp = () => {
  return {
    type: MINIMIZED_POPUP,
  };
};

export const maximizePopUp = () => {
  return {
    type: MAXIMIZED_POPUP,
  };
};

export default (state = intial_state, action) => {
  const { type, data } = action;
  switch (type) {
    case MINIMIZED_POPUP:
      return {
        ...state,
        minimized: true,
      };
    case OPEN_POPUP:
      return {
        ...state,
        visible: true,
      };
    case MAXIMIZED_POPUP:
      return {
        ...state,
        minimized: false,
      };
    case CLOSE_POPUP:
      return {
        ...state,
        visible: false,
      };
    default:
      return state;
  }
};
