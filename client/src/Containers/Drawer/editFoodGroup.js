import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import EditFoodGroupDrawer from "../../Components/Drawer/editFoodGroup";
import { close } from "../../modules/drawer";
import {
  addFoodItem,
  storeFoodItemAndDetails,
  updateFoodItem,
} from "../../modules/foodItems";
import { searchFood } from "../../modules/searchedFoodItems";
import { clearLatestCreatedFoodItem } from "../../modules/latestCreatedFood";

const mapStateToProps = (state) => {
  const { auth } = state;
  const { authenticated_user, authenticated_category } = auth;
  const {
    drawer: { loading, data: { payload = {} } = {} },
    portions,
    care_plans,
    food_items,
    food_item_details,
    searched_food_items,
    searched_food_item_details,
    doctors,
    latest_created_food,
  } = state;

  return {
    authenticated_user,
    authenticated_category,
    loading,
    payload,
    portions,
    care_plans,
    food_items,
    food_item_details,
    searched_food_items,
    searched_food_item_details,
    doctors,
    latest_created_food,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    close: () => dispatch(close()),
    addFoodItem: (data) => dispatch(addFoodItem(data)),
    updateFoodItem: ({ food_item_id, data }) =>
      dispatch(updateFoodItem({ food_item_id, data })),
    searchFood: (value) => dispatch(searchFood(value)),
    storeFoodItemAndDetails: (data) => dispatch(storeFoodItemAndDetails(data)),
    clearLatestCreatedFoodItem: () => dispatch(clearLatestCreatedFoodItem()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EditFoodGroupDrawer)
);
