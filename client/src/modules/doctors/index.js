import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import {
  getDoctorDetailsUrl,
  getAllDoctorsUrl,
  getVerifyDoctorUrl,
  updateDoctorURL,
  getDoctorProfileDetailsUrl,
  addPatientToWatchlistUrl,
  removePatientFromWatchlistUrl,
  getAdminPaymentProductUrl,
  getDoctorPaymentProductUrl,
  addDoctorPaymentPoductUrl,
  addRazorpayIdUrl,
  patientWatchlistUrl,
  updatePatientAndCareplanUrl,
  deactivateDoctorURL,
  activateDoctorURL,
  searchDoctorEmailUrl,
  searchDoctorNameUrl,
} from "../../Helper/urls/doctor";

import { getAllDoctorsForProviderUrl } from "../../Helper/urls/provider";
import { accountDetailsUrl } from "../../Helper/urls/accounts";

export const SEARCH_DOCTOR_START = "SEARCH_DOCTOR_START";
export const SEARCH_DOCTOR_COMPLETE = "SEARCH_DOCTOR_COMPLETE";
export const SEARCH_DOCTOR_FAILED = "SEARCH_DOCTOR_FAILED";

export const SEARCH_DOCTOR_NAME_START = "SEARCH_DOCTOR_NAME_START";
export const SEARCH_DOCTOR_NAME_COMPLETE = "SEARCH_DOCTOR_NAME_COMPLETE";
export const SEARCH_DOCTOR_NAME_FAILED = "SEARCH_DOCTOR_NAME_FAILED";

export const GET_DOCTOR_DETAILS_START = "GET_DOCTOR_DETAILS_START";
export const GET_DOCTOR_DETAILS_COMPLETE = "GET_DOCTOR_DETAILS_COMPLETE";
export const GET_DOCTOR_DETAILS_FAILED = "GET_DOCTOR_DETAILS_FAILED";

export const GET_ALL_DOCTORS_START = "GET_ALL_DOCTORS_START";
export const GET_ALL_DOCTORS_COMPLETE = "GET_ALL_DOCTORS_COMPLETE";
export const GET_ALL_DOCTORS_FAILED = "GET_ALL_DOCTORS_FAILED";

export const VERIFY_DOCTOR_START = "VERIFY_DOCTOR_START";
export const VERIFY_DOCTOR_COMPLETE = "VERIFY_DOCTOR_COMPLETE";
export const VERIFY_DOCTOR_FAILED = "VERIFY_DOCTOR_FAILED";

export const UPDATE_DOCTOR_START = "UPDATE_DOCTOR_START";
export const UPDATE_DOCTOR_COMPLETE = "UPDATE_DOCTOR_COMPLETE";
export const UPDATE_DOCTOR_FAILED = "UPDATE_DOCTOR_FAILED";

export const ADD_PATIENT_TO_WATCHLIST = "ADD_PATIENT_TO_WATCHLIST";
export const ADD_PATIENT_TO_WATCHLIST_COMPLETE =
  "ADD_PATIENT_TO_WATCHLIST_COMPLETE";
export const ADD_PATIENT_TO_WATCHLIST_FAILED =
  "ADD_PATIENT_TO_WATCHLIST_FAILED";

export const REMOVE_PATIENT_FROM_WATCHLIST = "REMOVE_PATIENT_FROM_WATCHLIST";
export const REMOVE_PATIENT_FROM_WATCHLIST_COMPLETE =
  "REMOVE_PATIENT_FROM_WATCHLIST_COMPLETE";
export const REMOVE_PATIENT_FROM_WATCHLIST_FAILED =
  "REMOVE_PATIENT_FROM_WATCHLIST_FAILED";

export const GET_ADMIN_PAYMENT_PRODUCT = "GET_ADMIN_PAYMENT_PRODUCT";
export const GET_ADMIN_PAYMENT_PRODUCT_COMPLETE =
  "GET_ADMIN_PAYMENT_PRODUCT_COMPLETE";
