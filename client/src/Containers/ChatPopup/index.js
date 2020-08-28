import { connect } from "react-redux";
import ChatPopUp from "../../Components/ChatPopup";

import { fetchChatAccessToken } from "../../modules/twilio";

import { addMessageOfChat } from "../../modules/chatMessages";
import { closePopUp, minimizePopUp, maximizePopUp } from "../../modules/chat";

const mapStateToProps = state => {
    const { twilio, users, auth: { authenticated_user = 1 } = {}, chats, chatMessages } = state;
    return { twilio, users, authenticated_user, chats, chatMessages };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchChatAccessToken: userId => dispatch(fetchChatAccessToken(userId)),
        minimizePopUp: () => dispatch(minimizePopUp()),
        closePopUp: () => dispatch(closePopUp()),
        maximizePopUp: () => dispatch(maximizePopUp()),
        addMessageOfChat: (roomId, messages) => dispatch(addMessageOfChat(roomId, messages))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatPopUp);
