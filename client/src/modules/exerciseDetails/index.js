import {
  ADD_EXERCISE_COMPLETED,
  STORE_EXERCISE_AND_DETAILS,
  EDIT_EXERCISE_COMPLETED,
} from "../exercises";
import { GET_SINGLE_DIET_DETAILS_COMPLETED } from "../../modules/diets";

function exerciseDetaisReducer(state, data) {
  const { exercises, exercise_details } = data || {};
  if (exercises && exercise_details) {
    return {
      ...state,
      ...exercise_details,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action || {};
  switch (type) {
    case ADD_EXERCISE_COMPLETED:
      return exerciseDetaisReducer(state, data);
    case EDIT_EXERCISE_COMPLETED:
      return exerciseDetaisReducer(state, data);
    case STORE_EXERCISE_AND_DETAILS:
      return exerciseDetaisReducer(state, data);
    case GET_SINGLE_DIET_DETAILS_COMPLETED:
      return exerciseDetaisReducer(state, data);
    default:
      return exerciseDetaisReducer(state, data);
  }
};
