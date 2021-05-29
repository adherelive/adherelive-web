import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Sidebar from "../../Components/Sidebar";
import { authCategorySelector } from "../../modules/doctors/selectors";

const mapStateToProps = state => {
    const { auth, users, doctors, providers } = state;

    const {
        authenticated,
        authenticated_user,
        authRedirection,
        authPermissions = [],
        doctor_provider_id = null,
      } = auth;


      
    return {
        authenticated,
        authPermissions,
        authRedirection,
        authenticated_user,
        users,
        doctors,
        doctor_provider_id,
        providers,
        // auth_role,
        authDoctor: authCategorySelector(state)
    
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Sidebar)
);