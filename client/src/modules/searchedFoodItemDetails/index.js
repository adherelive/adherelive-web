import { SEARCH_FOOD_COMPLETED } from "../searchedFoodItems";
import {
  ADD_FOOD_ITEM_COMPLETED,
  EDIT_FOOD_ITEM_COMPLETED,
} from "../foodItems";

function searchFoodItemDetaisReducer(state, data) {
  let { food_items = {}, food_item_details = {} } = data || {};
  if (food_items && food_item_details) {
    return {
      ...food_item_details,
    };
  } else {
    return state;
  }
}

function addedNewItemReducer(state, data) {
  let { food_items = {}, food_item_details = {} } = data || {};
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
    case SEARCH_FOOD_COMPLETED:
      return searchFoodItemDetaisReducer(state, data);
    case ADD_FOOD_ITEM_COMPLETED:
      return addedNewItemReducer(state, data);
    case EDIT_FOOD_ITEM_COMPLETED:
      return addedNewItemReducer(state, data);
    default:
      return state;
  }
};
