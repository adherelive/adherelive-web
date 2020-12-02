import { connect } from "react-redux";
import ProviderDoctorTable from "../../Components/Provider/table";
import { withRouter } from "react-router-dom";
import {getAllDoctorsForProvider} from "../../modules/doctors";

const mapStateToProps = state => {
  console.log("DOCTOR TABLE FOR provider STATE",state);
  const {
    doctors = {},
    users = {},
      pages: {doctor_ids = [], user_ids = []} = {},
      specialities = {},
  } = state;

  return {
    doctors,
    users,
    specialities,
    doctor_ids,
    user_ids,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllDoctorsForProvider : () => dispatch(getAllDoctorsForProvider()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProviderDoctorTable)
);
