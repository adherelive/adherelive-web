import { withRouter } from "react-router-dom";
import SearchPatient from "../../Components/SearchPatient/index";
import { getInitialData } from "../../modules/auth";
import { connect } from "react-redux";
import {
  searchPatientForDoctor,
  searchPatientFromNum,
} from "../../modules/patients";

const mapStateToProps = (state) => {
  const {
    auth: { authPermissions = [], authenticated_user = 1 } = {},
    drawer,
    patients,
    doctors,
  } = state;
  return {
    authPermissions,
    drawer,
    patients,
    doctors,
    authenticated_user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    searchPatientForDoctor: (value) => dispatch(searchPatientForDoctor(value)),
    searchPatientFromNum: (value) => dispatch(searchPatientFromNum(value)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SearchPatient)
);
