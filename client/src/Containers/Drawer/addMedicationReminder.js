import { connect } from "react-redux";
import AddMedicationReminder from "../../Components/Drawer/addMedicationReminder/medicationsReminder";
import { DRAWER } from "../../constant";
import { close } from "../../modules/drawer";
import {addMedicationReminder} from "../../modules/medications";
import {getMedicationDetails} from "../../modules/otherDetails";
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
    getMedicationDetails: () => dispatch(getMedicationDetails()),
    searchMedicine: data => dispatch(searchMedicine(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddMedicationReminder);
