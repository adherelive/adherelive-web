import { connect } from "react-redux";
import AgoraVideo from "../../Components/ChatFullScreen/agoraVideo";
import { fetchVideoAccessToken } from "../../modules/agora";

const mapStateToProps = state => {
    const { agora = {}, users = {}, auth = {}, patients = {}, doctors = {} } = state;
    return { agora, users, auth, patients, doctors };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchVideoAccessToken: userId => dispatch(fetchVideoAccessToken(userId)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AgoraVideo);
