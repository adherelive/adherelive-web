import { connect } from "react-redux";
import ChatPopUp from "../../Components/ChatPopup";

import { fetchChatAccessToken } from "../../modules/twilio";
import { getSymptomDetails } from "../../modules/symptoms";

import { addMessageOfChat } from "../../modules/chatMessages";
import { closePopUp, minimizePopUp, maximizePopUp } from "../../modules/chat";

const mapStateToProps = state => {
    const { twilio, users, auth: { authenticated_user = 1 } = {}, chats, chatMessages, symptoms, upload_documents } = state;
    return { twilio, users, authenticated_user, chats, chatMessages, symptoms, upload_documents };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchChatAccessToken: userId => dispatch(fetchChatAccessToken(userId)),
        minimizePopUp: () => dispatch(minimizePopUp()),
        closePopUp: () => dispatch(closePopUp()),
        getSymptomDetails: (id) => dispatch(getSymptomDetails(id)),
        maximizePopUp: () => dispatch(maximizePopUp()),
        getSymptomDetails: (data) => dispatch(getSymptomDetails(data)),
        addMessageOfChat: (roomId, messages) => dispatch(addMessageOfChat(roomId, messages))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatPopUp);
