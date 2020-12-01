import { connect } from "react-redux";
import DoctorTable from "../../Components/Doctor/table";
import { withRouter } from "react-router-dom";
import {getAllDoctorsForProvider} from "../../modules/doctors";

const mapStateToProps = state => {
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
  connect(mapStateToProps, mapDispatchToProps)(DoctorTable)
);
