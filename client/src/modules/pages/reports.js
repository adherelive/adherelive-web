import { ADD_REPORT_COMPLETE, UPLOAD_REPORT_COMPLETE } from "../reports";

function reportPageReducer(state, data) {
  const { report_ids } = data || {};
  if (report_ids) {
    return [...report_ids];
  } else {
    return state;
  }
}

function reportAddReducer(state, data) {
  const { report_id } = data || {};
  if (report_id) {
    return [...state, report_id];
  } else {
    return state;
  }
}

export default (state = [], action) => {
  const { type, data } = action;
  switch (type) {
    case ADD_REPORT_COMPLETE:
    case UPLOAD_REPORT_COMPLETE:
      return reportAddReducer(state, data);
    default:
      return reportPageReducer(state, data);
  }
};