export const GET_ADMIN_PAYMENT_PRODUCT_FAILED =
  "GET_ADMIN_PAYMENT_PRODUCT_FAILED";

export const GET_DOCTOR_PAYMENT_PRODUCT = "GET_DOCTOR_PAYMENT_PRODUCT";
export const GET_DOCTOR_PAYMENT_PRODUCT_COMPLETE =
  "GET_DOCTOR_PAYMENT_PRODUCT_COMPLETE";
export const GET_DOCTOR_PAYMENT_PRODUCT_FAILED =
  "GET_DOCTOR_PAYMENT_PRODUCT_FAILED";

export const ADD_DOCTOR_PAYMENT_PRODUCT = "ADD_DOCTOR_PAYMENT_PRODUCT";
export const ADD_DOCTOR_PAYMENT_PRODUCT_COMPLETE =
  "ADD_DOCTOR_PAYMENT_PRODUCT_COMPLETE";
export const ADD_DOCTOR_PAYMENT_PRODUCT_FAILED =
  "ADD_DOCTOR_PAYMENT_PRODUCT_FAILED";

export const DELETE_DOCTOR_PAYMENT_PRODUCT = "DELETE_DOCTOR_PAYMENT_PRODUCT";
export const DELETE_DOCTOR_PAYMENT_PRODUCT_COMPLETE =
  "DELETE_DOCTOR_PAYMENT_PRODUCT_COMPLETE";
export const DELETE_DOCTOR_PAYMENT_PRODUCT_FAILED =
  "DELETE_DOCTOR_PAYMENT_PRODUCT_FAILED";

// export const ADD_ACCOUNT_DETAILS = "ADD_ACCOUNT_DETAILS";
// export const ADD_ACCOUNT_DETAILS_COMPLETE = "ADD_ACCOUNT_DETAILS_COMPLETE";
// export const ADD_ACCOUNT_DETAILS_FAILED = "ADD_ACCOUNT_DETAILS_FAILED";

// export const GET_ACCOUNT_DETAILS = "GET_ACCOUNT_DETAILS";
// export const GET_ACCOUNT_DETAILS_COMPLETE = "GET_ACCOUNT_DETAILS_COMPLETE";
// export const GET_ACCOUNT_DETAILS_FAILED = "GET_ACCOUNT_DETAILS_FAILED";

export const GET_ALL_DOCTORS_FOR_PROVIDER = "GET_ALL_DOCTORS_FOR_PROVIDER";
export const GET_ALL_DOCTORS_FOR_PROVIDER_COMPLETE =
  "GET_ALL_DOCTORS_FOR_PROVIDER_COMPLETE";
export const GET_ALL_DOCTORS_FOR_PROVIDER_FAILED =
  "GET_ALL_DOCTORS_FOR_PROVIDER_FAILED";

export const UPDATE_PATIENT_AND_CAREPLAN = "UPDATE_PATIENT_AND_CAREPLAN";
export const UPDATE_PATIENT_AND_CAREPLAN_COMPLETE =
  "UPDATE_PATIENT_AND_CAREPLAN_COMPLETE";
export const UPDATE_PATIENT_AND_CAREPLAN_FAILED =
  "UPDATE_PATIENT_AND_CAREPLAN_FAILED";

export const ADD_RAZORPAY_ID = "ADD_RAZORPAY_ID";
export const ADD_RAZORPAY_ID_COMPLETE = "ADD_RAZORPAY_ID_COMPLETE";
export const ADD_RAZORPAY_ID_FAILED = "ADD_RAZORPAY_ID_FAILED";

export const DEACTIVATE_DOCTOR_START = "DEACTIVATE_DOCTOR_START";
export const DEACTIVATE_DOCTOR_COMPLETE = "DEACTIVATE_DOCTOR_COMPLETE";
export const DEACTIVATE_DOCTOR_FAILED = "DEACTIVATE_DOCTOR_FAILED";

