

function carePlanTemplatesReducer(state, data) {
    const { care_plan_templates } = data || {};
    if (care_plan_templates) {
        return {
            ...state,
            ...care_plan_templates,
        };
    } else {
        return {
            ...state,
        };
    }
}

export default (state = {}, action) => {
    const { type, data } = action;
    switch (type) {
        default:
            return carePlanTemplatesReducer(state, data)
    }
};
