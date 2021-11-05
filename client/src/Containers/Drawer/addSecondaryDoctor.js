import { connect } from "react-redux";
import AddSecondaryDoctorDrawer from "../../Components/Drawer/addSecondaryDoctor";
import { DRAWER } from "../../constant";
import { close } from "../../modules/drawer";
import { searchDoctorName } from "../../modules/doctors";
import { addSecondaryDoctorToCareplan } from "../../modules/carePlans";

const mapStateToProps = (state) => {
  const { auth } = state;
  const { authenticated_user, authenticated_category, auth_role = null } = auth;
  const {
    drawer: { visible, loading, data: { type, payload = {} } = {} },
    users = {},
    user_roles = {},
    providers = {},
    doctors = {},
  } = state;

  return {
    visible: visible && type === DRAWER.ADD_SECONDARY_DOCTOR,
    loading,
    payload,
    user_roles,
    providers,
    users,
    doctors,
    authenticated_user,
    auth_role,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    close: () => dispatch(close()),
    searchDoctorName: (name) => dispatch(searchDoctorName(name)),
    addSecondaryDoctorToCareplan: (payload) =>
      dispatch(addSecondaryDoctorToCareplan(payload)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddSecondaryDoctorDrawer);
