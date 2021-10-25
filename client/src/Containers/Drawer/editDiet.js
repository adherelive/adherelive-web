import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import EditDietDrawer from "../../Components/Drawer/editDiet";
import { close } from "../../modules/drawer";
import { DRAWER } from "../../constant";
import { getPortions } from "../../modules/portions";
import { addFoodItem } from "../../modules/foodItems";
import {
  updateDiet,
  getSingleDietData,
  deleteDiet,
  getPatientPreferenceDietDetails,
  updateDietTotalCalories,
} from "../../modules/diets";
import { getPatientCarePlanDetails } from "../../modules/carePlans";

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
    visible: visible && type === DRAWER.EDIT_DIET,
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
    updateDiet: (data, diet_id) => dispatch(updateDiet(data, diet_id)),
    getSingleDietData: (id) => dispatch(getSingleDietData(id)),
    deleteDiet: (id) => dispatch(deleteDiet(id)),
    getPatientCarePlanDetails: (patientId) =>
      dispatch(getPatientCarePlanDetails(patientId)),
    getPatientPreferenceDietDetails: (patient_id) =>
      dispatch(getPatientPreferenceDietDetails(patient_id)),
    updateDietTotalCalories: ({ total_calories, diet_id }) =>
      dispatch(
        updateDietTotalCalories({
          total_calories,
          diet_id,
        })
      ),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EditDietDrawer)
);
