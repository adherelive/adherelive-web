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
           if(user_id === auth.authenticated_user) {
               authDoctorId = id;
           }
        });

        return authDoctorId;
    }
)

export const authCategorySelector = createSelector(
    doctorSelector,
    authSelector,
    (doctors, auth) => {
        let authDoctorId = null;
        Object.keys(doctors).forEach(index => {
           const {basic_info: {id, user_id} = {} } = doctors[index] || {};
           if(user_id === auth.authenticated_user) {
               authDoctorId = id;
           }
        });

        return doctors[authDoctorId];
    }
);
