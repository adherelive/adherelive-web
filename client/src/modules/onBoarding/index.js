import { REQUEST_TYPE } from "../../constant";
import { doRequest } from "../../Helper/network";
import { Doctor } from "../../Helper/urls";

import { sendPasswordMailUrl } from "../../Helper/urls/provider";

export const SEND_PASSWORD_MAIL = "SEND_PASSWORD_MAIL";
export const SEND_PASSWORD_MAIL_COMPLETED = "SEND_PASSWORD_MAIL_COMPLETED";
export const SEND_PASSWORD_MAIL_COMPLETED_WITH_ERROR =
  "SEND_PASSWORD_MAIL_COMPLETED_WITH_ERROR";

export const DOCTOR_PROFILE_UPDATE = "DOCTOR_PROFILE_UPDATE";
export const DOCTOR_PROFILE_UPDATE_COMPLETED =
  "DOCTOR_PROFILE_UPDATE_COMPLETED";
export const DOCTOR_PROFILE_UPDATE_COMPLETED_WITH_ERROR =
  "DOCTOR_PROFILE_UPDATE_COMPLETED_WITH_ERROR";

export const DOCTOR_QUALIFICATION_UPDATE = "DOCTOR_QUALIFICATION_UPDATE";
export const DOCTOR_QUALIFICATION_UPDATE_COMPLETED =
  "DOCTOR_QUALIFICATION_UPDATE_COMPLETED";
export const DOCTOR_QUALIFICATION_UPDATE_COMPLETED_WITH_ERROR =
  "DOCTOR_QUALIFICATION_UPDATE_COMPLETED_WITH_ERROR";

export const DOCTOR_CLINIC_UPDATE = "DOCTOR_CLINIC_UPDATE";
export const DOCTOR_CLINIC_UPDATE_COMPLETED = "DOCTOR_CLINIC_UPDATE_COMPLETED";
export const DOCTOR_CLINIC_UPDATE_COMPLETED_WITH_ERROR =
  "DOCTOR_CLINIC_UPDATE_COMPLETED_WITH_ERROR";

export const GET_DOCTOR_PROFILE_DATA = "GET_DOCTOR_PROFILE_DATA";
export const GET_DOCTOR_PROFILE_DATA_COMPLETED =
  "GET_DOCTOR_PROFILE_DATA_COMPLETED";
export const GET_DOCTOR_PROFILE_DATA_COMPLETED_WITH_ERROR =
  "GET_DOCTOR_PROFILE_DATA_COMPLETED_WITH_ERROR";

export const GET_DOCTOR_QUALIFICATION_DATA = "GET_DOCTOR_QUALIFICATION_DATA";
export const GET_DOCTOR_QUALIFICATION_DATA_COMPLETED =
  "GET_DOCTOR_QUALIFICATION_DATA_COMPLETED";
export const GET_DOCTOR_QUALIFICATION_DATA_COMPLETED_WITH_ERROR =
  "GET_DOCTOR_QUALIFICATION_DATA_COMPLETED_WITH_ERROR";

export const DELETE_QUALIFICATION_IMAGE = "DELETE_QUALIFICATION_IMAGE";
export const DELETE_QUALIFICATION_IMAGE_COMPLETED =
  "DELETE_QUALIFICATION_IMAGE_COMPLETED";
export const DELETE_QUALIFICATION_IMAGE_COMPLETED_WITH_ERROR =
  "DELETE_QUALIFICATION_IMAGE_COMPLETED_WITH_ERROR";

export const DELETE_REGISTRATION_IMAGE = "DELETE_REGISTRATION_IMAGE";
export const DELETE_REGISTRATION_IMAGE_COMPLETED =
  "DELETE_REGISTRATION_IMAGE_COMPLETED";
export const DELETE_REGISTRATION_IMAGE_COMPLETED_WITH_ERROR =
  "DELETE_REGISTRATION_IMAGE_COMPLETED_WITH_ERROR";

export const REGISTER_QUALIFICATION = "REGISTER_QUALIFICATION";
export const REGISTER_QUALIFICATION_COMPLETED =
  "REGISTER_QUALIFICATION_COMPLETED";
export const REGISTER_QUALIFICATION_COMPLETED_WITH_ERROR =
  "REGISTER_QUALIFICATION_COMPLETED_WITH_ERROR";

export const REGISTER_REGISTRATION = "REGISTER_REGISTRATION";
export const REGISTER_REGISTRATION_COMPLETED =
  "REGISTER_REGISTRATION_COMPLETED";
export const REGISTER_REGISTRATION_COMPLETED_WITH_ERROR =
  "REGISTER_REGISTRATION_COMPLETED_WITH_ERROR";

export const NEW_DOCTOR = "NEW_DOCTOR";

export const callNewDoctorAction = (doctor_id) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: NEW_DOCTOR,
        data: { doctor_id },
      });
    } catch (err) {
      console.log("New Doctor Error", err);
      throw err;
    }
  };
};

export const doctorProfileRegister = (payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: DOCTOR_PROFILE_UPDATE });
      console.log(payload);
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: Doctor.getdoctorProfileRegisterUrl(),
        data: payload,
      });

      const { status, payload: { error = "", data = {} } = {} } =
        response || {};

      const { doctors = {} } = data;

      if (status === false) {
        dispatch({
          type: DOCTOR_PROFILE_UPDATE_COMPLETED_WITH_ERROR,
          payload: { error },
        });
      } else if (status === true) {
        const { doctors = {} } = data || {};

        dispatch({
          type: DOCTOR_PROFILE_UPDATE_COMPLETED,
          data: data,
        });

        if (Object.keys(doctors).length > 0) {
          const doctor_id = Object.keys(doctors)[0];
          callNewDoctorAction(doctor_id);
        }
      }
    } catch (err) {
      console.log("err signin", err);
      throw err;
    }

    return response;
  };
};

