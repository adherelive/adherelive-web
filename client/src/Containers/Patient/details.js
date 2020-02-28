import PatientDetails from "../../Components/Patient/details";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {open} from "../../modules/drawer";
import {DRAWER} from "../../constant";

const mapStateToProps = (state,ownprops) => {
  const {user={}} = state;
  const {id} = ownprops;
  const user_details = user[id];

  console.log("usee:::",user_details, state, user, user[id]);
  return {
    user_details
  };
};

const mapDispatchToProps = dispatch => {
  return {
    openAppointmentDrawer: () => {
      console.log("12312 being called container");
      return dispatch(open({type: DRAWER.ADD_MEDICATION_REMINDER}))
    }
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PatientDetails)
);
