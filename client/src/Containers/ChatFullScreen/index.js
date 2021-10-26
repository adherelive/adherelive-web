import { withRouter } from "react-router-dom";
import ChatFullScreen from "../../Components/ChatFullScreen";
import { connect } from "react-redux";
import { getAllFeatures } from "../../modules/featuresMappings";
import { resetNotificationRedirect } from "../../modules/notificationRedirect";

const mapStateToProps = (state) => {
  const {
    auth: {
      authPermissions = [],
      authenticated_user = 1,
      auth_role = null,
    } = {},
    users = {},
    patients = {},
    doctors = {},
    features = {},
    features_mappings = {},
    notification_redirect = {},
  } = state;
  return {
    users,
    patients,
    doctors,
    authPermissions,
    authenticated_user,
    features,
    features_mappings,
    notification_redirect,
    auth_role,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllFeatures: () => dispatch(getAllFeatures()),
    resetNotificationRedirect: () => dispatch(resetNotificationRedirect()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ChatFullScreen)
);
