import { connect } from "react-redux";
import AddVitals from "../../Components/Drawer/addVital/vitalReminder";
import { DRAWER } from "../../constant";
import { close } from "../../modules/drawer";
// import { createReminder, updateReminder } from "../../modules/reminder"; // write to add to database
const mapStateToProps = state => {
  const {
    drawer: { visible, loading, data: { type, payload = {} } = {} }
  } = state;

  

  return {
    visible: visible && type === DRAWER.ADD_VITALS,
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
)(AddVitals);
