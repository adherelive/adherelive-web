
const GET_PRIVATE_MEDICINES_COMPLETED="GET_PRIVATE_MEDICINES_COMPLETED";
const PRIVATE="private";
const RESET_SEARCH_PRIVATE="RESET_SEARCH_PRIVATE";

function getPrivateSearchMedicinesReducer(state, data) {
    const {offset=0,medicines,type='' , searchText = ''} = data || {};
    const search_private_medicines =  {...state,[offset]: medicines};
    if(medicines && type===PRIVATE && searchText !== '') {

        return {
           ...search_private_medicines
        }
    }else{
        return state;
    }
} 

function resetPrivateReducer(state, data) {
    return [] ;
    
}

 
 export default (state = [], action) => {
   const { type, data } = action;
   switch (type) {
     case GET_PRIVATE_MEDICINES_COMPLETED:
         return getPrivateSearchMedicinesReducer(state,data);   
     case RESET_SEARCH_PRIVATE : 
         return resetPrivateReducer(state,data);
     default:
       return getPrivateSearchMedicinesReducer(state,data);
   }
 };
 