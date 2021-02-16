
const GET_PRIVATE_MEDICINES_COMPLETED="GET_PRIVATE_MEDICINES_COMPLETED";
const MAKE_MEDICINE_PUBLIC_COMPLETED = "MAKE_MEDICINE_PUBLIC_COMPLETED";
const DELETE_MEDICINE_COMPLETED="DELETE_MEDICINE_COMPLETED";

const PRIVATE="private";

function getPrivateAdminMedicinesReducer(state, data) {
    const {offset=0,medicines,type=''} = data || {};
    const private_medicines =  {...state,[offset]: medicines};
    if(medicines && type===PRIVATE){
        return {
           ...private_medicines
        }
    }
    else{
        return state;
    }
} 

function getMakeMedicinesPublicReducer (state,data) { 
    const {offset = 0} = data || {};
    const {medicines ={}} = data;
    const id = Object.keys(medicines)[0] || null;
    const {[id.toString()]:medicine,...rest} = state[offset] || {};
    const remainingKeyMedicinesLength = Object.keys(rest).length;


    // console.log("9382648782376423546977",{
    //     offset,
    //     medicine,rest,
    //     id,
    //     data,
    //     Length:Object.keys(rest).length
    // });

    if(remainingKeyMedicinesLength === 0){ // to remove last medicine from private page after making public
        return rest
    } 
    
}

function deleteMedicineReducer(state,data){
    const {medicine_id , offset = null} = data || {};
    console.log("98327548237469238048230490",{medicine_id,offset});
    if(medicine_id && offset){
        const {[medicine_id.toString()]:medicine , ...rest} =  state[offset] || {};
        console.log("98327548237469238048230490 ###########",{medicine,rest:{...rest},current:state[offset]});
        return {
            ...rest
        }
    }
   
}



 
 export default (state = [], action) => {
   const { type, data } = action;
   switch (type) {
     case GET_PRIVATE_MEDICINES_COMPLETED:
         return getPrivateAdminMedicinesReducer(state,data); 
     case MAKE_MEDICINE_PUBLIC_COMPLETED:
         return getMakeMedicinesPublicReducer(state,data);     
     case DELETE_MEDICINE_COMPLETED:
         return deleteMedicineReducer(state,data);     
     default:
       return getPrivateAdminMedicinesReducer(state,data);
   }
 };
 