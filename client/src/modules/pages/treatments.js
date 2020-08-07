import { PAGE_INITIAL } from "../../data";
function treatmentPageReducer(state, data) {
  console.log("192371937812 data --> ", data);
  const {treatment_ids} = data || {};
  if(treatment_ids) {
    return [
      ...treatment_ids
    ];
  } else {
    return [
      ...state
    ];
  }
}

export default (state = [], action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return treatmentPageReducer(state,data);
  }
};
