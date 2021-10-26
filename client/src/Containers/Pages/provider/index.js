import { connect } from "react-redux";
import AdminProviderPage from "../../../Components/Pages/adminProvider";
import { withRouter } from "react-router-dom";
import { open } from "../../../modules/drawer";
import { DRAWER } from "../../../constant";

const mapStateToProps = (state) => {
  const {} = state;

  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    openAddProviderDrawer: () => dispatch(open({ type: DRAWER.ADD_PROVIDER })),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AdminProviderPage)
);
