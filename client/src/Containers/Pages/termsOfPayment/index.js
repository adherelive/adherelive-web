import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import TermsOfPayment from "../../../Components/Pages/termsOfPayment";
import { getTAC } from "../../../modules/termsAndConditions";

const mapStateToProps = (state) => {
  const {} = state;

  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    getTAC: (id) => dispatch(getTAC(id)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TermsOfPayment)
);
