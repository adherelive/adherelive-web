import { MEDICATION_INITIAL_STATE } from "../../data";
import {doRequest} from "../../Helper/network";
import {REQUEST_TYPE} from "../../constant";
import {getAddMedicationReminderURL, getMedicationForParticipantUrl} from "../../Helper/urls/mReminders";
import moment from "moment";

const INITIAL_STATE = {
  "100": {
    basic_info: {
      id: "1",
      participant_id: "2", // seed test-patient
      organizer_id:"1",
      organizer_type: "doctor",
      description:"",
      start_date:moment(),
      end_date: moment().add(2, 'w'),
      details: {
        medicine_id: "1",
        start_time: moment(),
        end_time: moment(),
        repeat_days: ["Mon","Fri"],
        quantity: "10",
        strength: "250",
        unit: "mg",
        when_to_take: "before breakfast",
      }
    }
  },
  "101": {
    basic_info: {
      id: "2",
      participant_id: "2", // seed test-patient
      organizer_id:"1",
      organizer_type: "doctor",
      description:"",
      start_date:moment(),
      end_date: moment().add(2, 'm'),
      details: {
        medicine_id: "3",
        start_time: moment(),
        end_time: moment(),
        repeat_days: ["Tue","Wed", "Thu"],
        quantity: "5",
        strength: "300",
        unit: "mg",
        when_to_take: "before dinner",
      }
    }
  }
};

export const ADD_MEDICATION_REMINDER_START = "ADD_MEDICATION_REMINDER_START";
export const ADD_MEDICATION_REMINDER_COMPLETE =
    "ADD_MEDICATION_REMINDER_COMPLETE";
export const ADD_MEDICATION_REMINDER_FAILED = "ADD_MEDICATION_REMINDER_FAILED";

export const GET_MEDICATION_START = "GET_MEDICATION_START";
export const GET_MEDICATION_COMPLETE = "GET_MEDICATION_COMPLETE";
export const GET_MEDICATION_FAILED = "GET_MEDICATION_FAILED";

export const addMedicationReminder = payload => {
  let response = {};
  const { id, ...rest } = payload || {};
  return async dispatch => {
    try {
      dispatch({ type: ADD_MEDICATION_REMINDER_START });

      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: getAddMedicationReminderURL(id),
        data: rest
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

export const getMedications = id => {
  let response = {};
  return async dispatch => {
    try {
      dispatch({type: GET_MEDICATION_START});
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getMedicationForParticipantUrl(id)
      });

      const {status, payload: {data, error = {}} = {}} = response || {};
      if(status === true) {
        dispatch({
          type: GET_MEDICATION_COMPLETE,
          payload: data
        });
      } else {
        dispatch({
          type: GET_MEDICATION_FAILED,
          error
        });
      }
    } catch(error) {
      console.log("GET MEDICATION ERROR ", error);
    }
  };
};

function medicationReducer(state, payload) {
  const { medications = {} } = payload || {};
  if (Object.keys(medications).length > 0) {
    return {
      ...state,
      ...medications
    };
  } else {
    return {
      ...state
    };
  }
}

export default (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    default:
      return medicationReducer(state, payload);
  }
};
