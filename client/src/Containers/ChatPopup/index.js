import { connect } from "react-redux";
import ChatPopUp from "../../Components/ChatPopup";

import { fetchChatAccessToken } from "../../modules/twilio";
import { getSymptomDetails } from "../../modules/symptoms";

import { getVitalOccurence } from "../../modules/vital_occurence";

import {
  addMessageOfChat,
  raiseChatNotification,
} from "../../modules/chatMessages";
import { closePopUp, minimizePopUp, maximizePopUp } from "../../modules/chat";
import {
  getAllFeatures,
  toggleChatPermission,
  toggleVideoPermission,
} from "../../modules/featuresMappings";

const mapStateToProps = (state) => {
  const {
    twilio,
    users,
    auth: { authenticated_user = 1, authenticated_category } = {},
    chats,
    chatMessages,
    symptoms,
    upload_documents,
    doctors,
    patients,
    features = {},
    features_mappings = {},
    // AKSHAY NEW CODE IMPLEMENTATION STARTED
    care_plans,
    drawer: { visible, data: { type, payload = {} } = {} },
    // AKSHAY NEW CODE IMPLEMENTATION ENDED
  } = state;
  return {
    twilio,
    users,
    authenticated_user,
    chats,
    chatMessages,
    symptoms,
    upload_documents,
    doctors,
    patients,
    features,
    features_mappings,
    authenticated_category,
    care_plans,
    payload,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchChatAccessToken: (userId) => dispatch(fetchChatAccessToken(userId)),
    minimizePopUp: () => dispatch(minimizePopUp()),
    closePopUp: () => dispatch(closePopUp()),
    // getSymptomDetails: (id) => dispatch(getSymptomDetails(id)),
    maximizePopUp: () => dispatch(maximizePopUp()),
    getSymptomDetails: (data) => dispatch(getSymptomDetails(data)),
    addMessageOfChat: (roomId, messages) =>
      dispatch(addMessageOfChat(roomId, messages)),
    getVitalOccurence: () => dispatch(getVitalOccurence()),
    getAllFeatures: () => dispatch(getAllFeatures()),
    toggleChatPermission: (patientId, data) =>
      dispatch(toggleChatPermission(patientId, data)),
    toggleVideoPermission: (patientId, data) =>
      dispatch(toggleVideoPermission(patientId, data)),
    raiseChatNotification: (data) => dispatch(raiseChatNotification(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatPopUp);
