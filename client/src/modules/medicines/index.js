import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import {
  searchMedicines,
  addMedicineUrl,
  addAdminMedicineUrl,
  getPublicMedicinesUrl,
  getPrivateMedicinesUrl,
  makeMedicinePublicUrl,
  deleteMedicineUrl,
} from "../../Helper/urls/medicines";

export const SEARCH_MEDICINE_START = "SEARCH_MEDICINE_START";
export const SEARCH_MEDICINE_COMPLETED = "SEARCH_MEDICINE_COMPLETED";
export const SEARCH_MEDICINE_FAILED = "SEARCH_MEDICINE_FAILED";

export const ADD_MEDICINE_START = "ADD_MEDICINE_START";
export const ADD_MEDICINE_COMPLETED = "ADD_MEDICINE_COMPLETED";
export const ADD_MEDICINE_FAILED = "ADD_MEDICINE_FAILED";

export const ADD_ADMIN_MEDICINE_START = "ADD_ADMIN_MEDICINE_START";
export const ADD_ADMIN_MEDICINE_COMPLETED = "ADD_ADMIN_MEDICINE_COMPLETED";
export const ADD_ADMIN_MEDICINE_FAILED = "ADD_ADMIN_MEDICINE_FAILED";

export const GET_PUBLIC_MEDICINES = "GET_PUBLIC_MEDICINES";
export const GET_PUBLIC_MEDICINES_COMPLETED = "GET_PUBLIC_MEDICINES_COMPLETED";
export const GET_PUBLIC_MEDICINES_FAILED = "GET_PUBLIC_MEDICINES_FAILED";

export const GET_PRIVATE_MEDICINES = "GET_PRIVATE_MEDICINES";
export const GET_PRIVATE_MEDICINES_COMPLETED =
  "GET_PRIVATE_MEDICINES_COMPLETED";
export const GET_PRIVATE_MEDICINES_FAILED = "GET_PRIVATE_MEDICINES_FAILED";

export const MAKE_MEDICINE_PUBLIC = "MAKE_MEDICINE_PUBLIC";
export const MAKE_MEDICINE_PUBLIC_COMPLETED = "MAKE_MEDICINE_PUBLIC_COMPLETED";
export const MAKE_MEDICINE_PUBLIC_FAILED = "MAKE_MEDICINE_PUBLIC_FAILED";

export const DELETE_MEDICINE = "DELETE_MEDICINE";
export const DELETE_MEDICINE_COMPLETED = "DELETE_MEDICINE_COMPLETED";
export const DELETE_MEDICINE_FAILED = "DELETE_MEDICINE_FAILED";

const PRIVATE = "private";
const PUBLIC = "public";

export const RESET_SEARCH_PUBLIC = "RESET_SEARCH_PUBLIC";
export const RESET_SEARCH_PRIVATE = "RESET_SEARCH_PRIVATE";

export const MAP_MEDICINE_TO_PUBLIC = "MAP_MEDICINE_TO_PUBLIC";

export const searchMedicine = (value) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: searchMedicines(value),
      });

      const { status, payload: { data, message = "" } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: SEARCH_MEDICINE_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: SEARCH_MEDICINE_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("SEARCH MEDICINE MODULE catch error -> ", error);
    }
    return response;
  };
};

export const addMedicine = (payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: addMedicineUrl(),
        data: payload,
      });

      const { status, payload: { data, message = "" } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: ADD_MEDICINE_COMPLETED,
          data,
          payload: data,
        });
      } else {
        dispatch({
          type: ADD_MEDICINE_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("ADD MEDICINE MODULE catch error -> ", error);
    }
    return response;
  };
};

export const addAdminMedicine = (payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: ADD_ADMIN_MEDICINE_START });
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: addAdminMedicineUrl(),
        data: payload,
      });

      const { status, payload: { data, message = "" } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: ADD_ADMIN_MEDICINE_COMPLETED,
          data,
          payload: data,
        });
      } else {
        dispatch({
          type: ADD_ADMIN_MEDICINE_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("ADD ADMIN MEDICINE MODULE ERROR ", error);
    }
    return response;
  };
};

