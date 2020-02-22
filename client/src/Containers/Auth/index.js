import AuthRoute from "../../Routes/Auth";
import { connect } from "react-redux";
import { makeGetUserById } from "../../modules/user/selector";

const mapStateToProps = state => {
    const { auth, users } = state;
    const getUser = makeGetUserById();
    return {
        // user_data: getUser(users, auth.authenticated_user)
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AuthRoute);
