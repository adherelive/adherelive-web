import { connect } from "react-redux";
import AddVitals from "../../Components/Drawer/addVital/vitalReminder";
import { DRAWER } from "../../constant";
import { close } from "../../modules/drawer";
import { searchVital } from "../../modules/vital_templates";
import { getVitalOccurence } from "../../modules/vital_occurence";
import { addVital } from "../../modules/vitals";

// import { createReminder, updateReminder } from "../../modules/reminder"; // write to add to database
const mapStateToProps = (state) => {
  const {
    drawer: { visible, loading, data: { type, payload = {} } = {} },
    vital_templates,
    repeat_intervals,
  } = state;

  return {
    visible: visible && type === DRAWER.ADD_VITALS,
    loading,
    payload,
    vital_templates,
    repeat_intervals,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    close: () => dispatch(close()),
    addVital: (data) => dispatch(addVital(data)),
    searchVital: (data) => dispatch(searchVital(data)),
    getVitalOccurence: () => dispatch(getVitalOccurence()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddVitals);
