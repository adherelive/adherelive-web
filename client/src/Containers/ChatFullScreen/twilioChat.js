import { connect } from "react-redux";
import TwilioChat from "../../Components/ChatFullScreen/twilioChat";
import { getSymptomDetails } from "../../modules/symptoms";

import { fetchChatAccessToken } from "../../modules/twilio";
import { addMessageOfChat } from "../../modules/chatMessages";

const mapStateToProps = state => {
  const { twilio, users, auth: { authenticated_user = 1 } = {}, chatMessages, upload_documents = {}, symptoms = {} } = state;
  return { twilio, users, authenticated_user, chatMessages, upload_documents, symptoms };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchChatAccessToken: userId => dispatch(fetchChatAccessToken(userId)),
    getSymptomDetails: (id) => dispatch(getSymptomDetails(id)),
    addMessageOfChat: (roomId, messages) => dispatch(addMessageOfChat(roomId, messages))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TwilioChat);
