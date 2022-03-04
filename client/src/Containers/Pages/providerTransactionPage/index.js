import { connect } from "react-redux";
import ProviderTransactionPage from "../../../Components/Pages/providerTransactionPage";
import { withRouter } from "react-router-dom";
import { open } from "../../../modules/drawer";
import { DRAWER } from "../../../constant";

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProviderTransactionPage)
);
