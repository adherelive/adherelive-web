import { doRequest } from "../../Helper/network";
import { Twilio } from "../../Helper/urls";
import { REQUEST_TYPE } from "../../constant";

const intialState = {};

const FETCHING_TWILIO_VIDEO_ACCESS_TOKEN = "FETCHING_TWILIO_VIDEO_ACCESS_TOKEN";
const FETCHING_TWILIO_VIDEO_ACCESS_TOKEN_COMPLETED =
  "FETCHING_TWILIO_VIDEO_ACCESS_TOKEN_COMPLETED";
const FETCHING_TWILIO_VIDEO_ACCESS_TOKEN_COMPLETED_WITH_ERROR =
  "FETCHING_TWILIO_VIDEO_ACCESS_TOKEN_COMPLETED_WITH_ERROR";

const FETCHING_TWILIO_CHAT_ACCESS_TOKEN = "FETCHING_TWILIO_CHAT_ACCESS_TOKEN";
const FETCHING_TWILIO_CHAT_ACCESS_TOKEN_COMPLETED =
  "FETCHING_TWILIO_CHAT_ACCESS_TOKEN_COMPLETED";
const FETCHING_TWILIO_CHAT_ACCESS_TOKEN_COMPLETED_WITH_ERROR =
  "FETCHING_TWILIO_CHAT_ACCESS_TOKEN_COMPLETED_WITH_ERROR";

const SET_PATIENT_FOR_CHAT_COMPLETED = "SET_PATIENT_FOR_CHAT_COMPLETED";

const SET_CARE_PLAN_FOR_CHAT_COMPLETED = "SET_CARE_PLAN_FOR_CHAT_COMPLETED";

const setTwilioAccessToken = (state, data) => {
  const { identity = {}, token = {} } = data;
  return { ...state, identity: identity, videoToken: token };
};

const setTwilioChatAccessToken = (state, data) => {
  const { token = {} } = data;
  return { ...state, chatToken: token };
};

const setPatientIdForChat = (state, data) => {
  const { patient_id = "" } = data;
  return { ...state, patientId: patient_id };
};

const setCareplanIdForChat = (state, data) => {
  const { care_plan_id = null } = data;
  return {
    ...state,
    care_plan_id,
  };
};

export const fetchVideoAccessToken = (userId) => {
  return async (dispatch) => {
    try {
      dispatch({ type: FETCHING_TWILIO_VIDEO_ACCESS_TOKEN });
      let response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: Twilio.getTwilioVideoAccessToken(),
        params: { userId: userId },
      });

      const { status, payload } = response;

      if (status === true) {
        dispatch({
          type: FETCHING_TWILIO_VIDEO_ACCESS_TOKEN_COMPLETED,
          payload: payload.data,
        });
      } else if (response.status === false) {
        dispatch({
          type: FETCHING_TWILIO_VIDEO_ACCESS_TOKEN_COMPLETED_WITH_ERROR,
          payload: payload.error,
        });
      }
    } catch (error) {}
  };
};

export const fetchChatAccessToken = (userId) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: FETCHING_TWILIO_CHAT_ACCESS_TOKEN });
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: Twilio.getTwilioChatAccessToken(),
        params: { identity: userId, device: "browser" },
      });

      const { status, payload } = response;

      if (status === true) {
        dispatch({
          type: FETCHING_TWILIO_CHAT_ACCESS_TOKEN_COMPLETED,
          payload: payload.data,
        });
      } else if (response.status === false) {
        dispatch({
          type: FETCHING_TWILIO_CHAT_ACCESS_TOKEN_COMPLETED_WITH_ERROR,
          payload: payload.error,
        });
      }
    } catch (error) {}
    return response;
  };
};

export const setPatientForChat = (patient_id) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: SET_PATIENT_FOR_CHAT_COMPLETED,
        payload: { patient_id },
      });
    } catch (error) {}
  };
};

export const setCareplanForChat = (care_plan_id) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: SET_CARE_PLAN_FOR_CHAT_COMPLETED,
        payload: { care_plan_id },
      });
    } catch (error) {}
  };
};

export default (state = intialState, action) => {
  const { type, payload = {} } = action;
  switch (type) {
    case FETCHING_TWILIO_VIDEO_ACCESS_TOKEN_COMPLETED: {
      return setTwilioAccessToken(state, payload);
    }
    case FETCHING_TWILIO_CHAT_ACCESS_TOKEN_COMPLETED: {
      return setTwilioChatAccessToken(state, payload);
    }
    case SET_PATIENT_FOR_CHAT_COMPLETED: {
      return setPatientIdForChat(state, payload);
    }
    case SET_CARE_PLAN_FOR_CHAT_COMPLETED:
      return setCareplanIdForChat(state, payload);
    default: {
      return state;
    }
  }
};