export const ACTIVATE_DOCTOR_START = "ACTIVATE_DOCTOR_START";
export const ACTIVATE_DOCTOR_COMPLETE = "ACTIVATE_DOCTOR_COMPLETE";
export const ACTIVATE_DOCTOR_FAILED = "ACTIVATE_DOCTOR_FAILED";

export const searchDoctorEmail = (email) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: SEARCH_DOCTOR_START });
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: searchDoctorEmailUrl(email),
      });

      const { status, payload: { data, error } = {} } = response || {};

      if (status === true) {
        dispatch({
          type: SEARCH_DOCTOR_COMPLETE,
          data: data,
          payload: data,
        });
      } else {
        dispatch({
          type: SEARCH_DOCTOR_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("SEARCH_DOCTOR ERROR --> ", error);
    }
    return response;
  };
};

export const searchDoctorName = (name) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: SEARCH_DOCTOR_NAME_START });
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: searchDoctorNameUrl(name),
      });

      const { status, payload: { data, error } = {} } = response || {};

      if (status === true) {
        dispatch({
          type: SEARCH_DOCTOR_NAME_COMPLETE,
          data: data,
          payload: data,
        });
      } else {
        dispatch({
          type: SEARCH_DOCTOR_NAME_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("SEARCH_DOCTOR_NAME ERROR --> ", error);
    }
    return response;
  };
};

export const updateDoctor = (user_id, updateData) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: UPDATE_DOCTOR_START });
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: updateDoctorURL(user_id),
        data: updateData,
      });

      const { status, payload: { data, error } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: UPDATE_DOCTOR_COMPLETE,
          data: data,
          payload: data,
        });
      } else {
        dispatch({
          type: UPDATE_DOCTOR_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("UPDATE DOCTOR ERROR --> ", error);
    }
    return response;
  };
};

export const updatePatientAndCareplan = (careplan_id, payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: UPDATE_PATIENT_AND_CAREPLAN });
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: updatePatientAndCareplanUrl(careplan_id),
        data: payload,
      });

      const { status, payload: { data, error } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: UPDATE_PATIENT_AND_CAREPLAN_COMPLETE,
          data: data,
          payload: data,
        });
      } else {
        dispatch({
          type: UPDATE_PATIENT_AND_CAREPLAN_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("UPDATE_PATIENT_AND_CAREPLAN ERROR --> ", error);
    }
    return response;
  };
};

export const getAdminPaymentProduct = () => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_ADMIN_PAYMENT_PRODUCT });
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getAdminPaymentProductUrl(),
      });

      const { status, payload: { data, error } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: GET_ADMIN_PAYMENT_PRODUCT_COMPLETE,
          data: data,
          payload: data,
        });
      } else {
        dispatch({
          type: GET_ADMIN_PAYMENT_PRODUCT_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("GET_ADMIN_PAYMENT_PRODUCT ERROR --> ", error);
    }
    return response;
  };
};

export const getAllDoctorsForProvider = () => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_ALL_DOCTORS_FOR_PROVIDER });
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getAllDoctorsForProviderUrl(),
      });

      const { status, payload: { data, error } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: GET_ALL_DOCTORS_FOR_PROVIDER_COMPLETE,
          data: data,
          payload: data,
        });
      } else {
        dispatch({
          type: GET_ALL_DOCTORS_FOR_PROVIDER_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("GET_ALL_DOCTORS_FOR_PROVIDER ERROR --> ", error);
    }
    return response;
  };
};

export const getDoctorPaymentProduct = (params = null) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_DOCTOR_PAYMENT_PRODUCT });
      if (params) {
        response = await doRequest({
          method: REQUEST_TYPE.GET,
          url: getDoctorPaymentProductUrl(),
          params,
        });
      } else {
        response = await doRequest({
          method: REQUEST_TYPE.GET,
          url: getDoctorPaymentProductUrl(),
        });
      }

      const { status, payload: { data, error } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: GET_DOCTOR_PAYMENT_PRODUCT_COMPLETE,
          data: data,
          payload: data,
        });
      } else {
        dispatch({
          type: GET_DOCTOR_PAYMENT_PRODUCT_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("GET_DOCTOR_PAYMENT_PRODUCT ERROR --> ", error);
    }
    return response;
  };
};

