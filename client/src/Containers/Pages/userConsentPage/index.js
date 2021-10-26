import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import UserConsent from "../../../Components/Pages/userConsentPage";
import { giveUserConsent, getInitialData } from "../../../modules/auth";
import { getTermsAndPolicy } from "../../../modules/otherDetails";

const mapStateToProps = (state) => {
  const {} = state;
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    giveUserConsent: (payload) => dispatch(giveUserConsent(payload)),
    getInitialData: () => dispatch(getInitialData()),
    getTermsAndPolicy: (type) => dispatch(getTermsAndPolicy(type)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(UserConsent)
);
