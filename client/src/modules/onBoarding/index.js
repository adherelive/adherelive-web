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

export const DELETE_QUALIFICATION_IMAGE = "DELETE_QUALIFICATION_IMAGE";
export const DELETE_QUALIFICATION_IMAGE_COMPLETED = "DELETE_QUALIFICATION_IMAGE_COMPLETED";
export const DELETE_QUALIFICATION_IMAGE_COMPLETED_WITH_ERROR = "DELETE_QUALIFICATION_IMAGE_COMPLETED_WITH_ERROR";


export const REGISTER_QUALIFICATION = "REGISTER_QUALIFICATION";
export const REGISTER_QUALIFICATION_COMPLETED = "REGISTER_QUALIFICATION_COMPLETED";
export const REGISTER_QUALIFICATION_COMPLETED_WITH_ERROR = "REGISTER_QUALIFICATION_COMPLETED_WITH_ERROR";



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

export const doctorQualificationRegister = (payload,userId) => {
  let response = {};
  console.log("DOCTORRR QUALIFICATION REGISTERR");
  return async (dispatch) => {
    try {
      dispatch({ type: DOCTOR_QUALIFICATION_UPDATE });

      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: Doctor.getdoctorQualificationRegisterUrl(userId),
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

export const doctorClinicRegister = (payload,userId) => {
  let response = {};
  console.log("DOCTORRR ClINIC REGISTERR");
  return async (dispatch) => {
    try {
      dispatch({ type: DOCTOR_CLINIC_UPDATE });

      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: Doctor.getdoctorClinicRegisterUrl(userId),
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

export const getDoctorProfileRegisterData = (userId) => {
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

export const getDoctorQualificationRegisterData = (userId) => {
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

export const registerQualification = (payload, userId) => {
  let response = {};
  console.log("REGISTER QUALIFICATION IMAGE DATA");
  return async (dispatch) => {
    try {
      dispatch({ type: REGISTER_QUALIFICATION });
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: Doctor.getRegisterQualificationUrl(userId),
        data: payload
      });

      console.log("REGISTER QUALIFICATION IMAGE response --> ", response);

      const { status, payload: { error = "", data = {} } = {} } =
        response || {};

      if (status === false) {
        dispatch({
          type: REGISTER_QUALIFICATION_COMPLETED_WITH_ERROR,
          payload: { error },
        });
      } else if (status === true) {
        const { qualification_id } = data;
        dispatch({
          type: REGISTER_QUALIFICATION_COMPLETED,
          payload: {
            qualification_id
          },
        });
      }
    } catch (err) {
      console.log("err REGISTER QUALIFICATION", err);
      throw err;
    }

    return response;
  };
}

export const deleteDoctorQualificationImage = ( qualificationId,document) => {
  let response = {};
  console.log("DELETE QUALIFICATION IMAGE DATA");
  return async (dispatch) => {
    try {
      dispatch({ type: DELETE_QUALIFICATION_IMAGE });

      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: Doctor.getDeleteQualificationDocumentUrl(qualificationId),
        data:{document},
      });

      console.log("DELETE QUALIFICATION IMAGE response --> ", response);

      const { status, payload: { error = "", data = {} } = {} } =
        response || {};

      if (status === false) {
        dispatch({
          type: DELETE_QUALIFICATION_IMAGE_COMPLETED_WITH_ERROR,
          payload: { error },
        });
      } else if (status === true) {

        dispatch({
          type: DELETE_QUALIFICATION_IMAGE_COMPLETED,
          payload: {},
        });
      }
    } catch (err) {
      console.log("err DELETE QUALIFICATION IMAGE", err);
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
        profileData: payload.profileData
      };
    case GET_DOCTOR_QUALIFICATION_DATA_COMPLETED:
      return {
        qualificationData: payload.qualificationData
      };
    default:
      return state;
  }
};