
const GET_PUBLIC_MEDICINES_COMPLETED="GET_PUBLIC_MEDICINES_COMPLETED";
const PUBLIC = "public";
const RESET_SEARCH_PUBLIC="RESET_SEARCH_PUBLIC";

 function getPublicSearchMedicinesReducer(state, data) {
     const {offset=0,medicines,type='' , searchText=''} = data || {};
     const search_public_medicines =  {...state,[offset]: medicines};

     if(medicines && type===PUBLIC  && searchText!==''){
         return {
            ...search_public_medicines
         }
     }else{
         return state;
     }
 } 

 function resetPublicReducer(state, data) {
    return [];
}

 
  
  export default (state = [], action) => {
    const { type, data } = action;

    switch (type) {
      case GET_PUBLIC_MEDICINES_COMPLETED:
          return getPublicSearchMedicinesReducer(state,data); 
      case RESET_SEARCH_PUBLIC : 
          return resetPublicReducer(state,data);
      default:
        return getPublicSearchMedicinesReducer(state,data);
    }
  };
  