export const addDoctorPaymentProduct = (payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: ADD_DOCTOR_PAYMENT_PRODUCT });
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: addDoctorPaymentPoductUrl(),
        data: payload,
      });

      const { status, payload: { data, error } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: ADD_DOCTOR_PAYMENT_PRODUCT_COMPLETE,
          data: data,
          payload: data,
        });
      } else {
        dispatch({
          type: ADD_DOCTOR_PAYMENT_PRODUCT_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("GET_DOCTOR_PAYMENT_PRODUCT ERROR --> ", error);
    }
    return response;
  };
};

export const deleteDoctorPaymentProduct = (payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: DELETE_DOCTOR_PAYMENT_PRODUCT });
      response = await doRequest({
        method: REQUEST_TYPE.DELETE,
        url: addDoctorPaymentPoductUrl(),
        data: payload,
      });

      const { status, payload: { data, error } = {} } = response || {};
      const { id = null } = payload;
      if (status === true) {
        if (id) {
          data["id"] = id;
        }
        dispatch({
          type: DELETE_DOCTOR_PAYMENT_PRODUCT_COMPLETE,
          data: data,
          payload: data,
        });
      } else {
        dispatch({
          type: DELETE_DOCTOR_PAYMENT_PRODUCT_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("DELETE_DOCTOR_PAYMENT_PRODUCT ERROR --> ", error);
    }
    return response;
  };
};

export const addToWatchlist = (patient_id) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: ADD_PATIENT_TO_WATCHLIST });

      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: patientWatchlistUrl(patient_id),
      });

      const { status, payload: { error = "", data = {} } = {} } =
        response || {};

      if (status === false) {
        dispatch({
          type: ADD_PATIENT_TO_WATCHLIST_FAILED,
          payload: { error },
        });
      } else if (status === true) {
        dispatch({
          type: ADD_PATIENT_TO_WATCHLIST_COMPLETE,
          data: data,
        });
      }
    } catch (error) {
      console.log("error search patient", error);
      throw error;
    }

    return response;
  };
};

export const removePatientFromWatchlist = (patient_id) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: REMOVE_PATIENT_FROM_WATCHLIST });

      response = await doRequest({
        method: REQUEST_TYPE.DELETE,
        url: patientWatchlistUrl(patient_id),
      });

      const { status, payload: { error = "", data = {} } = {} } =
        response || {};

      if (status === false) {
        dispatch({
          type: REMOVE_PATIENT_FROM_WATCHLIST_FAILED,
          payload: { error },
        });
      } else if (status === true) {
        dispatch({
          type: REMOVE_PATIENT_FROM_WATCHLIST_COMPLETE,
          data: data,
        });
      }
    } catch (error) {
      console.log("error search patient", error);
      throw error;
    }

    return response;
  };
};

export const verifyDoctor = (id) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: VERIFY_DOCTOR_START });
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: getVerifyDoctorUrl(id),
      });

      const { status, payload: { data, error } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: VERIFY_DOCTOR_COMPLETE,
          data: data,
          payload: data,
        });
      } else {
        dispatch({
          type: VERIFY_DOCTOR_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("GET ALL DOCTORS ERROR --> ", error);
    }
    return response;
  };
};

export const getAllDoctors = () => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_ALL_DOCTORS_START });
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getAllDoctorsUrl(),
      });

      const { status, payload: { data, error } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: GET_ALL_DOCTORS_COMPLETE,
          data: data,
          payload: data,
        });
      } else {
        dispatch({
          type: GET_ALL_DOCTORS_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("GET ALL DOCTORS ERROR --> ", error);
    }
    return response;
  };
};

