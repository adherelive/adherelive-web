import { PATIENT_INITIAL_STATE } from "../../data";

// todo: remove patient initial state after updating tables for patient with defaults

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
