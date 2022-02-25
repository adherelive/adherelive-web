import { connect } from "react-redux";
import ProviderTransactionPage from "../../../Components/Pages/providerTransactionPage";
import { withRouter } from "react-router-dom";

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProviderTransactionPage)
);
