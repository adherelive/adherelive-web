import { ADD_FOOD_ITEM_COMPLETED } from "../foodItems";

const CLEAR_LATEST_CREATED_FOOD_ITEM = "CLEAR_LATEST_CREATED_FOOD_ITEM";

export const clearLatestCreatedFoodItem = () => {
  return async (dispatch) => {
    try {
      const data = {
        food_items: {},
        food_item_details: {},
        created: false,
      };

      dispatch({
        type: CLEAR_LATEST_CREATED_FOOD_ITEM,
        data,
      });
    } catch (error) {
      console.log("CLEAR_LATEST_CREATED_FOOD_ITEM ERROR --> ", error);
    }
  };
};

function latestFoodItemCreatedReducer(state, data) {
  const { food_items, food_item_details } = data || {};

  if (food_items) {
    return {
      food_items: { ...food_items },
      food_item_details: { ...food_item_details },
      created: true,
    };
  } else {
    return state;
  }
}

function clearDataReducer(state, data) {
  return {
    food_items: {},
    food_item_details: {},
    created: false,
  };
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    case ADD_FOOD_ITEM_COMPLETED:
      return latestFoodItemCreatedReducer(state, data);
    case CLEAR_LATEST_CREATED_FOOD_ITEM:
      return clearDataReducer(state, data);
    default:
      return state;
  }
};
