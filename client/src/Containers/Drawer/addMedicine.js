import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import AddMedicineDrawer from "../../Components/Drawer/addNewMedicine";
import { addMedicine, addAdminMedicine } from "../../modules/medicines";
import { DRAWER } from "../../constant";
import { close } from "../../modules/drawer";

const mapStateToProps = (state) => {
  const {
    auth = {},
    drawer: { data: { type } = {}, visible } = {},
    other_details: { medication_details = {} } = {},
  } = state;

  return {
    auth,
    visible: visible && type === DRAWER.ADD_MEDICINES,
    medication_details,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addNewMedicine: (data) => dispatch(addMedicine(data)),
    close: () => dispatch(close()),
    addAdminMedicine: (data) => dispatch(addAdminMedicine(data)),
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { visible: drawerVisible, auth, medication_details } = stateProps;

  const {
    addNewMedicine,
    close: closeDrawer,
    addAdminMedicine,
  } = dispatchProps;

  const { visible = false, close, setNewMedicineId, input } = ownProps;

  return {
    visible: visible || drawerVisible,
    addNewMedicine,
    close: close ? close : closeDrawer,
    setNewMedicineId,
    input,
    addAdminMedicine,
    auth,
    medication_details,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(AddMedicineDrawer)
);
