
import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";

import {getPatientsPaginatedUrl} from "../../Helper/urls/doctor";

export const GET_PATIENT_PAGINATED = "GET_PATIENT_PAGINATED";
export const GET_PATIENT_PAGINATED_COMPLETED = "GET_PATIENT_PAGINATED_COMPLETED";
export const GET_PATIENT_PAGINATED_FAILED = "GET_PATIENT_PAGINATED_FAILED"; 

export const getPatientsPaginated = ({offset,watchlist,sort_by_name,created_at_order,name_order}) => {
    let response = {};
    return async (dispatch) => {
      try {
        dispatch({ type: GET_PATIENT_PAGINATED });
  
        response = await doRequest({
          method: REQUEST_TYPE.GET,
          url: getPatientsPaginatedUrl({offset,watchlist,sort_by_name,created_at_order,name_order})
        });
  
        let { status, payload: {data={}} = {} } =
        response || {};
  
        
  
        if (status === true) {
          data["watchlist"] = watchlist.toString();
          data["offset"]=offset.toString();
          data["sort_by_name"]=sort_by_name;
          dispatch({
            type: GET_PATIENT_PAGINATED_COMPLETED,
            data
          });
        } else {
          dispatch({
            type:GET_PATIENT_PAGINATED_FAILED,
          });
        }
      } catch (err) {
        console.log("GET_PATIENT_PAGINATED err ======>>>>>", err);
        throw err;
      }
  
      return response;
    };
  }


function paginatedPatientReducer(state, data) {
    const {paginated_patients_data} = data || {};
    if(paginated_patients_data) {
      return {
        ...state,
        ...paginated_patients_data
      };
    } else {
      return state;
    }
  }
  
  export default (state = {}, action) => {
    const { type, data } = action;
    switch (type) {
      default:
        return paginatedPatientReducer(state, data);
    }
  };