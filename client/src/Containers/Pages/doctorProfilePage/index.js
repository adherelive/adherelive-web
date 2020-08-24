import { connect } from "react-redux";
import DoctorProfilePage from "../../../Components/Pages/doctorProfilePage";
import { withRouter } from "react-router-dom";
import { updateDoctor } from "../../../modules/doctors";
import {searchSpecialties} from "../../../modules/specialities";

// import {open} from "../../../modules/drawer";
// import {DRAWER} from "../../../constant";

const mapStateToProps = state => {
  const { 
        auth,
        doctors,
        users,
        specialities,
        doctor_qualifications,
        degrees,
        colleges
    } = state;

  return {
    auth,
    doctors,
    users,
    specialities,
    doctor_qualifications,
    degrees,
    colleges
  };
};

const mapDispatchToProps = dispatch => {
  return {
    searchSpecialities: (data) => dispatch(searchSpecialties(data)),
    updateDoctorBasicInfo: (user_id,data) => dispatch(updateDoctor(user_id,data))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DoctorProfilePage)
);
