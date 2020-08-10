import { withRouter } from "react-router-dom";
import ChatFullScreen from "../../Components/ChatFullScreen";
import { connect } from "react-redux";

const mapStateToProps = state => {
    console.log("4658468456666666848653653465468");
    const { auth: { authPermissions = [], authenticated_user = 1 } = {}, users = {}, patients = {}, doctors = {} } = state;
    return {
        users,
        patients,
        doctors,
        authPermissions,
        authenticated_user
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(ChatFullScreen)
);
