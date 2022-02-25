import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import TermsOfService from "../../../Components/Pages/TermsOfService";
import { getTermsAndPolicy } from "../../../modules/otherDetails";

const mapStateToProps = (state) => {
  const {} = state;

  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    getTermsAndPolicy: (type) => dispatch(getTermsAndPolicy(type)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TermsOfService)
);
