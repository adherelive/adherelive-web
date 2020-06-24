import { connect } from "react-redux";
import AddMedicationReminder from "../../Components/Drawer/addMedicationReminder/medicationsReminder";
import { DRAWER } from "../../constant";
import { close } from "../../modules/drawer";
import {getMedications, addMedicationReminder,addCarePlanMedicationReminder} from "../../modules/medications";
import {getMedicationDetails} from "../../modules/otherDetails";
import {getAppointments} from "../../modules/appointments";
import {searchMedicine} from "../../modules/medicines";
// import { createReminder, updateReminder } from "../../modules/reminder"; // write to add to database
const mapStateToProps = state => {
  const {
    drawer: { visible, loading, data: { type, payload = {} } = {} },
    other_details: {medication_details = {}} = {}
  } = state;

  console.log(
    "123124 visible, type --> ",
    visible,
    type,
    type === DRAWER.ADD_MEDICATION_REMINDER
  );

  return {
    visible: visible && type === DRAWER.ADD_MEDICATION_REMINDER,
    loading,
    payload,
    medication_details
  };
};

const mapDispatchToProps = dispatch => {
  return {
    close: () => dispatch(close()),
    addMedicationReminder: data => dispatch(addMedicationReminder(data)),
    addCarePlanMedicationReminder:(data,carePlanId) =>dispatch(addCarePlanMedicationReminder(data,carePlanId)),
    getMedicationDetails: () => dispatch(getMedicationDetails()),
    searchMedicine: data => dispatch(searchMedicine(data)),
    getMedications: (id) => dispatch(getMedications(id)),
    getAppointments: (id) => dispatch(getAppointments(id)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddMedicationReminder);
