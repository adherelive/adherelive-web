import { connect } from "react-redux";
import TwilioChat from "../../Components/ChatFullScreen/twilioChat";

import { fetchChatAccessToken } from "../../modules/twilio";
import { addMessageOfChat } from "../../modules/chatMessages";

const mapStateToProps = state => {
  const { twilio, users, auth: { authenticated_user = 1 } = {}, chatMessages } = state;
  return { twilio, users, authenticated_user, chatMessages };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchChatAccessToken: userId => dispatch(fetchChatAccessToken(userId)),
    addMessageOfChat: (roomId, messages) => dispatch(addMessageOfChat(roomId, messages))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TwilioChat);
