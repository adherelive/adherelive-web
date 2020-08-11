import { connect } from "react-redux";
import ChatPopUp from "../../Components/ChatPopup";

import { fetchChatAccessToken } from "../../modules/twilio";

import { closePopUp, minimizePopUp, maximizePopUp } from "../../modules/chat";

const mapStateToProps = state => {
    const { twilio, users, auth: { authenticated_user = 1 } = {}, chats } = state;
    return { twilio, users, authenticated_user, chats };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchChatAccessToken: userId => dispatch(fetchChatAccessToken(userId)),
        minimizePopUp: () => dispatch(minimizePopUp()),
        closePopUp: () => dispatch(closePopUp()),
        maximizePopUp: () => dispatch(maximizePopUp())
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatPopUp);
