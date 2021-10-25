import {
  ADD_FOOD_ITEM_COMPLETED,
  STORE_FOOD_ITEM_AND_DETAILS,
  EDIT_FOOD_ITEM_COMPLETED,
} from "../foodItems";
import { GET_SINGLE_DIET_DETAILS_COMPLETED } from "../../modules/diets";

function foodItemDetaisReducer(state, data) {
  const { food_items, food_item_details } = data || {};
  if (food_items && food_item_details) {
    return {
      ...state,
      ...food_item_details,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action || {};
  switch (type) {
    case ADD_FOOD_ITEM_COMPLETED:
      return foodItemDetaisReducer(state, data);
    case EDIT_FOOD_ITEM_COMPLETED:
      return foodItemDetaisReducer(state, data);
    case STORE_FOOD_ITEM_AND_DETAILS:
      return foodItemDetaisReducer(state, data);
    case GET_SINGLE_DIET_DETAILS_COMPLETED:
      return foodItemDetaisReducer(state, data);
    default:
      return foodItemDetaisReducer(state, data);
  }
};
