import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PrivacyPolicy from "../../../Components/Pages/PrivacyPolicy";
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
  connect(mapStateToProps, mapDispatchToProps)(PrivacyPolicy)
);
