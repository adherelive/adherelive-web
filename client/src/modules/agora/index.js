import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import { Agora } from "../../Helper/urls";

export const AGORA_VIDEO_TOKEN_START = "AGORA_VIDEO_TOKEN_START";
export const AGORA_VIDEO_TOKEN_COMPLETE = "AGORA_VIDEO_TOKEN_COMPLETE";
export const AGORA_VIDEO_TOKEN_FAILED = "AGORA_VIDEO_TOKEN_FAILED";

export const VOIP_CALL_NOTIFY_START = "VOIP_CALL_NOTIFY_START";
export const VOIP_CALL_NOTIFY_START_COMPLETE =
  "VOIP_CALL_NOTIFY_START_COMPLETE";
export const VOIP_CALL_NOTIFY_START_FAILED = "VOIP_CALL_NOTIFY_START_FAILED";

export const VOIP_CALL_MISSED_NOTIFY_START = "VOIP_CALL_MISSED_NOTIFY_START";
export const VOIP_CALL_MISSED_NOTIFY_COMPLETE =
  "VOIP_CALL_MISSED_NOTIFY_COMPLETE";
export const VOIP_CALL_MISSED_NOTIFY_FAILED = "VOIP_CALL_MISSED_NOTIFY_FAILED";

export const fetchVideoAccessToken = (userId) => {
  console.log("198731237 userId", userId);
  return async (dispatch) => {
    try {
      dispatch({ type: AGORA_VIDEO_TOKEN_START });

      const response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: Agora.getVideoAccessToken(userId),
        // params: { userId: userId }
      });

      const { status, payload: { data } = {} } = response;

      if (status === true) {
        dispatch({
          type: AGORA_VIDEO_TOKEN_COMPLETE,
          payload: data,
        });
      } else {
        dispatch({
          type: AGORA_VIDEO_TOKEN_FAILED,
        });
      }
    } catch (error) {
      console.log("fetchVideoAccessToken failed", error);
    }
  };
};

export const startCall = (roomId) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: VOIP_CALL_NOTIFY_START });

      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: Agora.startCall(),
        data: {
          roomId,
        },
      });

      const { status, payload: { data = {}, error = {} } = {} } =
        response || {};
      if (status === true) {
        dispatch({
          type: VOIP_CALL_NOTIFY_START_COMPLETE,
          data,
        });
      } else {
        dispatch({
          type: VOIP_CALL_NOTIFY_START_FAILED,
          payload: error,
        });
      }
    } catch (error) {
      console.log("startCall module error", error);
    }
    return response;
  };
};

export const missedCall = (roomId) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: VOIP_CALL_MISSED_NOTIFY_START });

      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: Agora.missedCall(),
        data: {
          roomId,
        },
      });

      const { status, payload: { data = {}, error = {} } = {} } =
        response || {};
      if (status === true) {
        dispatch({
          type: VOIP_CALL_MISSED_NOTIFY_COMPLETE,
          data,
        });
      } else {
        dispatch({
          type: VOIP_CALL_MISSED_NOTIFY_FAILED,
          payload: error,
        });
      }
    } catch (error) {
      console.log("missedCall module error", error);
    }
    return response;
  };
};

function videoTokenReducer(state, data) {
  const { token } = data || {};
  if (token) {
    return {
      ...state,
      video_token: token,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, payload } = action || {};
  switch (type) {
    case AGORA_VIDEO_TOKEN_COMPLETE:
      return videoTokenReducer(state, payload);
    default:
      return state;
  }
};
