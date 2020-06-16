

function carePlanReducer(state, data) {
    const {care_plans} = data || {};
    if(care_plans) {
        return {
            ...state,
            ...care_plans
        };
    } else {
        return {
            ...state,
        };
    }
}

export default (state = {}, action) => {
    const {type, data} = action || {};
    switch(type) {
        default:
            return carePlanReducer(state, data);
    }
}