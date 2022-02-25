import { connect } from "react-redux";
import TwilioChat from "../../Components/ChatFullScreen/twilioChat";
import { getSymptomDetails } from "../../modules/symptoms";
import { getDoctorPaymentProduct } from "../../modules/doctors";
import { getVitalOccurence } from "../../modules/vital_occurence";

import { fetchChatAccessToken } from "../../modules/twilio";
import {
  addMessageOfChat,
  raiseChatNotification,
} from "../../modules/chatMessages";

import {
  toggleChatPermission,
  toggleVideoPermission,
  getAllFeatures,
} from "../../modules/featuresMappings";

const mapStateToProps = (state) => {
  const {
    twilio,
    users,
    auth: { authenticated_user = 1, authenticated_category } = {},
    chatMessages,
    symptoms,
    upload_documents,
    doctors,
    patients,
    features = {},
    features_mappings = {},
    //AKSHAY NEW CODE IMPLEMENTATIONS
    care_plans,
  } = state;
  return {
    twilio,
    users,
    authenticated_user,
    chatMessages,
    symptoms,
    upload_documents,
    doctors,
    patients,
    features,
    features_mappings,
    authenticated_category,
    care_plans,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchChatAccessToken: (userId) => dispatch(fetchChatAccessToken(userId)),
    addMessageOfChat: (roomId, messages) =>
      dispatch(addMessageOfChat(roomId, messages)),
    getSymptomDetails: (data) => dispatch(getSymptomDetails(data)),
    getVitalOccurence: () => dispatch(getVitalOccurence()),
    getDoctorConsultations: () => dispatch(getDoctorPaymentProduct()),
    toggleChatPermission: (patientId, data) =>
      dispatch(toggleChatPermission(patientId, data)),
    toggleVideoPermission: (patientId, data) =>
      dispatch(toggleVideoPermission(patientId, data)),
    getAllFeatures: () => dispatch(getAllFeatures()),
    raiseChatNotification: (data) => dispatch(raiseChatNotification(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TwilioChat);
