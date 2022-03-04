import { connect } from "react-redux";
import SymptomsDrawer from "../../Components/Drawer/symptoms";
import { DRAWER } from "../../constant";
import { close } from "../../modules/drawer";
import {
  getMedications,
  addMedicationReminder,
  addCarePlanMedicationReminder,
} from "../../modules/medications";
import { getMedicationDetails } from "../../modules/otherDetails";
import { getAppointments } from "../../modules/appointments";
import { searchMedicine } from "../../modules/medicines";
// import { createReminder, updateReminder } from "../../modules/reminder"; // write to add to database
const mapStateToProps = (state) => {
  const {
    drawer: { visible, loading, data: { type, payload = {} } = {} },
    other_details: { medication_details = {} } = {},
    medicines,
    upload_documents = {},
  } = state;

  return {
    visible: visible && type === DRAWER.SYMPTOMS,
    loading,
    payload,
    medication_details,
    medicines,
    upload_documents,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    close: () => dispatch(close()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SymptomsDrawer);
