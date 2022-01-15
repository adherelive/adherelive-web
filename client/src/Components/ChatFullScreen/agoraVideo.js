import React, { Component } from "react";
import { injectIntl } from "react-intl";
import AgoraRTC from "agora-rtc-sdk-ng";

import { getDoctorFromRoomId, getPatientFromRoomId } from "../../Helper/twilio";

import config from "../../config";
// import StartCallIcon from "../../Assets/images/ico-vc-start-call.png";
import EndCallIcon from "../../Assets/images/ico-vc-end-call.png";
import AudioIcon from "../../Assets/images/ico-vc-audio.png";
import AudioDisabledIcon from "../../Assets/images/ico-vc-audio-off.png";
import VideoIcon from "../../Assets/images/ico-vc-video.png";
import VideoDisabledIcon from "../../Assets/images/ico-vc-video-off.png";
import UserDpPlaceholder from "../../Assets/images/ico-placeholder-userdp.svg";
import { USER_CATEGORY, LOCAL_STORAGE } from "../../constant";
import messages from "./messages";
import Loading from "../Common/Loading";
import Tooltip from "antd/es/tooltip";
import { Button } from "antd";
import firebase from "firebase/app";
import "firebase/analytics";
import * as FirebaseHelper from "../../Helper/firebase";

export const AGORA_CONNECTION_STATE = {
  RECONNECTING: "RECONNECTING",
};

const NETWORK_QUALITY = {
  UNKNOWN: 0,
  EXCELLENT: 1,
  GOOD: 2,
  POOR: 3,
  BAD: 4,
  VBAD: 5,
  DOWN: 6,
  UNSUPPORTED: 7,
  DETECTING: 8,
};

const ERROR_TYPES = {
  ERROR_CALLBACK: "ERROR_CALLBACK",
  SHARE_AUDIO: "SHARE_AUDIO",
  SHARE_VIDEO: "SHARE_VIDEO",
  NETWORK_ISSUE: "NETWORK_ISSUE",
  START_CALL: "START_CALL",
  END_CALL: "END_CALL",
};

class AgoraVideo extends Component {
  constructor(props) {
    super(props);

    this.rtc = {
      client: null,
      localAudioTrack: null,
      localVideoTrack: null,
      remoteAudioTrack: null,
      remoteVideoTrack: null,
    };

    this.state = {
      loading: false,
      selfUid: null,
      isVideoOn: true,
      isAudioOn: true,
      isStart: false,
      remoteAdded: false,
      remoteDisconnect: false,
      networkIssueFor: null,
    };

    const {
      auth: {
        firebase_keys: { apiKey, appId, projectId, measurementId } = {},
      } = {},
    } = props;

    const firebaseConfig = {
      authDomain: `${projectId}.firebaseapp.com`,
      databaseURL: `https://${projectId}.firebaseio.com`,
      storageBucket: `${projectId}.appspot.com`,
      appId,
      apiKey,
      projectId,
      measurementId,
    };

    firebase.initializeApp(firebaseConfig);
    this.analytics = firebase.analytics();
  }

  async componentDidMount() {
    await this.initialSetup();
  }

  initialSetup = async () => {
    try {
      const { fetchVideoAccessToken, room_id } = this.props;

      let token = await fetchVideoAccessToken(getPatientFromRoomId(room_id));
      console.log(token);

      await fetchVideoAccessToken(getPatientFromRoomId(room_id));
      await this.init();
      await this.startVideoCall();

      const urlParams = new URLSearchParams(window.location.search);
      const isAudioOnParam = urlParams.get("isAudioOn") === "true";
      const isVideoOnParam = urlParams.get("isVideoOn") === "true";
      const localAudioVal = localStorage.getItem(
        LOCAL_STORAGE.LOCAL_IS_AUDIO_ON
      );
      const localVideoVal = localStorage.getItem(
        LOCAL_STORAGE.LOCAL_IS_VIDEO_ON
      );
      const localAudioBoolean = localAudioVal === "true";
      const localVideoBoolean = localVideoVal === "true";

      if (
        (!localAudioVal && !isAudioOnParam) ||
        (localAudioVal && !localAudioBoolean)
      ) {
        await this.setAudioOff();
      }

      if (
        (!localVideoVal && !isVideoOnParam) ||
        (localVideoVal && !localVideoBoolean)
      ) {
        await this.setfVideoOff();
      }
    } catch (error) {
      console.log("error in initial video call setup===>", error);
    }
  };

