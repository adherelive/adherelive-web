import { connect } from "react-redux";
import AddMedicationReminder from "../../Components/Drawer/addMedicationReminder/medicationsReminder";
import { DRAWER } from "../../constant";
import { close } from "../../modules/drawer";
import { getMedications, addMedicationReminder, addCarePlanMedicationReminder } from "../../modules/medications";
import { getMedicationDetails } from "../../modules/otherDetails";
import { getAppointments } from "../../modules/appointments";
import { searchMedicine } from "../../modules/medicines";
const mapStateToProps = state => {
  const {
    drawer: { visible, loading, data: { type, payload = {} } = {} },
    other_details: { medication_details = {} } = {}, medicines
  } = state;

  

  return {
    visible: visible && type === DRAWER.ADD_MEDICATION_REMINDER,
    loading,
    payload,
    medication_details,
    medicines
  };
};

const mapDispatchToProps = dispatch => {
  return {
    close: () => dispatch(close()),
    addMedicationReminder: data => dispatch(addMedicationReminder(data)),
    addCarePlanMedicationReminder: (data, carePlanId) => dispatch(addCarePlanMedicationReminder(data, carePlanId)),
    getMedicationDetails: (patientId) => dispatch(getMedicationDetails(patientId)),
    searchMedicine: data => dispatch(searchMedicine(data)),
    getMedications: (id) => dispatch(getMedications(id)),
    getAppointments: (id) => dispatch(getAppointments(id)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddMedicationReminder);