export const sendPasswordMail = (payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: SEND_PASSWORD_MAIL });

      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: sendPasswordMailUrl(),
        data: payload,
      });

      const { status, payload: { error = "", data = {} } = {} } =
        response || {};

      if (status === true) {
        dispatch({
          type: SEND_PASSWORD_MAIL_COMPLETED,
          payload: data,
          data,
        });
      } else {
        dispatch({
          type: SEND_PASSWORD_MAIL_COMPLETED_WITH_ERROR,
          payload: error,
        });
      }
    } catch (err) {
      console.log("err password mail", err);
      throw err;
    }

    return response;
  };
};

export const doctorQualificationRegister = (payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: DOCTOR_QUALIFICATION_UPDATE });

      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: Doctor.getdoctorQualificationRegisterUrl(),
        data: payload,
      });

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
          data: data,
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
  return async (dispatch) => {
    try {
      dispatch({ type: DOCTOR_CLINIC_UPDATE });

      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: Doctor.getdoctorClinicRegisterUrl(),
        data: payload,
      });

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
          // payload: {

          // },
          data: data,
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
  return async (dispatch) => {
    try {
      dispatch({ type: GET_DOCTOR_PROFILE_DATA });

      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: Doctor.getdoctorProfileRegisterDataUrl(userId),
      });

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
            profileData,
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

export const getDoctorQualificationRegisterData = (payload) => {
  let response = {};
  const { doctor_id = "" } = payload || {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_DOCTOR_QUALIFICATION_DATA });

      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: Doctor.getdoctorQualificationRegisterDataUrl(doctor_id),
        // data: payload
      });

      const { status, payload: { error = "", data = {} } = {} } =
        response || {};

      console.log("01831283908 response ---> ", { payload, response });

      if (status === false) {
        dispatch({
          type: GET_DOCTOR_QUALIFICATION_DATA_COMPLETED_WITH_ERROR,
          payload: { error },
        });
      } else if (status === true) {
        // const { qualificationData, registration_details, upload_documents } = data;
        dispatch({
          type: GET_DOCTOR_QUALIFICATION_DATA_COMPLETED,
          data: data,
        });
      }
    } catch (err) {
      console.log("err get doctor qualification data", err);
      throw err;
    }

    return response;
  };
};

export const registerQualification = (payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: REGISTER_QUALIFICATION });
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: Doctor.getRegisterQualificationUrl(),
        data: payload,
      });

      const { status, payload: { error = "", data = {} } = {} } =
        response || {};

      if (status === false) {
        dispatch({
          type: REGISTER_QUALIFICATION_COMPLETED_WITH_ERROR,
          payload: { error },
        });
      } else if (status === true) {
        // const { qualification_id } = data;
        dispatch({
          type: REGISTER_QUALIFICATION_COMPLETED,
          data: data,
        });
      }
    } catch (err) {
      console.log("err REGISTER QUALIFICATION", err);
      throw err;
    }

    return response;
  };
};

export const registerRegistration = (payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: REGISTER_REGISTRATION });
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: Doctor.getRegisterRegistrationUrl(),
        data: payload,
      });

      const { status, payload: { error = "", data = {} } = {} } =
        response || {};

      if (status === false) {
        dispatch({
          type: REGISTER_REGISTRATION_COMPLETED_WITH_ERROR,
          payload: { error },
        });
      } else if (status === true) {
        // const { qualification_id } = data;
        dispatch({
          type: REGISTER_REGISTRATION_COMPLETED,
          data: data,
        });
      }
    } catch (err) {
      console.log("err REGISTER QUALIFICATION", err);
      throw err;
    }

    return response;
  };
};

export const deleteDoctorQualificationImage = (qualificationId, document) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: DELETE_QUALIFICATION_IMAGE });

      response = await doRequest({
        method: REQUEST_TYPE.DELETE,
        url: Doctor.getDeleteQualificationDocumentUrl(qualificationId),
        data: { document },
      });

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
          data: {},
        });
      }
    } catch (err) {
      console.log("err DELETE QUALIFICATION IMAGE", err);
      throw err;
    }

    return response;
  };
};

export const deleteDoctorRegistrationImage = (registrationId, document) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: DELETE_REGISTRATION_IMAGE });

      response = await doRequest({
        method: REQUEST_TYPE.DELETE,
        url: Doctor.getDeleteRegistrationDocumentUrl(registrationId),
        data: { document },
      });

      const { status, payload: { error = "" } = {} } = response || {};

      if (status === false) {
        dispatch({
          type: DELETE_REGISTRATION_IMAGE_COMPLETED_WITH_ERROR,
          payload: { error },
        });
      } else if (status === true) {
        dispatch({
          type: DELETE_REGISTRATION_IMAGE_COMPLETED,
          data: {},
        });
      }
    } catch (err) {
      console.log("err DELETE REGISTRATION IMAGE", err);
      throw err;
    }

    return response;
  };
};

export default (state = {}, action) => {
  const { data, type } = action;
  switch (type) {
    case NEW_DOCTOR:
      const { doctor_id = "" } = data;
      if (doctor_id) {
        return {
          ...state,
          new_doctor_created_id: doctor_id,
        };
      } else {
        return { ...state };
      }

    case GET_DOCTOR_PROFILE_DATA_COMPLETED:
      return {
        profileData: data.profileData,
      };

    case GET_DOCTOR_QUALIFICATION_DATA_COMPLETED:
      return {
        qualificationData: data.qualificationData,
        registration_details: data.registration_details,
        upload_documents: data.upload_documents,
      };
    default:
      return state;
  }
};
