
import * as CarePlan  from "../../Helper/urls/carePlans";
import {
  REQUEST_TYPE,
  USER_CATEGORY,
  PATH,
  ONBOARDING_STATUS,
} from "../../constant";
import { doRequest } from "../../Helper/network";
import { Auth } from "../../Helper/urls";


export const ADD_CARE_PLAN_DATA = "ADD_CARE_PLAN_DATA";
export const ADD_CARE_PLAN_DATA_COMPLETED = "ADD_CARE_PLAN_DATA_COMPLETED";
export const ADD_CARE_PLAN_DATA_COMPLETED_WITH_ERROR =
  "ADD_CARE_PLAN_DATA_COMPLETED_WITH_ERROR";

function carePlanReducer(state, data) {
    const {care_plans} = data || {};
    if(care_plans) {
        return {
            ...state,
            ...care_plans
        };
    } else {
        return {
            ...state,
        };
    }
}

export const addCarePlanMedicationsAndAppointments =(payload,carePlanId)=>{
    let response = {};
    return async (dispatch) => {
      try {
        dispatch({ type: ADD_CARE_PLAN_DATA });
  
        response = await doRequest({
          method: REQUEST_TYPE.POST,
          url: CarePlan.getcreateCarePlanMedicationAndAppointmentUrl(carePlanId),
          data:payload
        });
  
        console.log("ADD CARE PLAN DATA COMPLETED response --> ", response);
  
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
            type:ADD_CARE_PLAN_DATA_COMPLETED,
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
  }

export default (state = {}, action) => {
    const {type, data} = action || {};
    switch(type) {
        default:
            return carePlanReducer(state, data);
    }
}