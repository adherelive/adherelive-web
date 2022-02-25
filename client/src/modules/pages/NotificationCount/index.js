const SET_UNSEEN_NOTIFICATION_COUNT = "SET_UNSEEN_NOTIFICATION_COUNT";

export const setUnseenNotificationCount = (unseen_notification_count) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({
        type: SET_UNSEEN_NOTIFICATION_COUNT,
        payload: { unseen_notification_count },
      });
    } catch (error) {
      console.log("SET_UNSEEN_NOTIFICATION_COUNT error ---> ", error);
    }

    return response;
  };
};

function setUnseenNotiCountReducer(state, data) {
  const { count: unseen_notification_count = null } = data || {};
  if (
    unseen_notification_count ||
    unseen_notification_count.toString() === "0"
  ) {
    const countData = { unseen_notification_count: unseen_notification_count };
    return {
      ...state,
      ...countData,
    };
  } else {
    return state;
  }
}

export default (state = {}, data) => {
  const { type, payload } = data || {};
  switch (type) {
    case SET_UNSEEN_NOTIFICATION_COUNT:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};
