import {GET_WORKOUT_DETAILS_COMPLETED} from "../workouts";

function repetitionsReducer(state, data) {
    const {repetitions} = data || {};
    if (repetitions) {
        return {
            ...state,
            ...repetitions,
        };
    } else {
        return state;
    }
}

export default (state = {}, action) => {
    const {type, data} = action;
    switch (type) {
        case GET_WORKOUT_DETAILS_COMPLETED:
            return repetitionsReducer(state, data);
        default:
            return state;
    }
};