export const getDoctorDetails = (id) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_DOCTOR_DETAILS_START });
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getDoctorDetailsUrl(id),
      });
      const { status, payload: { data, error } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: GET_DOCTOR_DETAILS_COMPLETE,
          data: data,
          payload: data,
        });
      } else {
        dispatch({
          type: GET_DOCTOR_DETAILS_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("GET DOCTOR DETAILS ERROR --> ", error);
    }
    return response;
  };
};

export const getDoctorProfileDetails = (id = null) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_DOCTOR_DETAILS_START });
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getDoctorProfileDetailsUrl(id),
      });
      const { status, payload: { data, error } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: GET_DOCTOR_DETAILS_COMPLETE,
          data: data,
          payload: data,
        });
      } else {
        dispatch({
          type: GET_DOCTOR_DETAILS_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("GET DOCTOR DETAILS ERROR --> ", error);
    }
    return response;
  };
};

// export const addAccountDetails = (payload) => {
//     let response = {};
//     return async dispatch => {
//       try {
//         dispatch({ type: ADD_ACCOUNT_DETAILS });
//         response = await doRequest({
//           method: REQUEST_TYPE.POST,
//           url: accountDetailsUrl(),
//           data: payload
//         });

//         const { status, payload: { data, error } = {} } = response || {};
//         if (status === true) {
//           dispatch({
//             type: ADD_ACCOUNT_DETAILS_COMPLETE,
//             data: data,
//             payload: data
//           });
//         } else {
//           dispatch({
//             type: ADD_ACCOUNT_DETAILS_FAILED,
//             error,
//           });
//         }
//       } catch (error) {
//         console.log("ADD_ACCOUNT_DETAILS ERROR --> ", error);
//       }
//       return response;
//     }

// }

export const addRazorpayId = (id, payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: ADD_RAZORPAY_ID });
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: addRazorpayIdUrl(id),
        data: payload,
      });
      const { status, payload: { data, error } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: ADD_RAZORPAY_ID_COMPLETE,
          data: data,
          payload: data,
        });
      } else {
        dispatch({
          type: ADD_RAZORPAY_ID_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("ADD_RAZORPAY_ID ERROR --> ", error);
    }
    return response;
  };
};

export const deactivateDoctor = (doctor_id) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: DEACTIVATE_DOCTOR_START });
      response = await doRequest({
        method: REQUEST_TYPE.DELETE,
        url: deactivateDoctorURL(doctor_id),
      });
      const { status, payload: { data, error } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: DEACTIVATE_DOCTOR_COMPLETE,
          data: data,
          payload: data,
        });
      } else {
        dispatch({
          type: DEACTIVATE_DOCTOR_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("DEACTIVATE_DOCTOR ERROR --> ", error);
    }
    return response;
  };
};

export const activateDoctor = (user_id) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: ACTIVATE_DOCTOR_START });
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: activateDoctorURL(user_id),
      });
      const { status, payload: { data, error } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: ACTIVATE_DOCTOR_COMPLETE,
          data: data,
          payload: data,
        });
      } else {
        dispatch({
          type: ACTIVATE_DOCTOR_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("ACTIVATE_DOCTOR ERROR --> ", error);
    }
    return response;
  };
};

// export const getAccountDetails = () => {
//   let response = {};
//   return async dispatch => {
//     try {
//       dispatch({ type: GET_ACCOUNT_DETAILS });
//       response = await doRequest({
//         method: REQUEST_TYPE.GET,
//         url: accountDetailsUrl(),
//       });

//       const { status, payload: { data, error } = {} } = response || {};
//       if (status === true) {
//         dispatch({
//           type: GET_ACCOUNT_DETAILS_COMPLETE,
//           data: data,
//           payload: data
//         });
//       } else {
//         dispatch({
//           type: GET_ACCOUNT_DETAILS_FAILED,
//           error,
//         });
//       }
//     } catch (error) {
//       console.log("GET_ACCOUNT_DETAILS ERROR --> ", error);
//     }
//     return response;
//   }

// }

function doctorReducer(state, data) {
  const { doctors } = data || {};
  if (doctors) {
    return {
      ...state,
      ...doctors,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return doctorReducer(state, data);
  }
};
