import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import AdminMedicines from "../../../Components/Pages/adminMedicine";
import {
  searchMedicine,
  getPublicMedicines,
  getPrivateMedicines,
} from "../../../modules/medicines";
import { open } from "../../../modules/drawer";
import { DRAWER } from "../../../constant";

const mapStateToProps = (state) => {
  const { medicines = {}, pages: { admin_medicines = {} } = {} } = state;

  return {
    medicines,
    admin_medicines,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllMedicines: (value) => dispatch(searchMedicine(value)),
    openAddMedicineDrawer: () => dispatch(open({ type: DRAWER.ADD_MEDICINES })),
    getPublicMedicines: ({ value, offset }) =>
      dispatch(getPublicMedicines({ value, offset })),
    getPrivateMedicines: ({ value, offset }) =>
      dispatch(getPrivateMedicines({ value, offset })),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AdminMedicines)
);
