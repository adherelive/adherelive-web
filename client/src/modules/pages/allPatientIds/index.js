import { GET_PATIENT_PAGINATED_COMPLETED} from "../paginatedPatients";

function getAllPatientIdsReducer(state, data) {
    const {watchlist,offset,sort_by_name , patient_ids} = data || {};
    const paginated_all_patient_ids = {...state,[offset]:{...patient_ids} };

    if(watchlist && offset && watchlist === "0" ){
        return {
           ...paginated_all_patient_ids
        }
    }else{
        return state;
    }
} 

  
export default (state = [], action) => {
    const { type, data } = action;


    switch (type) {
      case GET_PATIENT_PAGINATED_COMPLETED:
          return getAllPatientIdsReducer(state,data);  
      default:
        return getAllPatientIdsReducer(state,data);
    }
  };
  