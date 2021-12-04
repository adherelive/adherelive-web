import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ConsultationFeeTable from "../../Components/Pages/doctorSettingsPage/consultationFeeTable";
import { authDoctorSelector } from "../../modules/doctors/selectors";

const mapStateToProps = (state) => {
  const { doctors, auth, users } = state;

  const auth_doctor_id = authDoctorSelector(state);

  return {
    doctors: doctors[auth_doctor_id],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ConsultationFeeTable)
);
