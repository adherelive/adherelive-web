import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import { addFoodItemUrl, updateFoodItemUrl } from "../../Helper/urls/foodItems";

import { GET_SINGLE_DIET_DETAILS_COMPLETED } from "../../modules/diets";

export const ADD_FOOD_ITEM_START = "ADD_FOOD_ITEM_START";
export const ADD_FOOD_ITEM_COMPLETED = "ADD_FOOD_ITEM_COMPLETED";
export const ADD_FOOD_ITEM_FAILED = "ADD_FOOD_ITEM_FAILED";

export const EDIT_FOOD_ITEM_START = "EDIT_FOOD_ITEM_START";
export const EDIT_FOOD_ITEM_COMPLETED = "EDIT_FOOD_ITEM_COMPLETED";
export const EDIT_FOOD_ITEM_FAILED = "EDIT_FOOD_ITEM_FAILED";

export const STORE_FOOD_ITEM_AND_DETAILS = "STORE_FOOD_ITEM_AND_DETAILS";

export const addFoodItem = (payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: addFoodItemUrl(),
        data: payload,
      });

      const { status, payload: { data, message = "" } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: ADD_FOOD_ITEM_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: ADD_FOOD_ITEM_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("ADD FOOD ITEM MODULE catch error -> ", error);
    }
    return response;
  };
};

export const updateFoodItem = ({ food_item_id, data: payload }) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: updateFoodItemUrl(food_item_id),
        data: payload,
      });

      const { status, payload: { data, message = "" } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: EDIT_FOOD_ITEM_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: EDIT_FOOD_ITEM_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("EDIT FOOD ITEM MODULE catch error -> ", error);
    }
    return response;
  };
};

export const storeFoodItemAndDetails = (data) => {
  return async (dispatch) => {
    try {
      const { food_items, food_item_details } = data;
      if (food_items && food_item_details) {
        dispatch({
          type: STORE_FOOD_ITEM_AND_DETAILS,
          data,
        });
      }
    } catch (error) {
      console.log("STORE FOOD ITEM MODULE catch error -> ", error);
    }
  };
};

function foodItemReducer(state, data) {
  const { food_items } = data || {};
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
    case ADD_FOOD_ITEM_COMPLETED:
      return foodItemReducer(state, data);
    case EDIT_FOOD_ITEM_COMPLETED:
      return foodItemReducer(state, data);
    case STORE_FOOD_ITEM_AND_DETAILS:
      return foodItemReducer(state, data);
    case GET_SINGLE_DIET_DETAILS_COMPLETED:
      return foodItemReducer(state, data);
    default:
      return foodItemReducer(state, data);
  }
};
