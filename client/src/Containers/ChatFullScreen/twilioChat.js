import { connect } from "react-redux";
import TwilioChat from "../../Components/ChatFullScreen/twilioChat";

import { fetchChatAccessToken } from "../../modules/twilio";
// import { fetchEventUsers } from "../../modules/events";

const mapStateToProps = state => {
  const { twilio, users ,auth:{authenticated_user=1}={}} = state;
  return { twilio, users,authenticated_user };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchChatAccessToken: userId => dispatch(fetchChatAccessToken(userId)),
    // fetchEventUsers: eventId => dispatch(fetchEventUsers(eventId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TwilioChat);
