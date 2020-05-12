import { DRAWER } from "../../constant";

const OPEN_DRAWER = "OPEN_DRAWER";
const CLOSE_DRAWER = "CLOSE_DRAWER";

const intial_state = {
  visible: false,
  loading: false
};

export const open = data => {
  console.log("12312 here module");
  return {
    type: OPEN_DRAWER,
    data
  };
};

export const close = () => {
  return (dispatch, getState) => {
    const { drawer } = getState();
    const { data } = drawer || {};
    const { type, drawer_stack = [] } = data || {};

    const prevData = drawer_stack[drawer_stack.length - 1];
    if (prevData) {
      if (Object.keys(prevData)[0] === type) {
        drawer_stack.pop();
      }
    }
    if (drawer_stack.length === 0) {
      return dispatch({
        type: CLOSE_DRAWER
      });
    } else {
      const remainingData = drawer_stack[drawer_stack.length - 1];
      const type = Object.keys(remainingData)[0];
      return dispatch({
        type: OPEN_DRAWER,
        data: { type, drawer_stack }
      });
    }
  };
};

export default (state = intial_state, action) => {
  const { type, data } = action;
  switch (type) {
    case OPEN_DRAWER:
      return {
        visible: true,
        data
      };
    case CLOSE_DRAWER:
      return {
        visible: false
      };
    default:
      return state;
  }
};
