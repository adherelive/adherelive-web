import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import { searchFoodUrl } from "../../Helper/urls/foodItems";
import {
  ADD_FOOD_ITEM_COMPLETED,
  EDIT_FOOD_ITEM_COMPLETED,
} from "../foodItems";

export const SEARCH_FOOD_START = "SEARCH_FOOD_START";
export const SEARCH_FOOD_COMPLETED = "SEARCH_FOOD_COMPLETED";
export const SEARCH_FOOD_FAILED = "SEARCH_FOOD_FAILED";

export const searchFood = (value) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: searchFoodUrl(value),
      });

      const { status, payload: { data, message = "" } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: SEARCH_FOOD_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: SEARCH_FOOD_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("SEARCH FOOD MODULE catch error -> ", error);
    }
    return response;
  };
};

function searchFoodItemReducer(state, data) {
  let { food_items = {} } = data || {};
  if (food_items) {
    return {
      ...food_items,
    };
  } else {
    return state;
  }
}

function addedNewItemDetailReducer(state, data) {
  let { food_items = {} } = data || {};
  if (food_items) {
    return {
      ...state,
      ...food_items,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action || {};
  switch (type) {
    case SEARCH_FOOD_COMPLETED:
      return searchFoodItemReducer(state, data);
    case ADD_FOOD_ITEM_COMPLETED:
      return addedNewItemDetailReducer(state, data);
    case EDIT_FOOD_ITEM_COMPLETED:
      return addedNewItemDetailReducer(state, data);
    default:
      return state;
  }
};
