import { connect } from "react-redux";
import AddMedicationReminder from "../../Components/Drawer/addMedicationReminder/medicationsReminder";
import { DRAWER } from "../../constant";
import { close } from "../../modules/drawer";
// import { createReminder, updateReminder } from "../../modules/reminder"; // write to add to database
const mapStateToProps = state => {
  const {
    drawer: { visible, loading, data: { type, payload = {} } = {} }
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
    payload
  };
};

const mapDispatchToProps = dispatch => {
  return {
    close: () => dispatch(close())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddMedicationReminder);
