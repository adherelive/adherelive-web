import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import AddDietDrawer from "../../Components/Drawer/addDiet";
import { close } from "../../modules/drawer";
import { open } from "../../modules/drawer";
import { DRAWER } from "../../constant";
import { getPortions } from "../../modules/portions";
import { addFoodItem } from "../../modules/foodItems";
import { addDiet, getPatientPreferenceDietDetails } from "../../modules/diets";

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
    visible: visible && type === DRAWER.ADD_DIET,
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
    getPortions: () => dispatch(getPortions()),
    addFoodItem: (data) => dispatch(addFoodItem(data)),
    addDiet: (data) => dispatch(addDiet(data)),
    getPatientPreferenceDietDetails: (patient_id) =>
      dispatch(getPatientPreferenceDietDetails(patient_id)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AddDietDrawer)
);
