import { doRequest } from "../../Helper/network";
import { FAVOURITE_TYPE, REQUEST_TYPE } from "../../constant";
import {
  markFavouriteUrl,
  getFavouritesUrl,
  removeFavouritesUrl,
  removeFavouriteRecordUrl,
} from "../../Helper/urls/markFavourite";

export const MARK_FAVOURITE = "MARK_FAVOURITE";
export const MARK_FAVOURITE_COMPLETED = "MARK_FAVOURITE_COMPLETED";
export const MARK_FAVOURITE_FAILED = "MARK_FAVOURITE_FAILED";

export const GET_FAVOURITES = "GET_FAVOURITES";
export const GET_FAVOURITES_COMPLETED = "GET_FAVOURITES_COMPLETED";
export const GET_FAVOURITES_FAILED = "GET_FAVOURITES_FAILED";

export const REMOVE_FAVOURITE = "REMOVE_FAVOURITE";
export const REMOVE_FAVOURITE_COMPLETED = "REMOVE_FAVOURITE_COMPLETED";
export const REMOVE_FAVOURITE_FAILED = "REMOVE_FAVOURITE_FAILED";

export const REMOVE_FAVOURITE_RECORD = "REMOVE_FAVOURITE_RECORD";
export const REMOVE_FAVOURITE_RECORD_COMPLETED =
  "REMOVE_FAVOURITE_RECORD_COMPLETED";
export const REMOVE_FAVOURITE_RECORD_FAILED = "REMOVE_FAVOURITE_RECORD_FAILED";

export const markFavourite = (payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: markFavouriteUrl(),
        data: payload,
      });

      const { status, payload: { data: respData, message = "" } = {} } =
        response || {};
      let data = respData;

      if (status === true) {
        const { id } = payload;
        data["id"] = id.toString();
        dispatch({
          type: MARK_FAVOURITE_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: MARK_FAVOURITE_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("MARK_FAVOURITE MODULE catch error -> ", error);
    }
    return response;
  };
};

export const getFavourites = ({ type }) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getFavouritesUrl({ type }),
      });

      const { status, payload: { data, message = "" } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: GET_FAVOURITES_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: GET_FAVOURITES_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("GET_FAVOURITES MODULE catch error -> ", error);
    }
    return response;
  };
};

export const removeFavourite = ({ typeId, type }) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.DELETE,
        url: removeFavouritesUrl({ typeId, type }),
      });

      const { status, payload: { data: resp_data, message = "" } = {} } =
        response || {};
      let data = resp_data;
      if (status === true) {
        const { removed_favourites_data = {} } = data;
        const key = Object.keys(removed_favourites_data)[0];

        data["removed_record_key"] = key;

        if (type === "medicine") {
          data["removed_medicine_id"] = typeId.toString();
        } else if (type === "medical_tests") {
          data["removed_medical_test_id"] = typeId.toString();
        }
        dispatch({
          type: REMOVE_FAVOURITE_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: REMOVE_FAVOURITE_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("REMOVE_FAVOURITE MODULE catch error -> ", error);
    }
    return response;
  };
};

export const removeFavouriteByRecordId = (id) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.DELETE,
        url: removeFavouriteRecordUrl(id),
      });

      const { status, payload: { data: resp_data, message = "" } = {} } =
        response || {};
      let data = resp_data;
      if (status === true) {
        data["removed_record_id"] = id;

        dispatch({
          type: REMOVE_FAVOURITE_RECORD_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: REMOVE_FAVOURITE_RECORD_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("REMOVE_FAVOURITE  RECORDDDD MODULE catch error -> ", error);
    }
    return response;
  };
};

function removeFavouriteReducer(state, data) {
  const { removed_record_key } = data || {};
  if (removed_record_key) {
    const { [removed_record_key.toString()]: record, ...rest } = state || {};

    return {
      ...rest,
    };
  } else {
    return state;
  }
}

function removeFavouriteRecord(state, data) {
  const { removed_record_id } = data || {};
  if (removed_record_id) {
    const { [removed_record_id.toString()]: record, ...rest } = state || {};

    return {
      ...rest,
    };
  } else {
    return state;
  }
}

function getFavouriteReducer(state, data) {
  const { favourites_data = {} } = data || {};
  if (favourites_data) {
    return {
      ...state,
      ...favourites_data,
    };
  } else {
    return state;
  }
}

export default (state = {}, payload) => {
  const { type, data } = payload || {};

  switch (type) {
    case GET_FAVOURITES_COMPLETED:
      return getFavouriteReducer(state, data);
    case REMOVE_FAVOURITE_COMPLETED:
      return removeFavouriteReducer(state, data);
    case REMOVE_FAVOURITE_RECORD_COMPLETED:
      return removeFavouriteRecord(state, data);
    default:
      return getFavouriteReducer(state, data);
  }
};
