import React, { Component } from "react";
import { injectIntl } from "react-intl";
import AgoraRTC from "agora-rtc-sdk-ng";

import { getDoctorFromRoomId, getPatientFromRoomId } from "../../Helper/twilio";

import config from "../../config";
import StartCallIcon from "../../Assets/images/ico-vc-start-call.png";
import EndCallIcon from "../../Assets/images/ico-vc-end-call.png";
import AudioIcon from "../../Assets/images/ico-vc-audio.png";
import AudioDisabledIcon from "../../Assets/images/ico-vc-audio-off.png";
import VideoIcon from "../../Assets/images/ico-vc-video.png";
import VideoDisabledIcon from "../../Assets/images/ico-vc-video-off.png";
import UserDpPlaceholder from "../../Assets/images/ico-placeholder-userdp.svg";
import { USER_CATEGORY } from "../../constant";
import messages from "./messages";
import Loading from "../Common/Loading";
import Tooltip from "antd/es/tooltip";
import { Button } from "antd";

class AgoraVideo extends Component {
  constructor(props) {
    super(props);

    this.rtc = {
      client: null,
      localAudioTrack: null,
      localVideoTrack: null
    };

    this.state = {
      loading: false,
      selfUid: null,
      isVideoOn: true,
      isAudioOn: true,
      isStart: false,
      remoteAdded: false,
      remoteDisconnect: false
    };
  }

  async componentDidMount() {
    this.initialSetup();
  }

  initialSetup = async() => {
    try{

    const {
      fetchVideoAccessToken,
      match: { params: { room_id } = {} } = {}
    } = this.props;

    await fetchVideoAccessToken(getPatientFromRoomId(room_id));
    await this.init();
    await this.startVideoCall();

    const urlParams = new URLSearchParams(window.location.search);
    const isAudioOnParam = urlParams.get('isAudioOn') === "true";
    const isVideoOnParam = urlParams.get('isVideoOn') === "true";

    if(!isAudioOnParam){
     await this.setAudioOff();
    }

    if(!isVideoOnParam){
     await this.setfVideoOff();
    }

    
    }catch(error){
      console.log("error in initial video call setup===>",error);
    }
  }

  async componentDidUpdate(prevProps,prevState){
    const {isStart : prev_isStart = false } = prevState;
    const {isStart=false} = this.state;
    const {isAudioOn=false,isVideoOn = false}=this.state;

    if(isStart && isStart !== prev_isStart){
      if(!isAudioOn){
         await this.setAudioOff();
      }

      if(!isVideoOn){
         await this.setfVideoOff();
      }
    }


  }

  componentWillUnmount() {
    this.rtc.client.removeAllListeners();
  }

  formatMessage = (message, data) =>
    this.props.intl.formatMessage(message, data);

  getVideoOptions = () => {
    const {
      agora: { video_token } = {},
      match: { params: { room_id } = {} } = {}
    } = this.props;

    return {
      appId: config.AGORA_APP_ID,
      channel: room_id,
      token: video_token
    };
  };

