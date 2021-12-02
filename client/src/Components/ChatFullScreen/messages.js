import { defineMessages } from "react-intl";

const messages = defineMessages({
  searchPatient: {
    id: "app.chatFullScreen.searchPatient",
    description: "Click Here to Go Home",
    defaultMessage: "Search Patient",
  },
  writeMessage: {
    id: "app.chatFullScreen.writeMessage",
    description: "Click Here to Go Home",
    defaultMessage: "Write Message...",
  },
  online: {
    id: "app.chatFullScreen.online",
    description: "Click Here to Go Home",
    defaultMessage: "online",
  },
  offline: {
    id: "app.chatFullScreen.offline",
    description: "Click Here to Go Home",
    defaultMessage: "offline",
  },
  typing: {
    id: "app.chatFullScreen.typing",
    description: "Click Here to Go Home",
    defaultMessage: "typing...",
  },
  cantDisplay: {
    id: "app.chatFullScreen.cantDisplay",
    description: "Click Here to Go Home",
    defaultMessage: "Message Cannot be Displayed",
  },

  today: {
    id: "app.chatFullScreen.today",
    description: "Click Here to Go Home",
    defaultMessage: "Today",
  },

  consultationFeeText: {
    id: "app.chatFullScreen.consultationFeeText.tooltip",
    description: "",
    defaultMessage: "Request Consultation Fee",
  },
  blockChatMessage: {
    id: "app.chatFullScreen.blockChatMessage",
    description: "",
    defaultMessage: "Disable Chat",
  },
  unblockChatMessage: {
    id: "app.chatFullScreen.unblockChatMessage",
    description: "",
    defaultMessage: "Enable Chat",
  },
  blockVideoCall: {
    id: "app.chatFullScreen.blockVideoCall",
    description: "",
    defaultMessage: "Disable Call",
  },
  unblockVideoCall: {
    id: "app.chatFullScreen.unblockVideoCall",
    description: "",
    defaultMessage: "Enable Call",
  },
  chatBlockedMessage: {
    id: "app.chatFullScreen.chatBlockedMessage",
    description: "",
    defaultMessage:
      "Chat is disabled for this patient. Please enable chat to send message.",
  },
  callBlockedMessage: {
    id: "app.chatFullScreen.callBlockedMessage",
    description: "",
    defaultMessage: "Call disabled",
  },
  errorInBlockingChatPermission: {
    id: "app.chatFullScreen.errorInBlockingChatPermission",
    description: "",
    defaultMessage: "Error in disabling chat for patient.",
  },
  errorInBlockingVideoPermission: {
    id: "app.chatFullScreen.errorInBlockingVideoPermission",
    description: "",
    defaultMessage: "Error in disabling call for patient.",
  },
  successInBlockingChatPermission: {
    id: "app.chatFullScreen.successInBlockingChatPermission",
    description: "",
    defaultMessage: "Disabled chat for patient.",
  },
  successInBlockingVideoPermission: {
    id: "app.chatFullScreen.successInBlockingVideoPermission",
    description: "",
    defaultMessage: "Disabled call for patient.",
  },
  errorInUnBlockingChatPermission: {
    id: "app.chatFullScreen.errorInUnBlockingChatPermission",
    description: "",
    defaultMessage: "Error in enabling chat for patient.",
  },
  errorInUnBlockingVideoPermission: {
    id: "app.chatFullScreen.errorInUnBlockingVideoPermission",
    description: "",
    defaultMessage: "Error in enabling call for patient.",
  },
  successInUnBlockingChatPermission: {
    id: "app.chatFullScreen.successInUnBlockingChatPermission",
    description: "",
    defaultMessage: "Enabled chat for patient.",
  },
  successInUnBlockingVideoPermission: {
    id: "app.chatFullScreen.successInUnBlockingVideoPermission",
    description: "",
    defaultMessage: "Enabled call for patient.",
  },
  videoCallBlocked: {
    id: "app.chatFullScreen.call.videoCallBlocked",
    description: "",
    defaultMessage:
      "You can not call this user as call feature is disabled for this user.",
  },
  newPaymentAddedNotify: {
    id: "app.chatFullScreen.newPaymentAddedNotify",
    description: "",
    defaultMessage: "Payment request for {name} is added.",
  },
  newDocumentUploadedNotify: {
    id: "app.chatFullScreen.newDocumentUploadedNotify",
    description: "",
    defaultMessage: "A new document is uploaded. Tap here to know more.",
  },
  defaultNewMessage: {
    id: "app.chatFullScreen.defaultNewMessage",
    description: "",
    defaultMessage: "---",
  },
  waitingForPatient: {
    id: "app.chatFullScreen.waitingForPatient",
    description: "",
    defaultMessage: "Waiting for {name} to connect",
  },
  startCall: {
    id: "app.chatFullScreen.startCall",
    description: "",
    defaultMessage: "Start Call",
  },
  endCall: {
    id: "app.chatFullScreen.endCall",
    description: "",
    defaultMessage: "End Call",
  },
  muteAudio: {
    id: "app.chatFullScreen.muteAudio",
    description: "",
    defaultMessage: "Mute",
  },
  unMuteAudio: {
    id: "app.chatFullScreen.unMuteAudio",
    description: "",
    defaultMessage: "Un-Mute",
  },
  disableVideo: {
    id: "app.chatFullScreen.disableVideo",
    description: "",
    defaultMessage: "Disable Video",
  },
  enableVideo: {
    id: "app.chatFullScreen.enableVideo",
    description: "",
    defaultMessage: "Enable Video",
  },
  readyToCall: {
    id: "app.chatFullScreen.readyToCall",
    description: "",
    defaultMessage: "Ready to call",
  },
  audioCheck: {
    id: "app.chatFullScreen.audioCheck",
    description: "",
    defaultMessage: "Audio Check",
  },
  checkAudioVideo: {
    id: "app.chatFullScreen.checkAudioVideo",
    description: "",
    defaultMessage: "Check your audio and video",
  },
  audioOff: {
    id: "app.chatFullScreen.audioOff",
    description: "",
    defaultMessage: "Audio is Off",
  },
  videoOff: {
    id: "app.chatFullScreen.videoOff",
    description: "",
    defaultMessage: "Video is Off",
  },
  adhereLive: {
    id: "app.chatFullScreen.adhereLive",
    description: "",
    defaultMessage: "Adhere.Live",
  },
  LocalNetworkIssue: {
    id: "app.video.call.local.network.issue",
    description: "",
    defaultMessage:
      "Slow internet connection. Please check your internet settings",
  },
  RemoteNetworkIssue: {
    id: "app.video.call.remote.network.issue",
    description: "",
    defaultMessage:
      "{name} has either disconnected or internet connection is down.",
  },
});

export default messages;