  componentWillUnmount() {
    this.rtc.client.removeAllListeners();
  }

  formatMessage = (message, data) =>
    this.props.intl.formatMessage(message, data);

  getVideoOptions = () => {
    const { agora: { video_token } = {}, room_id } = this.props;

    return {
      appId: config.AGORA_APP_ID,
      channel: room_id,
      token: video_token,
    };
  };

  init = () => {
    const { auth: { authenticated_user } = {}, room_id } = this.props;
    const { networkIssueFor } = this.state;

    this.rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "h264" });

    this.rtc.client.on("user-published", async (user, mediaType) => {
      // Subscribe to a remote user.
      await this.rtc.client.subscribe(user, mediaType);

      this.setState({
        remoteAdded: true,
        remoteUid: user.uid,
        networkIssueFor: null,
      });

      // If the subscribed track is video.
      if (mediaType === "video") {
        this.remoteVideoTrack = user.videoTrack;

        const playerContainer = document.createElement("div");
        playerContainer.className = "videoPlayer";
        playerContainer.id = user.uid.toString();
        const childContainer1 = document.getElementById("agora-remote");
        childContainer1.appendChild(playerContainer);
        this.remoteVideoTrack.play(playerContainer);
      }

      if (mediaType === "audio") {
        this.remoteAudioTrack = user.audioTrack;
        this.remoteAudioTrack.play();
      }
    });

    this.rtc.client.on("user-unpublished", (user) => {
      const playerContainer = document.getElementById(user.uid);
      playerContainer && playerContainer.remove();
      this.setState({ remoteAdded: false });
    });

    this.rtc.client.on("exception", (error) => {
      console.log("29810321 error", error);
      FirebaseHelper.logEvent({
        client: this.analytics,
        type: ERROR_TYPES.ERROR_CALLBACK,
        user: authenticated_user,
        channel: room_id,
      });
    });

    this.rtc.client.on(
      "network-quality",
      ({ uplinkNetworkQuality, downlinkNetworkQuality }) => {
        if (
          uplinkNetworkQuality >= NETWORK_QUALITY.BAD ||
          downlinkNetworkQuality >= NETWORK_QUALITY.BAD
        ) {
          FirebaseHelper.logEvent({
            client: this.analytics,
            type: ERROR_TYPES.NETWORK_ISSUE,
            user: authenticated_user,
            channel: room_id,
          });
        }

        if (
          uplinkNetworkQuality >= NETWORK_QUALITY.POOR ||
          downlinkNetworkQuality >= NETWORK_QUALITY.POOR
        ) {
          this.setState({ networkIssueFor: `${authenticated_user}` });
        } else {
          // if (networkIssueFor !== null) {
          this.setState({ networkIssueFor: null });
          // }
        }
      }
    );

    this.rtc.client.on("connection-state-change", (data) => {
      if (data === AGORA_CONNECTION_STATE.RECONNECTING) {
        // this.setState({networkIssue: true});
        FirebaseHelper.logEvent({
          client: this.analytics,
          type: ERROR_TYPES.NETWORK_ISSUE,
          user: authenticated_user,
          channel: room_id,
        });
      } else {
        // this.setState({networkIssue: false});
      }
    });

    this.rtc.client.on("user-left", (user) => {
      this.setState({ networkIssueFor: `${user.uid}` });
    });
  };

  publishTrack = async () => {
    this.rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    this.rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    await this.rtc.client.publish([
      this.rtc.localAudioTrack,
      this.rtc.localVideoTrack,
    ]);
  };

  startVideoCall = async () => {
    const {
      auth: { authenticated_user, auth_role = null } = {},
      startCall,
      room_id,
    } = this.props;
    console.log("this.props", this.props);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const isAudioOnParam = urlParams.get("isAudioOn") === "true";
      const isVideoOnParam = urlParams.get("isVideoOn") === "true";
      const localAudioVal = localStorage.getItem(
        LOCAL_STORAGE.LOCAL_IS_AUDIO_ON
      );
      const localVideoVal = localStorage.getItem(
        LOCAL_STORAGE.LOCAL_IS_VIDEO_ON
      );

      const { appId, channel, token } = this.getVideoOptions();
      console.log("appId", appId);
      console.log("channel", channel);
      console.log("token", token);
      console.log("authenticated_user", authenticated_user);
      console.log("auth_role", auth_role);

      this.setState({ loading: true });
      const uid = await this.rtc.client.join(
        appId,
        channel,
        token,
        auth_role
        // authenticated_user
      );
      await this.publishTrack();
      this.setState({ selfUid: uid });

      // notify other participant
      await startCall();

      if ((!localVideoVal && isVideoOnParam) || localVideoVal === "true") {
        // console.log("237642354623542387",{isVideoOnParam,flag1:(!localVideoVal && isVideoOnParam),flag2:(localVideoVal === "true")});

        this.rtc.localVideoTrack.play("agora-self");
      }

      const playerContainer = document.createElement("div");
      playerContainer.className = "videoPlayer";
      playerContainer.id = uid.toString();
      this.setState({ loading: false, isStart: true });
      const isAudioOnFlag =
        (!localAudioVal && isAudioOnParam) || localAudioVal === "true";
      // console.log("87345275632465236",{isAudioOnFlag});
      if (!isAudioOnFlag) {
        this.setAudioOff();
      }
    } catch (error) {
      FirebaseHelper.logEvent({
        client: this.analytics,
        type: ERROR_TYPES.START_CALL,
        user: authenticated_user,
        channel: room_id,
      });
    }
  };

  leaveCall = async () => {
    const {
      auth: { authenticated_user } = {},
      missedCall,
      room_id,
    } = this.props;
    try {
      const { remoteAdded } = this.state;
      // const { rtc, options } = this;
      await this.rtc.localVideoTrack.close();
      await this.rtc.localAudioTrack.close();

      this.rtc.client.remoteUsers.forEach((user) => {
        const playerContainer = document.getElementById(user.uid);
        playerContainer && playerContainer.remove();
      });
      this.setState({ loading: true });
      await this.rtc.client.leave();

      // notify missed call to other participant
      if (!remoteAdded) {
        await missedCall();
      }

      // this.setState({
      //   remoteUid: null,
      //   isStart: false,
      //   remoteAdded: false,
      //   loading: false
      // });

      localStorage.removeItem(LOCAL_STORAGE.LOCAL_IS_AUDIO_ON);
      localStorage.removeItem(LOCAL_STORAGE.LOCAL_IS_VIDEO_ON);
      window.close();
    } catch (error) {
      FirebaseHelper.logEvent({
        client: this.analytics,
        type: ERROR_TYPES.END_CALL,
        user: authenticated_user,
        channel: room_id,
      });
    }
  };

  toggleVideo = async () => {
    const { auth: { authenticated_user } = {}, room_id } = this.props;
    const { isVideoOn } = this.state;
    const newState = !isVideoOn;
    await this.rtc.localVideoTrack.setEnabled(!isVideoOn);
    this.setState({ isVideoOn: !isVideoOn });
    localStorage.setItem(LOCAL_STORAGE.LOCAL_IS_VIDEO_ON, newState);

    if (newState) {
      try {
        this.rtc.localVideoTrack.play("agora-self");
      } catch (error) {
        FirebaseHelper.logEvent({
          client: this.analytics,
          type: ERROR_TYPES.SHARE_VIDEO,
          user: authenticated_user,
          channel: room_id,
        });
      }
    }
  };

  setfVideoOff = async () => {
    const { auth: { authenticated_user } = {}, room_id } = this.props;
    try {
      await this.rtc.localVideoTrack.setEnabled(false);
      this.setState({ isVideoOn: false });
    } catch (error) {
      FirebaseHelper.logEvent({
        client: this.analytics,
        type: ERROR_TYPES.SHARE_VIDEO,
        user: authenticated_user,
        channel: room_id,
      });
    }
  };

  setAudioOff = async () => {
    const { auth: { authenticated_user } = {}, room_id } = this.props;
    try {
      await this.rtc.localAudioTrack.setEnabled(false);
      this.setState({ isAudioOn: false });
    } catch (error) {
      FirebaseHelper.logEvent({
        client: this.analytics,
        type: ERROR_TYPES.SHARE_AUDIO,
        user: authenticated_user,
        channel: room_id,
      });
    }
  };

  toggleAudio = async () => {
    const { auth: { authenticated_user } = {}, room_id } = this.props;
    try {
      const { isAudioOn } = this.state;
      const newState = !isAudioOn;
      await this.rtc.localAudioTrack.setEnabled(!isAudioOn);
      this.setState({ isAudioOn: !isAudioOn });
      localStorage.setItem(LOCAL_STORAGE.LOCAL_IS_AUDIO_ON, newState);
    } catch (error) {
      FirebaseHelper.logEvent({
        client: this.analytics,
        type: ERROR_TYPES.SHARE_AUDIO,
        user: authenticated_user,
        channel: room_id,
      });
    }
  };

  getVideoParticipants = () => {
    const {
      room_id,
      doctors,
      patients,
      auth: { authenticated_category } = {},
    } = this.props;

    const patientUserId = getPatientFromRoomId(room_id);
    const doctorUserId = getDoctorFromRoomId(room_id);

    let remoteData = {};
    let selfData = {};

    // selfUid
    if (
      authenticated_category === USER_CATEGORY.DOCTOR ||
      authenticated_category === USER_CATEGORY.HSP
    ) {
      Object.keys(doctors).forEach((id) => {
        const { basic_info: { user_id } = {} } = doctors[id] || {};
        if (`${user_id}` === doctorUserId) {
          selfData = doctors[id] || {};
        }
      });

      Object.keys(patients).forEach((id) => {
        const { basic_info: { user_id } = {} } = patients[id] || {};
        if (`${user_id}` === patientUserId) {
          remoteData = patients[id] || {};
        }
      });
    } else {
      // todo: to modify and refractor based on future requirements
    }

    return { remoteData, selfData };
  };

  getVideoButtons = () => {
    const { isStart = false, isVideoOn } = this.state;
    const { toggleVideo, formatMessage } = this;

    if (!isStart) {
      return null;
    }

    return (
      <div className="ml24">
        {isVideoOn ? (
          <Tooltip
            title={formatMessage(messages.disableVideo)}
            placement={"top"}
          >
            <img src={VideoIcon} onClick={toggleVideo} alt="chatIcon" />
          </Tooltip>
        ) : (
          <Tooltip
            title={formatMessage(messages.enableVideo)}
            placement={"top"}
          >
            <img src={VideoDisabledIcon} onClick={toggleVideo} alt="chatIcon" />
          </Tooltip>
        )}
      </div>
    );
  };

  getAudioButtons = () => {
    const { isStart = false, isAudioOn } = this.state;
    const { toggleAudio, formatMessage } = this;

    if (!isStart) {
      return null;
    }

    return (
      <div className="ml24">
        {isAudioOn ? (
          <Tooltip title={formatMessage(messages.muteAudio)} placement={"top"}>
            <img src={AudioIcon} onClick={toggleAudio} alt="chatIcon" />
          </Tooltip>
        ) : (
          <Tooltip
            title={formatMessage(messages.unMuteAudio)}
            placement={"top"}
          >
            <img src={AudioDisabledIcon} onClick={toggleAudio} alt="chatIcon" />
          </Tooltip>
        )}
      </div>
    );
  };

  getCallButtons = () => {
    const { isStart } = this.state;
    const { startVideoCall, leaveCall, formatMessage } = this;

    return (
      <div className={`${isStart ? "ml24" : null}`}>
        {!isStart ? (
          // <Tooltip title={formatMessage(messages.startCall)} placement={"top"}>
          //   <img
          //     src={StartCallIcon}
          //     onClick={startVideoCall}
          //     alt="chatIcon"
          //     className="pointer"
          //   />
          // </Tooltip>
          <Button type={"primary"} className={"mb40"} onClick={startVideoCall}>
            {formatMessage(messages.startCall)}
          </Button>
        ) : (
          <Tooltip title={formatMessage(messages.endCall)} placement={"top"}>
            <img
              src={EndCallIcon}
              onClick={leaveCall}
              alt="chatIcon"
              className="pointer"
            />
          </Tooltip>
        )}
      </div>
    );
  };

  getNetworkIssueCard = () => {
    const { auth: { authenticated_user } = {} } = this.props;
    const { networkIssueFor } = this.state;
    const { formatMessage, getVideoParticipants } = this;

    // todo: change this way for name when working on group chat
    if (!networkIssueFor) {
      return null;
    }

    const { remoteData: { basic_info: { full_name } = {} } = {} } =
      getVideoParticipants();

    const isRemote = networkIssueFor !== `${authenticated_user}` ? true : false;

    return (
      <div className="fs16 p10 text-white tac bg_black-65">
        {isRemote
          ? formatMessage(
              { ...messages.RemoteNetworkIssue },
              { name: full_name }
            )
          : formatMessage(messages.LocalNetworkIssue)}
      </div>
    );
  };

  render() {
    const { isStart, remoteAdded, loading } = this.state;
    const {
      getVideoParticipants,
      formatMessage,
      getVideoButtons,
      getAudioButtons,
      getCallButtons,
      getNetworkIssueCard,
    } = this;

    const {
      remoteData: {
        basic_info: { full_name } = {},
        details: { profile_pic } = {},
      } = {},
    } = getVideoParticipants();

    return (
      <div className="wp100 hp100 bg-black relative">
        {/*   SELF VIEW   */}
        <div id={"agora-self"} className="wp25 h200 fixed b20 r20 z999"></div>

        {/*   REMOTE VIEW   */}
        <div id={"agora-remote"} className="wp100 hp100">
          {getNetworkIssueCard()}

          {loading && (
            <div className="hp100 wp100 flex direction-column align-center justify-center z1">
              <Loading className={"wp100"} color="white" />
            </div>
          )}
          {!remoteAdded && (
            <div className="flex direction-column align-center justify-center hp100 ">
              <img
                src={profile_pic || UserDpPlaceholder}
                className="pointer h80 w80 br50 "
                alt="userDp"
              />

              <div className="text-white mt20">
                {isStart ? (
                  <span>
                    {formatMessage(
                      {
                        ...messages.waitingForPatient,
                      },
                      { name: full_name }
                    )}
                  </span>
                ) : (
                  <span>{full_name}</span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="absolute b10 wp100 flex justify-center ">
          {/*   AUDIO   */}
          {getAudioButtons()}

          {/*   CALL   */}
          {!loading && getCallButtons()}

          {/*   VIDEO   */}
          {getVideoButtons()}
        </div>
      </div>
    );
  }
}

export default injectIntl(AgoraVideo);
