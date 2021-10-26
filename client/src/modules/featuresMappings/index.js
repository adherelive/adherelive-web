import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import {
  fetchGetAllFeaturesUrl,
  fetchToggleChatPermissionUrl,
  fetchToggleVideoCallPermissionUrl,
} from "../../Helper/urls/features";
import { UPDATE_FEATURES } from "../features";

const initialState = {};

const UPDATE_FEATURES_MAPPINGS = "UPDATE_FEATURES_MAPPINGS";

export const getAllFeatures = () => {
  return async (dispatch) => {
    let response = {};
    try {
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: fetchGetAllFeaturesUrl(),
      });

      const { payload = {}, status = false } = response || {};
      if (!status) {
        const { message = {} } = payload;
        return { status: false, error: message };
      } else {
        const { data: { features = {}, feature_mappings = {} } = {} } = payload;
        dispatch({
          type: UPDATE_FEATURES,
          payload: features,
        });
        dispatch({
          type: UPDATE_FEATURES_MAPPINGS,
          payload: feature_mappings,
        });
      }
    } catch (err) {
      return { status: false };
    }
    return response;
  };
};

export const toggleChatPermission = (patientId, data) => {
  return async (dispatch) => {
    let response = {};
    try {
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        data: data,
        url: fetchToggleChatPermissionUrl(patientId),
      });

      const { payload = {}, status = false } = response || {};
      if (!status) {
        const { message = {} } = payload;
        return { status: false, error: message };
      } else {
        const { data: { feature_mappings = {} } = {} } = payload;
        dispatch({
          type: UPDATE_FEATURES_MAPPINGS,
          payload: feature_mappings,
        });
      }
    } catch (err) {
      return { status: false, error: null };
    }
    return response;
  };
};

export const toggleVideoPermission = (patientId, data) => {
  return async (dispatch) => {
    let response = {};
    try {
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        data: data,
        url: fetchToggleVideoCallPermissionUrl(patientId),
      });

      const { payload = {}, status = false } = response || {};
      if (!status) {
        const { message = {} } = payload;
        return { status: false, error: message };
      } else {
        const { data: { feature_mappings = {} } = {} } = payload;
        dispatch({
          type: UPDATE_FEATURES_MAPPINGS,
          payload: feature_mappings,
        });
      }
    } catch (err) {
      return { status: false, error: null };
    }
    return response;
  };
};

export default function (state = initialState, action) {
  const { type, payload = {} } = action;

  switch (type) {
    case UPDATE_FEATURES_MAPPINGS:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
}
