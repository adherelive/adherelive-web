import { PATIENT_INITIAL_STATE } from "../../data";


import {doRequest} from "../../Helper/network";
import {REQUEST_TYPE} from "../../constant";
import {getAddPatientUrl} from '../../Helper/urls/patients'

// todo: remove patient initial state after updating tables for patient with defaults



export const ADD_PATIENT = "ADD_PATIENT";
export const ADD_PATIENT_COMPLETED = "ADD_PATIENT_COMPLETED";
export const ADD_PATIENT_COMPLETED_WITH_ERROR =
  "ADD_PATIENT_COMPLETED_WITH_ERROR";


export const addPatient =(payload,id)=>{
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: ADD_PATIENT });

      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: getAddPatientUrl(id),
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
        const { patients = {} } = data;
        dispatch({
          type:ADD_PATIENT_COMPLETED,
          payload: {
           patients
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





function patientReducer(state, data) {
  console.log("19237819283 data --> ", data);
  const {patients} = data || {};
  if(patients) {
    return {
      // ...PATIENT_INITIAL_STATE,
      ...state,
      ...patients
    };
  } else {
    return {
      // ...PATIENT_INITIAL_STATE,
      ...state,
    };
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return patientReducer(state, data);
      // return {
      //   ...PATIENT_INITIAL_STATE
      // };
  }
};
