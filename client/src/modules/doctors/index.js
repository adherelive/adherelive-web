import { DOCTOR_INITIAL_STATE } from "../../data";
import * as Doctor  from "../../Helper/urls/doctor";
import {
  REQUEST_TYPE,
  USER_CATEGORY,
  PATH,
  ONBOARDING_STATUS,
} from "../../constant";
import { doRequest } from "../../Helper/network";
import { Auth } from "../../Helper/urls";

export const ADD_PATIENT = "ADD_PATIENT";
export const ADD_PATIENT_COMPLETED = "ADD_PATIENT_COMPLETED";
export const ADD_PATIENT_COMPLETED_WITH_ERROR =
  "ADD_PATIENT_COMPLETED_WITH_ERROR";


  export const GET_PATIENT_CARE_PLAN_DETAILS = "GET_PATIENT_CARE_PLAN_DETAILS";
export const GET_PATIENT_CARE_PLAN_DETAILS_COMPLETED = "GET_PATIENT_CARE_PLAN_DETAILS_COMPLETED";
export const GET_PATIENT_CARE_PLAN_DETAILS_COMPLETED_WITH_ERROR =
  "GET_PATIENT_CARE_PLAN_DETAILS_COMPLETED_WITH_ERROR";

export const addPatient =(payload,id)=>{
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: ADD_PATIENT });

      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: Doctor.getAddPatientUrl(id),
        data:payload
      });

      console.log("ADD PATIENT response --> ", response);

      const { status, payload: { error = "", data = {} } = {} } =
        response || {};

      if (status === false) {
        dispatch({
          type: ADD_PATIENT_COMPLETED_WITH_ERROR,
          payload: { error },
        });
      } else if (status === true) {
        const { users = {} } = data;
        // let authUser = Object.values(users).length ? Object.values(users)[0] : {};
        // let authRedirection = setAuthRedirect(users);
        // console.log(
        //   " ID IN 898978 SIGNUPPPP",
        //   authRedirection,
        //   authUser,
        //   response.payload.data.user
        // );
        dispatch({
          type:ADD_PATIENT_COMPLETED,
          payload: {
            // authenticatedUser: authUser,
            // authRedirection,
          },
        });
      }
    } catch (err) {
      console.log("err signin", err);
      throw err;
    }

    return response;
  };
}

export const getPatientCarePlanDetails =(patientId)=>{
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_PATIENT_CARE_PLAN_DETAILS });

      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: Doctor.getPatientCarePlanDetailsUrl(patientId)
      });

      console.log("ADD PATIENT response --> ", response);

      const { status, payload: { error = "", data = {} } = {} } =
        response || {};

      if (status === false) {
        dispatch({
          type: GET_PATIENT_CARE_PLAN_DETAILS_COMPLETED_WITH_ERROR,
          payload: { error },
        });
      } else if (status === true) {
        const { users = {} } = data;
      
        dispatch({
          type:GET_PATIENT_CARE_PLAN_DETAILS_COMPLETED,
          payload: { },
        });
      }
    } catch (err) {
      console.log("err get patient careplan details", err);
      throw err;
    }

    return response;
  };
}


function doctorReducer(state, data) {
  const { doctors } = data || {};
  if (doctors) {
    return {
      ...state,
      // ...DOCTOR_INITIAL_STATE,
      ...doctors,
    };
  } else {
    return {
      ...state,
      // ...DOCTOR_INITIAL_STATE,
    };
  }
}



export default (state = DOCTOR_INITIAL_STATE, action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return doctorReducer(state, data);
  }
};
