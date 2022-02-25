import * as CarePlan from "../../Helper/urls/carePlans";
import {
  REQUEST_TYPE,
  USER_CATEGORY,
  PATH,
  ONBOARDING_STATUS,
} from "../../constant";
import { doRequest } from "../../Helper/network";
import { Auth } from "../../Helper/urls";

export const GET_PATIENT_CARE_PLAN_DETAILS = "GET_PATIENT_CARE_PLAN_DETAILS";
export const GET_PATIENT_CARE_PLAN_DETAILS_COMPLETED =
  "GET_PATIENT_CARE_PLAN_DETAILS_COMPLETED";
export const GET_PATIENT_CARE_PLAN_DETAILS_COMPLETED_WITH_ERROR =
  "GET_PATIENT_CARE_PLAN_DETAILS_COMPLETED_WITH_ERROR";

export const ADD_CARE_PLAN_DATA = "ADD_CARE_PLAN_DATA";
export const ADD_CARE_PLAN_DATA_COMPLETED = "ADD_CARE_PLAN_DATA_COMPLETED";
export const ADD_CARE_PLAN_DATA_COMPLETED_WITH_ERROR =
  "ADD_CARE_PLAN_DATA_COMPLETED_WITH_ERROR";

export const ADD_SECONDARY_DOCTOR_TO_CARE_PLAN =
  "ADD_SECONDARY_DOCTOR_TO_CARE_PLAN";
export const ADD_SECONDARY_DOCTOR_TO_CARE_PLAN_COMPLETED =
  "ADD_SECONDARY_DOCTOR_TO_CARE_PLAN_COMPLETED";
export const ADD_SECONDARY_DOCTOR_TO_CARE_PLAN_FAILED =
  "ADD_SECONDARY_DOCTOR_TO_CARE_PLAN_FAILED";

function carePlanReducer(state, data) {
  const { care_plans } = data || {};
  if (care_plans) {
    return {
      ...state,
      ...care_plans,
    };
  } else {
    return state;
  }
}

export const addCarePlanMedicationsAndAppointments = (payload, carePlanId) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: ADD_CARE_PLAN_DATA });

      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: CarePlan.getcreateCarePlanMedicationAndAppointmentUrl(carePlanId),
        data: payload,
      });

      const { status, payload: { error = "", data = {} } = {} } =
        response || {};

      if (status === false) {
        dispatch({
          type: ADD_CARE_PLAN_DATA_COMPLETED_WITH_ERROR,
          payload: { error },
        });
      } else if (status === true) {
        const { users = {} } = data;

        dispatch({
          type: ADD_CARE_PLAN_DATA_COMPLETED,
          data,
        });
      }
    } catch (err) {
      console.log("err signin", err);
      throw err;
    }

    return response;
  };
};

export const getPatientCarePlanDetails = (patientId) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_PATIENT_CARE_PLAN_DETAILS });

      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: CarePlan.getPatientCarePlanDetailsUrl(patientId),
      });

      const { status, payload: { error = "", data = {} } = {} } =
        response || {};

      if (status === false) {
        dispatch({
          type: GET_PATIENT_CARE_PLAN_DETAILS_COMPLETED_WITH_ERROR,
          payload: { error },
        });
      } else if (status === true) {
        dispatch({
          type: GET_PATIENT_CARE_PLAN_DETAILS_COMPLETED,
          data: data,
          payload: data,
        });
      }
    } catch (err) {
      console.log("err get patient careplan details", err);
      throw err;
    }

    return response;
  };
};
export const addSecondaryDoctorToCareplan = (payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: ADD_SECONDARY_DOCTOR_TO_CARE_PLAN });

      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: CarePlan.addDoctroRoleIdToCareplanUrl(),
        data: payload,
      });

      const { status, payload: { error = "", data = {} } = {} } =
        response || {};

      if (status === false) {
        dispatch({
          type: ADD_SECONDARY_DOCTOR_TO_CARE_PLAN_FAILED,
          payload: { error },
        });
      } else if (status === true) {
        const { users = {} } = data;

        dispatch({
          type: ADD_SECONDARY_DOCTOR_TO_CARE_PLAN_COMPLETED,
          data,
        });
      }
    } catch (err) {
      console.log("err ADD_SECONDARY_DOCTOR_TO_CARE_PLAN ", err);
      throw err;
    }

    return response;
  };
};

export default (state = {}, action) => {
  const { type, data } = action || {};
  switch (type) {
    default:
      return carePlanReducer(state, data);
  }
};
