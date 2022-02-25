import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import {
  getAddMedicationReminderURL,
  getAddCarePlanMedicationReminderURL,
  getMedicationForParticipantUrl,
  updateMedicationUrl,
  deleteMedicationUrl,
  getMedicationTimelineURL,
} from "../../Helper/urls/mReminders";

// const INITIAL_STATE = {
//   "100": {
//     basic_info: {
//       id: "1",
//       participant_id: "2", // seed test-patient
//       organizer_id: "1",
//       organizer_type: "doctor",
//       description: "",
//       start_date: moment(),
//       end_date: moment().add(2, "w"),
//       details: {
//         medicine_id: "1",
//         start_time: moment(),
//         end_time: moment(),
//         repeat_days: ["Mon", "Fri"],
//         quantity: "10",
//         strength: "250",
//         unit: "mg",
//         when_to_take: "before breakfast",
//       },
//     },
//   },
//   "101": {
//     basic_info: {
//       id: "2",
//       participant_id: "2", // seed test-patient
//       organizer_id: "1",
//       organizer_type: "doctor",
//       description: "",
//       start_date: moment(),
//       end_date: moment().add(2, "m"),
//       details: {
//         medicine_id: "3",
//         start_time: moment(),
//         end_time: moment(),
//         repeat_days: ["Tue", "Wed", "Thu"],
//         quantity: "5",
//         strength: "300",
//         unit: "mg",
//         when_to_take: "before dinner",
//       },
//     },
//   },
// };

export const ADD_MEDICATION_REMINDER_START = "ADD_MEDICATION_REMINDER_START";
export const ADD_MEDICATION_REMINDER_COMPLETE =
  "ADD_MEDICATION_REMINDER_COMPLETE";
export const ADD_MEDICATION_REMINDER_FAILED = "ADD_MEDICATION_REMINDER_FAILED";

export const UPDATE_MEDICATION_START = "UPDATE_MEDICATION_START";
export const UPDATE_MEDICATION_COMPLETE = "UPDATE_MEDICATION_COMPLETE";
export const UPDATE_MEDICATION_FAILED = "UPDATE_MEDICATION_FAILED";

export const GET_MEDICATION_START = "GET_MEDICATION_START";
export const GET_MEDICATION_COMPLETE = "GET_MEDICATION_COMPLETE";
export const GET_MEDICATION_FAILED = "GET_MEDICATION_FAILED";

export const DELETE_MEDICATION_START = "DELETE_MEDICATION_START";
export const DELETE_MEDICATION_COMPLETE = "DELETE_MEDICATION_COMPLETE";
export const DELETE_MEDICATION_FAILED = "DELETE_MEDICATION_FAILED";

export const ADD_CARE_PLAN_MEDICATION_REMINDER_START =
  "ADD_CARE_PLAN_MEDICATION_REMINDER_START";
export const ADD_CARE_PLAN_MEDICATION_REMINDER_COMPLETE =
  "ADD_CARE_PLAN_MEDICATION_REMINDER_COMPLETE";
export const ADD_CARE_PLAN_MEDICATION_REMINDER_FAILED =
  "ADD_CARE_PLAN_MEDICATION_REMINDER_FAILED";

export const GET_MEDICATIONS_TIMELINE_START = "GET_MEDICATIONS_TIMELINE_START";
export const GET_MEDICATIONS_TIMELINE_COMPLETE =
  "GET_MEDICATIONS_TIMELINE_COMPLETE";
export const GET_MEDICATIONS_TIMELINE_FAILED =
  "GET_MEDICATIONS_TIMELINE_FAILED";