export const getPublicMedicines = ({ value, offset = 0 }) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_PUBLIC_MEDICINES });
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getPublicMedicinesUrl({ value, offset }),
      });

      const { status, payload: { data, message = "" } = {} } = response || {};

      if (status === true) {
        data["offset"] = offset;
        data["type"] = PUBLIC;

        if (value && value !== "") {
          data["searchText"] = value;
        }
        dispatch({
          type: GET_PUBLIC_MEDICINES_COMPLETED,
          data,
          payload: data,
        });
      } else {
        dispatch({
          type: GET_PUBLIC_MEDICINES_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("GET PUBLIC MEDICINES MODULE ERROR ", error);
    }
    return response;
  };
};

export const mapMedicineToPublic = (medicine) => {
  return async (dispatch) => {
    try {
      let data = {};
      data["medicine"] = medicine;
      dispatch({
        type: MAP_MEDICINE_TO_PUBLIC,
        data,
        payload: data,
      });
    } catch (error) {
      console.log("MAP_MEDICINE_TO_PUBLIC MODULE ERROR ", error);
    }
  };
};

export const deleteMedicine = ({ medicine_id, offset }) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: DELETE_MEDICINE });
      response = await doRequest({
        method: REQUEST_TYPE.DELETE,
        url: deleteMedicineUrl(medicine_id),
      });

      const { status, payload: { data, message = "" } = {} } = response || {};

      if (status === true) {
        if (medicine_id) {
          data["medicine_id"] = medicine_id;
          data["offset"] = offset;
        }

        dispatch({
          type: "DELETE_MEDICINE_COMPLETED",
          data,
          payload: data,
        });
      } else {
        dispatch({
          type: DELETE_MEDICINE_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("DELETE_MEDICINE MODULE ERROR ", error);
    }
    return response;
  };
};

export const getPrivateMedicines = ({ value, offset = 0 }) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_PRIVATE_MEDICINES });
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getPrivateMedicinesUrl({ value, offset }),
      });

      const { status, payload: { data, message = "" } = {} } = response || {};

      if (status === true) {
        data["offset"] = offset;
        data["type"] = PRIVATE;

        if (value && value !== "") {
          data["searchText"] = value;
        }
        dispatch({
          type: GET_PRIVATE_MEDICINES_COMPLETED,
          data,
          payload: data,
        });
      } else {
        dispatch({
          type: GET_PRIVATE_MEDICINES_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("GET PRIVATE MEDICINES MODULE ERROR ", error);
    }
    return response;
  };
};

export const resetSearchPublic = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: RESET_SEARCH_PUBLIC });
    } catch (error) {
      console.log("RESET_SEARCH_PUBLIC MODULE ERROR ", error);
    }
  };
};

export const resetSearchPrivate = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: RESET_SEARCH_PRIVATE });
    } catch (error) {
      console.log("RESET_SEARCH_PRIVATE MODULE ERROR ", error);
    }
  };
};

export const makeMedicinePublic = ({ medicine_id, offset }) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: MAKE_MEDICINE_PUBLIC });
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: makeMedicinePublicUrl(medicine_id),
      });

      const { status, payload: { data, message = "" } = {} } = response || {};

      if (status === true) {
        data["offset"] = offset;
        dispatch({
          type: MAKE_MEDICINE_PUBLIC_COMPLETED,
          data,
          payload: data,
        });
      } else {
        dispatch({
          type: MAKE_MEDICINE_PUBLIC_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("MAKE_MEDICINE_PUBLIC  MODULE ERROR ", error);
    }
    return response;
  };
};

function medicineReducer(state, data) {
  const { medicines = {} } = data || {};
  if (medicines) {
    return {
      ...state,
      ...medicines,
    };
  } else {
    return state;
  }
}

export default (state = {}, payload) => {
  const { type, data } = payload || {};
  switch (type) {
    case SEARCH_MEDICINE_COMPLETED:
      return medicineReducer(state, data);
    default:
      return medicineReducer(state, data);
  }
};
