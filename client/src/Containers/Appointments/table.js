import { connect } from "react-redux";
import AppointmentTable from "../../Components/Appointment/table";
import { withRouter } from "react-router-dom";
import { open } from "../../modules/drawer";
import { DRAWER } from "../../constant";

const mapStateToProps = (state) => {
  const {
    patients = {},
    doctors = {},
    users,
    care_plans,
    appointments,
    auth: { authPermissions = [] } = {},
  } = state;

  return {
    patients,
    doctors,
    users,
    care_plans,
    appointments,
    authPermissions,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // openPatientDetailsDrawer: (payload) => dispatch(open({type: DRAWER.PATIENT_DETAILS, payload}))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AppointmentTable)
);