export const addCarePlanMedicationReminder = (payload, carePlanId) => {
  let response = {};
  const { id, ...rest } = payload || {};
  return async (dispatch) => {
    try {
      dispatch({ type: ADD_CARE_PLAN_MEDICATION_REMINDER_START });

      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: getAddCarePlanMedicationReminderURL(id, carePlanId),
        data: rest,
      });

      const { status, payload: { data = {}, error = {} } = {} } =
        response || {};
      if (status === true) {
        dispatch({ type: ADD_CARE_PLAN_MEDICATION_REMINDER_COMPLETE, data });
      } else {
        dispatch({
          type: ADD_CARE_PLAN_MEDICATION_REMINDER_FAILED,
          payload: error,
        });
      }
    } catch (error) {
      console.log("ADD medication reminder error ----> ", error);
      dispatch({ type: ADD_CARE_PLAN_MEDICATION_REMINDER_FAILED });
    }
    return response;
  };
};

export const addMedicationReminder = (payload) => {
  let response = {};
  const { id, ...rest } = payload || {};
  return async (dispatch) => {
    try {
      dispatch({ type: ADD_MEDICATION_REMINDER_START });

      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: getAddMedicationReminderURL(id),
        data: rest,
      });

      const { status, payload: { data = {}, error = {} } = {} } =
        response || {};
      if (status === true) {
        dispatch({ type: ADD_MEDICATION_REMINDER_COMPLETE, payload: data });
      } else {
        dispatch({ type: ADD_MEDICATION_REMINDER_FAILED, payload: error });
      }
    } catch (error) {
      console.log("ADD medication reminder error ----> ", error);
      dispatch({ type: ADD_MEDICATION_REMINDER_FAILED });
    }
    return response;
  };
};

export const updateMedication = (payload) => {
  let response = {};
  const { id, ...rest } = payload || {};
  return async (dispatch) => {
    try {
      dispatch({ type: UPDATE_MEDICATION_START });

      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: updateMedicationUrl(id),
        data: rest,
      });

      const { status, payload: { data = {}, error = {} } = {} } =
        response || {};
      if (status === true) {
        dispatch({ type: UPDATE_MEDICATION_COMPLETE, payload: data, data });
      } else {
        dispatch({ type: UPDATE_MEDICATION_FAILED, payload: error });
      }
    } catch (error) {
      console.log("ADD medication reminder error ----> ", error);
      dispatch({ type: UPDATE_MEDICATION_FAILED });
    }
    return response;
  };
};

export const getMedications = (id) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_MEDICATION_START });
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getMedicationForParticipantUrl(id),
      });

      const { status, payload: { data, error = {} } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: GET_MEDICATION_COMPLETE,
          data,
        });
      } else {
        dispatch({
          type: GET_MEDICATION_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("GET MEDICATION ERROR ", error);
    }
  };
};

export const getMedicationTimeline = (medicationId) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_MEDICATIONS_TIMELINE_START });

      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getMedicationTimelineURL(medicationId),
      });

      const { status, payload: { data = {}, error = {} } = {} } =
        response || {};
      if (status === true) {
        dispatch({
          type: GET_MEDICATIONS_TIMELINE_COMPLETE,
          payload: data,
          data,
        });
      } else {
        dispatch({ type: GET_MEDICATIONS_TIMELINE_FAILED, payload: error });
      }
    } catch (error) {
      console.log("getMedicationTimeline error ----> ", error);
      dispatch({ type: GET_MEDICATIONS_TIMELINE_FAILED });
    }
    return response;
  };
};

export const deleteMedication = (id) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: DELETE_MEDICATION_START });
      response = await doRequest({
        method: REQUEST_TYPE.DELETE,
        url: deleteMedicationUrl(id),
      });

      const { status, payload: { data, error } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: DELETE_MEDICATION_COMPLETE,
          data,
        });
      } else {
        dispatch({
          type: DELETE_MEDICATION_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("DELETE MEDICATIONS ERROR", error);
    }
    return response;
  };
};

function medicationReducer(state, payload) {
  const { medications = {} } = payload || {};
  if (Object.keys(medications).length > 0) {
    return {
      ...state,
      ...medications,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return medicationReducer(state, data);
  }
};
