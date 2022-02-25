import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import DietTable from "../../Components/Diets/table";
import { getDietsForCareplan } from "../../modules/diets";
import { open } from "../../modules/drawer";
import { DRAWER } from "../../constant";

const mapStateToProps = (state) => {
  const {
    diets = {},
    auth: { auth_role = null } = {},
    care_plans = {},
  } = state;

  return {
    diets,
    auth_role,
    care_plans,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getDietsForCareplan: (id) => dispatch(getDietsForCareplan(id)),
    openEditDietDrawer: (payload) =>
      dispatch(open({ type: DRAWER.EDIT_DIET, payload })),
    openDietResponseDrawer: (payload) =>
      dispatch(open({ type: DRAWER.DIET_RESPONSE, payload })),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DietTable)
);
