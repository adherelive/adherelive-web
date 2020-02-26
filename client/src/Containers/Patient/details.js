import PatientDetails from "../../Components/Patient/details";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const mapStateToProps = (state,ownprops) => {
  const {users={}} = state;
  const {id} = ownprops;
  const user_details = users[id];

  console.log("usee:::",user_details,state);
  return {
    user_details
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PatientDetails)
);
