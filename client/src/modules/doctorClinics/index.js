function doctorClinicReducer(state, data) {
    const {doctor_clinics} = data || {};
    if (doctor_clinics) {
        return {
            ...state,
            ...doctor_clinics,
        };
    } else {
        return state;
    }
}

export default (state = {}, action) => {
    const {type, data} = action;
    switch (type) {
        default:
            return doctorClinicReducer(state, data);
    }
};
