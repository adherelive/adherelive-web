export const GET_ALL_TEMPLATES_FOR_DOC_COMPLETE =
  "GET_ALL_TEMPLATES_FOR_DOC_COMPLETE";

function carePlanTemplateIds(state, data) {
  const { care_plan_template_ids } = data || {};
  if (care_plan_template_ids) {
    return {
      ...care_plan_template_ids,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    // case GET_ALL_TEMPLATES_FOR_DOC_COMPLETE:
    //     const {care_plan_template_ids =[]} = data;
    //     if(care_plan_template_ids.length === 0){
    //         return {...care_plan_template_ids};
    //     }
    default:
      return carePlanTemplateIds(state, data);
  }
};
