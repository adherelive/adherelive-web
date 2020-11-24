import { connect } from "react-redux";
import EditPatientDrawer from "../../Components/Drawer/editPatient";
import { DRAWER } from "../../constant";
import { close } from "../../modules/drawer";
import { searchTreatment } from "../../modules/treatments";
import { searchCondition } from "../../modules/conditions";
import { searchSeverity } from "../../modules/severity";
import {searchMedicine} from "../../modules/medicines";
import {updatePatientAndCareplan} from "../../modules/doctors";
const mapStateToProps = state => {
  const {
    drawer: { visible, loading, data: { type, payload = {} } = {} },
    users={},
    treatments = {},
    conditions = {},
    severity = {},
    patients ={}
  } = state;


  return {
    visible: visible && type === DRAWER.EDIT_PATIENT,
    loading,
    payload,
    treatments,
    conditions,
    severity,
    patients,
    users
  };
};

const mapDispatchToProps = dispatch => {
  return {
    close: () => dispatch(close()),
    searchMedicine: value => dispatch(searchMedicine(value)),
    searchCondition: value => dispatch(searchCondition(value)),
    searchTreatment: value => dispatch(searchTreatment(value)),
    searchSeverity: value => dispatch(searchSeverity(value)),
    updatePatientAndCareplan : (careplan_id,payload) => dispatch(updatePatientAndCareplan(careplan_id,payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditPatientDrawer);
