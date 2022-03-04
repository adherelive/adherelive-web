import { connect } from "react-redux";
import ProviderTable from "../../Components/Provider/table";
import { withRouter } from "react-router-dom";
import { getAllProviders } from "../../modules/providers";
import { USER_CATEGORY, DRAWER } from "../../constant";
import { open } from "../../modules/drawer";

const mapStateToProps = (state) => {
  const {
    providers = {},
    users = {},
    pages: { provider_ids = [], user_ids = [] } = {},
    auth = {},
  } = state;

  return {
    providers,
    users,
    auth,
    provider_ids,
    user_ids,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllProviders: () => dispatch(getAllProviders()),
    openEditProviderDrawer: (payload) => () =>
      dispatch(open({ type: DRAWER.EDIT_PROVIDER, payload })),
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { providers, users, auth, provider_ids, user_ids } = stateProps;

  const { getAllProviders, openEditProviderDrawer } = dispatchProps;

  const { authenticated_category } = auth || {};

  return {
    providers,
    users,
    auth,
    provider_ids,
    user_ids,
    getAllProviders,
    openEditProviderDrawer,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(ProviderTable)
);
