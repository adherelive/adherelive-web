import { connect } from "react-redux";
import AdminDoctorPage from "../../../Components/Pages/adminDoctor";
import { withRouter } from "react-router-dom";
// import {open} from "../../../modules/drawer";
// import {DRAWER} from "../../../constant";

const mapStateToProps = (state) => {
  const {} = state;

  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AdminDoctorPage)
);
