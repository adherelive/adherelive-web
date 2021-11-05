import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import TosPPEditorPage from "../../../Components/Pages/tosPPEditorPage";
import {
  getTermsAndPolicy,
  updateTermsAndPolicy,
} from "../../../modules/otherDetails";

const mapStateToProps = (state) => {
  const {} = state;

  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    getTermsAndPolicy: (type) => dispatch(getTermsAndPolicy(type)),
    updateTermsAndPolicy: (payload) => dispatch(updateTermsAndPolicy(payload)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TosPPEditorPage)
);
