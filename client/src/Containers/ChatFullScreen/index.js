import { withRouter } from "react-router-dom";
import ChatFullScreen from "../../Components/ChatFullScreen";
import { connect } from "react-redux";
import { getAllFeatures } from "../../modules/featuresMappings";

const mapStateToProps = state => {
  const {
    auth: { authPermissions = [], authenticated_user = 1 } = {},
    users = {},
    patients = {},
    doctors = {},
    features = {},
    features_mappings = {}
  } = state;
  return {
    users,
    patients,
    doctors,
    authPermissions,
    authenticated_user,
    features,
    features_mappings
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllFeatures: () => dispatch(getAllFeatures())
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ChatFullScreen)
);
