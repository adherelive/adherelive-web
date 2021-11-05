import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import AddFoodItemDrawer from "../../Components/Drawer/addFoodItem";
import { close } from "../../modules/drawer";
import { DRAWER } from "../../constant";
import { addFoodItem } from "../../modules/foodItems";
import { searchFood } from "../../modules/searchedFoodItems";

const mapStateToProps = (state) => {
  const { auth } = state;
  const { authenticated_user, authenticated_category } = auth;
  const {
    drawer: { visible, loading, data: { type, payload = {} } = {} },
    portions,
    care_plans,
    food_items,
    food_item_details,
    searched_food_items,
    searched_food_item_details,
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    close: () => dispatch(close()),
    addFoodItem: (data) => dispatch(addFoodItem(data)),
    searchFood: (value) => dispatch(searchFood(value)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AddFoodItemDrawer)
);
