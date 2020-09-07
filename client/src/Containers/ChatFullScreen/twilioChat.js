import { connect } from "react-redux";
import TwilioChat from "../../Components/ChatFullScreen/twilioChat";

import { fetchChatAccessToken } from "../../modules/twilio";
import { getSymptomDetails } from "../../modules/symptoms";
import { addMessageOfChat } from "../../modules/chatMessages";

const mapStateToProps = state => {
  const { twilio, users, auth: { authenticated_user = 1 } = {}, chatMessages, symptoms, upload_documents } = state;
  return { twilio, users, authenticated_user, chatMessages, symptoms, upload_documents };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchChatAccessToken: userId => dispatch(fetchChatAccessToken(userId)),
    addMessageOfChat: (roomId, messages) => dispatch(addMessageOfChat(roomId, messages)),
    getSymptomDetails: (data) => dispatch(getSymptomDetails(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TwilioChat);
