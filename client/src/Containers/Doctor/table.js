import { connect } from "react-redux";
import DoctorTable from "../../Components/Doctor/table";
import { withRouter } from "react-router-dom";
import {getAllDoctors} from "../../modules/doctors";

const mapStateToProps = state => {
  const {
    doctors = {},
    users = {},
      pages: {doctor_ids = [], user_ids = []} = {}
  } = state;

  return {
    doctors,
    users,
    doctor_ids,
    user_ids,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllDoctors : () => dispatch(getAllDoctors()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DoctorTable)
);
