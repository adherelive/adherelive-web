import {createSelector} from "reselect";

export const doctorSelector = state => state.doctors;
const authSelector = state => state.auth;

export const authDoctorSelector = createSelector(
    doctorSelector,
    authSelector,
    (doctors, auth) => {
        let authDoctorId = null;
        Object.keys(doctors).forEach(index => {
           const {basic_info: {id, user_id} = {} } = doctors[index] || {};
           console.log("12008393812 user_id, auth.authenticated_user", {user_id, auth: auth.authenticated_user});
           if(user_id === auth.authenticated_user) {
               authDoctorId = id;
           }
        });

        return authDoctorId;
    }
)