import { connect } from "react-redux";
import Routes from "../../Routes";
import { getInitialData } from "../../modules/auth";
import { open } from "../../modules/drawer";
import { DRAWER } from "../../constant";

const mapStateToProps = state => {
  const { auth, users, doctors , providers = {} } = state;
  const { authenticated, authenticated_user, authRedirection, authPermissions = [] , doctor_provider_id  = null  } = auth;
  
    return { authenticated, authPermissions, authRedirection, authenticated_user, users, doctors , doctor_provider_id , providers };
  
};

const mapDispatchToProps = dispatch => {
  return {
    openAppointmentDrawer: (payload) => dispatch(open({ type: DRAWER.NOTIFICATIONS, payload })),
    getInitialData: () => dispatch(getInitialData()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
