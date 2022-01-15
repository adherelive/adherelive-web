import { connect } from "react-redux";
import TwilioVideo from "../../Components/ChatFullScreen/twilioVideo";

import { fetchVideoAccessToken } from "../../modules/twilio";
// import {
//     fetchEventUsers,
//     addVideoRoomParticipantsInEvent
// } from "../../modules/events";

const mapStateToProps = (state) => {
  const {
    twilio,
    users,
    auth: { authenticated_user = 1 } = {},
    patients = {},
  } = state;
  console.log("=============twilioVideoJS=====================");
  console.log({ twilio, users, authenticated_user, patients });
  console.log("==================================");
  return { twilio, users, authenticated_user, patients };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchVideoAccessToken: (userId) => dispatch(fetchVideoAccessToken(userId)),
    // fetchEventUsers: eventId => dispatch(fetchEventUsers(eventId)),
    // addVideoRoomParticipantsInEvent: (eventId, userOne, userTwo) =>
    //     dispatch(addVideoRoomParticipantsInEvent(eventId, userOne, userTwo))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TwilioVideo);
