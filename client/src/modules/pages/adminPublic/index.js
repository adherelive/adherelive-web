
const GET_PUBLIC_MEDICINES_COMPLETED="GET_PUBLIC_MEDICINES_COMPLETED";
const PUBLIC = "public";
const MAP_MEDICINE_TO_PUBLIC = "MAP_MEDICINE_TO_PUBLIC";
const DELETE_MEDICINE_COMPLETED ="DELETE_MEDICINE_COMPLETED";
 function getPublicAdminMedicinesReducer(state, data) {
     const {offset=0,medicines,type=''} = data || {};
     const public_medicines =  {...state,[offset]: medicines};

     if(medicines && type===PUBLIC ){
         return {
            ...public_medicines
         }
     }else{
         return state;
     }
 } 


 function mapMedicineToPublicReducer(state, data) {
     const {medicine} = data || {};
     if(medicine){
         const {["0"]:existing , ...rest} = state;
        const public_medicines =  {["0"]:{ ...existing, ...medicine}}
         return {
             ...public_medicines
         }
     }else{
         return state;
     }   
 }


 function deleteMedicineReducer(state,data){
    const {medicine_id , offset = null} = data || {};
    console.log("98327548237469238048230490",{medicine_id,offset});
    if(medicine_id){
        const {[medicine_id.toString()]:medicine , ...rest} =  state[offset] || {};
        console.log("98327548237469238048230490 @@@@@@@@@@@@@@@@",{medicine,rest:{...rest},current:state[offset]});
        return {
            ...rest
        }
    }
  
}
 
  
  export default (state = [], action) => {
    const { type, data } = action;

    switch (type) {
      case GET_PUBLIC_MEDICINES_COMPLETED:
          return getPublicAdminMedicinesReducer(state,data); 
      case MAP_MEDICINE_TO_PUBLIC:
          return mapMedicineToPublicReducer(state,data);  
      case DELETE_MEDICINE_COMPLETED:
        return deleteMedicineReducer(state,data);          
      default:
        return getPublicAdminMedicinesReducer(state,data);
    }
  };
  