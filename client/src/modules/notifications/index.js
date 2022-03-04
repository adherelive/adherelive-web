import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import { getNotifications } from "../../Helper/urls/notifications";

export const GET_NOTIFICATION_START = "GET_NOTIFICATION_START";
export const GET_NOTIFICATION_COMPLETED = "GET_NOTIFICATION_COMPLETED";
export const GET_NOTIFICATION_FAILED = "GET_NOTIFICATION_FAILED";

export const getNotification = (value) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: getNotifications(),
        data: value,
      });

      const { status, payload: { data, message = "" } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: GET_NOTIFICATION_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: GET_NOTIFICATION_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("SEARCH NOTIFICATION MODULE catch error ->", error);
    }
    return response;
  };
};

function notificationReducer(state, data) {
  const { notifications = {} } = data || {};
  if (notifications) {
    return {
      ...state,
      ...notifications,
    };
  } else {
    return state;
  }
}

export default (state = {}, payload) => {
  const { type, data } = payload || {};
  switch (type) {
    case GET_NOTIFICATION_COMPLETED:
      return notificationReducer(state, data);
    default:
      return notificationReducer(state, data);
  }
};
