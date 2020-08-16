

function carePlanTemplateIds(state, data) {
    const { care_plan_template_ids } = data || {};
    if (care_plan_template_ids) {
        return {
            ...care_plan_template_ids,
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
            return carePlanTemplateIds(state, data)
    }
};
