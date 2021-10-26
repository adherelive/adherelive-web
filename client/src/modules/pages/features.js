export const SHOW_VERIFY_MODAL = "SHOW_VERIFY_MODAL";

export const showVerifyModal = (value) => {
  return async (dispatch) => {
    dispatch({
      type: SHOW_VERIFY_MODAL,
      data: { showVerifyModal: value },
    });
  };
};

function showModalReducer(state, data) {
  const { showVerifyModal = null } = data || {};
  if (showVerifyModal !== null) {
    return {
      ...state,
      showVerifyModal,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    case SHOW_VERIFY_MODAL:
      return showModalReducer(state, data);
    default:
      return state;
  }
};
