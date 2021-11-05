import { connect } from "react-redux";
import ProviderAccountDetails from "../../Components/ProviderAccountDetails";
import { withRouter } from "react-router-dom";
import { getAccountDetails } from "../../modules/accountDetails";

const mapStateToProps = (state) => {
  const {
    auth = {},
    users = {},
    payment_products = {},
    auth: {
      authPermissions = [],
      authenticated_user = 1,
      authenticated_category,
    } = {},
    account_details = {},
    user_roles = {},
    providers = {},
  } = state;

  return {
    payment_products,
    auth,
    users,
    authPermissions,
    authenticated_user,
    authenticated_category,
    account_details,
    user_roles,
    providers,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAccountDetails: (provider_id = null) =>
      dispatch(getAccountDetails(provider_id)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProviderAccountDetails)
);
