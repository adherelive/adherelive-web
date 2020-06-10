import { REQUEST_TYPE } from "../../constant";
import { doRequest } from "../../Helper/network";
import { Doctor } from "../../Helper/urls";


export const DOCTOR_PROFILE_UPDATE = "DOCTOR_PROFILE_UPDATE";
export const DOCTOR_PROFILE_UPDATE_COMPLETED = "DOCTOR_PROFILE_UPDATE_COMPLETED";
export const DOCTOR_PROFILE_UPDATE_COMPLETED_WITH_ERROR = "DOCTOR_PROFILE_UPDATE_COMPLETED_WITH_ERROR";

export const DOCTOR_QUALIFICATION_UPDATE = "DOCTOR_QUALIFICATION_UPDATE";
export const DOCTOR_QUALIFICATION_UPDATE_COMPLETED = "DOCTOR_QUALIFICATION_UPDATE_COMPLETED";
export const DOCTOR_QUALIFICATION_UPDATE_COMPLETED_WITH_ERROR = "DOCTOR_QUALIFICATION_UPDATE_COMPLETED_WITH_ERROR";

export const DOCTOR_CLINIC_UPDATE = "DOCTOR_CLINIC_UPDATE";
export const DOCTOR_CLINIC_UPDATE_COMPLETED = "DOCTOR_CLINIC_UPDATE_COMPLETED";
export const DOCTOR_CLINIC_UPDATE_COMPLETED_WITH_ERROR = "DOCTOR_CLINIC_UPDATE_COMPLETED_WITH_ERROR";

export const doctorProfileRegister = (payload) => {
    let response = {};
    console.log("DOCTORRR PROFILE REGISTERR");
    return async (dispatch) => {
      try {
        dispatch({ type: DOCTOR_PROFILE_UPDATE });
  
        response = await doRequest({
          method: REQUEST_TYPE.POST,
          url: Doctor.getdoctorProfileRegisterUrl(),
          data: payload,
        });
  
        console.log("SIGN IN response --> ", response);
  
        const { status, payload: { error = "", data = {} } = {} } =
          response || {};
  
        if (status === false) {
          dispatch({
            type: DOCTOR_PROFILE_UPDATE_COMPLETED_WITH_ERROR,
            payload: { error },
          });
        } else if (status === true) {
          const { _id, users } = data;
          let authRedirection = "/";
          dispatch({
            type: DOCTOR_PROFILE_UPDATE_COMPLETED,
            payload: {
              authenticatedUser: _id,
              authRedirection,
            },
          });
        }
      } catch (err) {
        console.log("err signin", err);
        throw err;
      }
  
      return response;
    };
  };

export const doctorQualificationRegister = (payload) => {
    let response = {};
    console.log("DOCTORRR QUALIFICATION REGISTERR");
    return async (dispatch) => {
      try {
        dispatch({ type: DOCTOR_QUALIFICATION_UPDATE });
  
        response = await doRequest({
          method: REQUEST_TYPE.POST,
          url: Doctor.getdoctorQualificationRegisterUrl(),
          data: payload,
        });
  
        console.log("Doctor qualification response --> ", response);
  
        const { status, payload: { error = "", data = {} } = {} } =
          response || {};
  
        if (status === false) {
          dispatch({
            type: DOCTOR_QUALIFICATION_UPDATE_COMPLETED_WITH_ERROR,
            payload: { error },
          });
        } else if (status === true) {
          const { _id, users } = data;
          let authRedirection = "/";
          dispatch({
            type: DOCTOR_QUALIFICATION_UPDATE_COMPLETED,
            payload: {
              authenticatedUser: _id,
              authRedirection,
            },
          });
        }
      } catch (err) {
        console.log("err signin", err);
        throw err;
      }
  
      return response;
    };
  };

  export const doctorClinicRegister = (payload) => {
    let response = {};
    console.log("DOCTORRR ClINIC REGISTERR");
    return async (dispatch) => {
      try {
        dispatch({ type: DOCTOR_CLINIC_UPDATE });
  
        response = await doRequest({
          method: REQUEST_TYPE.POST,
          url: Doctor.getdoctorClinicRegisterUrl(),
          data: payload,
        });
  
        console.log("Doctor clinic response --> ", response);
  
        const { status, payload: { error = "", data = {} } = {} } =
          response || {};
  
        if (status === false) {
          dispatch({
            type: DOCTOR_CLINIC_UPDATE_COMPLETED_WITH_ERROR,
            payload: { error },
          });
        } else if (status === true) {
          const { _id, users } = data;
          let authRedirection = "/";
          dispatch({
            type: DOCTOR_CLINIC_UPDATE_COMPLETED,
            payload: {
              authenticatedUser: _id,
              authRedirection,
            },
          });
        }
      } catch (err) {
        console.log("err signin", err);
        throw err;
      }
  
      return response;
    };
  };

  export default (state = {}, action) => {
    const { data, type } = action;
    switch (type) {
      default:
        return state;
    }
  };