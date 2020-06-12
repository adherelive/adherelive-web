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

export const GET_DOCTOR_PROFILE_DATA = "GET_DOCTOR_PROFILE_DATA";
export const GET_DOCTOR_PROFILE_DATA_COMPLETED = "GET_DOCTOR_PROFILE_DATA_COMPLETED";
export const GET_DOCTOR_PROFILE_DATA_COMPLETED_WITH_ERROR = "GET_DOCTOR_PROFILE_DATA_COMPLETED_WITH_ERROR";

export const GET_DOCTOR_QUALIFICATION_DATA = "GET_DOCTOR_QUALIFICATION_DATA";
export const GET_DOCTOR_QUALIFICATION_DATA_COMPLETED = "GET_DOCTOR_QUALIFICATION_DATA_COMPLETED";
export const GET_DOCTOR_QUALIFICATION_DATA_COMPLETED_WITH_ERROR = "GET_DOCTOR_QUALIFICATION_DATA_COMPLETED_WITH_ERROR";

export const UPLOAD_QUALIFICATION_IMAGE = "UPLOAD_QUALIFICATION_IMAGE";
export const UPLOAD_QUALIFICATION_IMAGE_COMPLETED = "GET_DOCTOR_QUALIFICATION_COMPLETED";
export const UPLOAD_QUALIFICATION_IMAGE_COMPLETED_WITH_ERROR = "UPLOAD_QUALIFICATION_IMAGE_COMPLETED_WITH_ERROR";



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
      
          dispatch({
            type: DOCTOR_PROFILE_UPDATE_COMPLETED,
            payload: {
            
            
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
       
          dispatch({
            type: DOCTOR_QUALIFICATION_UPDATE_COMPLETED,
            payload: {
             
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
          
          dispatch({
            type: DOCTOR_CLINIC_UPDATE_COMPLETED,
            payload: {
             
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

  export const getDoctorProfileRegisterData = (userId) =>{
    let response = {};
    console.log("DOCTORRR PROFILE REGISTERR DATA");
    return async (dispatch) => {
      try {
        dispatch({ type: GET_DOCTOR_PROFILE_DATA });
  
        response = await doRequest({
          method: REQUEST_TYPE.GET,
          url: Doctor.getdoctorProfileRegisterDataUrl(userId),
        });
  
        console.log("DOCTORRR PROFILE REGISTERR DATA response --> ", response);
  
        const { status, payload: { error = "", data = {} } = {} } =
          response || {};
  
        if (status === false) {
          dispatch({
            type: GET_DOCTOR_PROFILE_DATA_COMPLETED_WITH_ERROR,
            payload: { error },
          });
        } else if (status === true) {
          const { profileData } = data;
          dispatch({
            type: GET_DOCTOR_PROFILE_DATA_COMPLETED,
            payload: {
              profileData
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

  export const getDoctorQualificationRegisterData = (userId) =>{
    let response = {};
    console.log("DOCTORRR QUALIFICATION REGISTERR DATA");
    return async (dispatch) => {
      try {
        dispatch({ type: GET_DOCTOR_QUALIFICATION_DATA });
  
        response = await doRequest({
          method: REQUEST_TYPE.GET,
          url: Doctor.getdoctorQualificationRegisterDataUrl(userId),
        });
  
        console.log("DOCTORRR QUALIFICATION REGISTERR DATA response --> ", response);
  
        const { status, payload: { error = "", data = {} } = {} } =
          response || {};
  
        if (status === false) {
          dispatch({
            type: GET_DOCTOR_QUALIFICATION_DATA_COMPLETED_WITH_ERROR,
            payload: { error },
          });
        } else if (status === true) {
          const { qualificationData } = data;
          dispatch({
            type: GET_DOCTOR_QUALIFICATION_DATA_COMPLETED,
            payload: {
              qualificationData
            },
          });
        }
      } catch (err) {
        console.log("err get doctor qualification data", err);
        throw err;
      }
  
      return response;
    };
  }

  export const uploadDoctorQualificationImage = (data,userId) =>{
    let response = {};
    console.log("UPLOAD QUALIFICATION IMAGE DATA");
    return async (dispatch) => {
      try {
        dispatch({ type: UPLOAD_QUALIFICATION_IMAGE });
  
        response = await doRequest({
          method: REQUEST_TYPE.GET,
          url: Doctor.getdoctorQualificationRegisterDataUrl(userId),
        });
  
        console.log("UPLOAD QUALIFICATION IMAGE response --> ", response);
  
        const { status, payload: { error = "", data = {} } = {} } =
          response || {};
  
        if (status === false) {
          dispatch({
            type: UPLOAD_QUALIFICATION_IMAGE_COMPLETED_WITH_ERROR,
            payload: { error },
          });
        } else if (status === true) {
          const { qualificationData } = data;
          dispatch({
            type: UPLOAD_QUALIFICATION_IMAGE_COMPLETED,
            payload: {
              qualificationData
            },
          });
        }
      } catch (err) {
        console.log("err UPLOAD QUALIFICATION IMAGE", err);
        throw err;
      }
  
      return response;
    };
  }

  export default (state = {}, action) => {
    const { payload, type } = action;
    switch (type) {
      case GET_DOCTOR_PROFILE_DATA_COMPLETED:
      return {
     profileData:payload.profileData
      };
      case GET_DOCTOR_QUALIFICATION_DATA_COMPLETED:
      return {
        qualificationData:payload.qualificationData
      };
      default:
        return state;
    }
  };