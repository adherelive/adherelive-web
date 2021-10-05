import {connect} from "react-redux";
import AgoraVideo from "../../Components/ChatFullScreen/agoraVideo";
import {fetchVideoAccessToken, missedCall, startCall} from "../../modules/agora";

const mapStateToProps = state => {
    const {agora = {}, users = {}, auth = {}, patients = {}, doctors = {}} = state;
    return {agora, users, auth, patients, doctors};
};

const mapDispatchToProps = dispatch => {
    return {
        fetchVideoAccessToken: userId => dispatch(fetchVideoAccessToken(userId)),
        startCall: (roomId) => () => dispatch(startCall(roomId)),
        missedCall: (roomId) => () => dispatch(missedCall(roomId)),
    };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const {
        agora, users, auth, patients, doctors
    } = stateProps || {};

    const {fetchVideoAccessToken, startCall, missedCall} = dispatchProps || {};

    const {match: {params: {room_id} = {}} = {}} = ownProps || {};

    return {
        agora, users, auth, patients, doctors,
        fetchVideoAccessToken,
        room_id,
        startCall: startCall(room_id),
        missedCall: missedCall(room_id)
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(AgoraVideo);