  init = () => {
    this.rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "h264" });

    this.rtc.client.on("user-published", async (user, mediaType) => {
      // Subscribe to a remote user.
      await this.rtc.client.subscribe(user, mediaType);

      this.setState({ remoteAdded: true, remoteUid: user.uid });

      // If the subscribed track is video.
      if (mediaType === "video") {
        const remoteVideoTrack = user.videoTrack;

        const playerContainer = document.createElement("div");
        playerContainer.className = "videoPlayer";
        playerContainer.id = user.uid.toString();

        const childContainer1 = document.getElementById("agora-remote");
        childContainer1.appendChild(playerContainer);
        remoteVideoTrack.play(playerContainer);
      }

      if (mediaType === "audio") {
        const remoteAudioTrack = user.audioTrack;
        remoteAudioTrack.play();
      }
    });

    this.rtc.client.on("user-unpublished", user => {
      const playerContainer = document.getElementById(user.uid);
      playerContainer && playerContainer.remove();
      this.setState({ remoteAdded: false });
    });

    this.rtc.client.on("exception", error => {
      console.log("29810321 error", error);
    });
  };

  publishTrack = async () => {
    this.rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    this.rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    await this.rtc.client.publish([
      this.rtc.localAudioTrack,
      this.rtc.localVideoTrack
    ]);
  };

  startVideoCall = async () => {

    const { auth: { authenticated_user } = {} } = this.props;

    const { appId, channel, token } = this.getVideoOptions();

    this.setState({ loading: true });
    const uid = await this.rtc.client.join(
      appId,
      channel,
      token,
      authenticated_user
    );
    await this.publishTrack();
    this.setState({ selfUid: uid });
    this.rtc.localVideoTrack.play("agora-self");
    const playerContainer = document.createElement("div");
    playerContainer.className = "videoPlayer";
    playerContainer.id = uid.toString();
    this.setState({ loading: false, isStart: true });
  };

  leaveCall = async () => {
    // const { rtc, options } = this;
    await this.rtc.localVideoTrack.close();
    await this.rtc.localAudioTrack.close();

    this.rtc.client.remoteUsers.forEach(user => {
      const playerContainer = document.getElementById(user.uid);
      playerContainer && playerContainer.remove();
    });
    this.setState({ loading: true });
    await this.rtc.client.leave();
    this.setState({
      remoteUid: null,
      isStart: false,
      remoteAdded: false,
      loading: false
    });
  };

  toggleVideo = async () => {
    const { isVideoOn } = this.state;
    await this.rtc.localVideoTrack.setEnabled(!isVideoOn);
    this.setState({ isVideoOn: !isVideoOn });
  };

  setfVideoOff = async() => {
    await this.rtc.localVideoTrack.setEnabled(false);
    this.setState({ isVideoOn: false });
  }

  setAudioOff = async() => {
    await this.rtc.localAudioTrack.setEnabled(false);
    this.setState({ isAudioOn: false });
  }

  toggleAudio = async () => {
    const { isAudioOn } = this.state;
    await this.rtc.localAudioTrack.setEnabled(!isAudioOn);
    this.setState({ isAudioOn: !isAudioOn });
  };

  getVideoParticipants = () => {
    const {
      match: { params: { room_id } = {} } = {},
      doctors,
      patients,
      auth: { authenticated_category } = {}
    } = this.props;

    const patientUserId = getPatientFromRoomId(room_id);
    const doctorUserId = getDoctorFromRoomId(room_id);

    let remoteData = {};
    let selfData = {};

    // selfUid
    if (authenticated_category === USER_CATEGORY.DOCTOR) {
      Object.keys(doctors).forEach(id => {
        const { basic_info: { user_id } = {} } = doctors[id] || {};
        if (`${user_id}` === doctorUserId) {
          selfData = doctors[id] || {};
        }
      });

      Object.keys(patients).forEach(id => {
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

    if(!isStart) {
      return null;
    }

    return (
      <div className="ml24">
        {isVideoOn ? (
            <Tooltip title={formatMessage(messages.disableVideo)} placement={"top"}>
          <img src={VideoIcon} onClick={toggleVideo} alt="chatIcon" />
            </Tooltip>
        ) : (
            <Tooltip title={formatMessage(messages.enableVideo)} placement={"top"}>
          <img src={VideoDisabledIcon} onClick={toggleVideo} alt="chatIcon" />
            </Tooltip>
        )}
      </div>
    );
  };

  getAudioButtons = () => {
    const { isStart = false, isAudioOn } = this.state;
    const { toggleAudio, formatMessage } = this;

    if(!isStart) {
      return null;
    }

    return (
      <div className="ml24">
        {isAudioOn ? (
            <Tooltip title={formatMessage(messages.muteAudio)} placement={"top"}>
          <img src={AudioIcon} onClick={toggleAudio} alt="chatIcon" />
            </Tooltip>
        ) : (
            <Tooltip title={formatMessage(messages.unMuteAudio)} placement={"top"}>
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
      <div className={`${isStart && "ml24"}`}>
        {!isStart ? (
          // <Tooltip title={formatMessage(messages.startCall)} placement={"top"}>
          //   <img
          //     src={StartCallIcon}
          //     onClick={startVideoCall}
          //     alt="chatIcon"
          //     className="pointer"
          //   />
          // </Tooltip>
          <Button
            type={"primary"}
            className={"mb40"}
            onClick={startVideoCall}
          >
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

  render() {
    const { isStart, remoteAdded, loading } = this.state;
    const {
      getVideoParticipants,
      formatMessage,
      getVideoButtons,
      getAudioButtons,
      getCallButtons
    } = this;

    const {
      remoteData: {
        basic_info: { full_name } = {},
        details: { profile_pic } = {}
      } = {}
    } = getVideoParticipants();

    return (
      <div className="wp100 hp100 bg-black relative">
        {/*   SELF VIEW   */}
        <div id={"agora-self"} className="wp25 h200 fixed b20 r20 z999"></div>

        {/*   REMOTE VIEW   */}
        <div id={"agora-remote"} className="wp100 hp100">
          {loading && (
            <div className="hp100 wp100 flex direction-column align-center justify-center z1">
              <Loading className={"wp100"} />
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
                        ...messages.waitingForPatient
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
          {getCallButtons()}

          {/*   VIDEO   */}
          {getVideoButtons()}
        </div>
      </div>
    );
  }
}

export default injectIntl(AgoraVideo);
