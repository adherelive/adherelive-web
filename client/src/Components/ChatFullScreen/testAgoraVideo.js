import React, { Component } from "react";
import { injectIntl } from "react-intl";
import AgoraRTC from "agora-rtc-sdk-ng";

import { getDoctorFromRoomId, getPatientFromRoomId } from "../../Helper/twilio";

import config from "../../config";
import AudioIcon from "../../Assets/images/ico-vc-audio.png";
import AudioDisabledIcon from "../../Assets/images/ico-vc-audio-off.png";
import VideoIcon from "../../Assets/images/ico-vc-video.png";
import VideoDisabledIcon from "../../Assets/images/ico-vc-video-off.png";
import UserDpPlaceholder from "../../Assets/images/ico-placeholder-userdp.svg";
import { USER_CATEGORY, LOCAL_STORAGE } from "../../constant";
import messages from "./messages";
// import Loading from "../Common/Loading";
import Tooltip from "antd/es/tooltip";
import { Button, Progress } from "antd";
import Logo from "../../Assets/images/logo3x.png";

import { getPatientConsultingVideoUrl } from "../../Helper/url/patients";
// import { getRoomId } from "../../Helper/twilio";
import { AudioMutedOutlined } from "@ant-design/icons";

class TestAgoraVideo extends Component {
  constructor(props) {
    super(props);

    this.rtc = {
      client: null,
      localAudioTrack: null,
      localVideoTrack: null,
    };

    this.state = {
      loading: false,
      isVideoOn: true,
      isAudioOn: true,
      testing: false,
      audioLevel: 0,
      // TODO: Values repeated, but with different boolean. Commenting
      //isVideoOn: false,
      //isAudioOn: true,
      roomId: null,
    };

    this.audioInterval = null;
  }

  componentDidMount() {
    this.testDevices();
  }

  componentWillUnmount() {
    // clearInterval(this.intervalID);
    this.removeAudioInterval();
  }

  createAudioInterval = () => {
    const audioTrack = this.rtc.localAudioTrack;
    this.audioInterval = setInterval(() => {
      const level = audioTrack.getVolumeLevel();
      const vol = level * 100;
      this.setState({ audioLevel: vol });
    }, 300);
  };

  removeAudioInterval = () => {
    clearInterval(this.audioInterval);
  };

  formatMessage = (message, data) =>
    this.props.intl.formatMessage(message, data);

  toggleVideo = async () => {
    const { isVideoOn } = this.state;
    await this.rtc.localVideoTrack.setEnabled(!isVideoOn);
    this.setState({ isVideoOn: !isVideoOn });
  };

  toggleAudio = async () => {
    const { isAudioOn } = this.state;
    const { createAudioInterval, removeAudioInterval } = this;

    const newAudioStatus = !isAudioOn;
    await this.rtc.localAudioTrack.setEnabled(!isAudioOn);
    this.setState({ isAudioOn: !isAudioOn });
    if (!newAudioStatus) {
      // console.log("642354754236 ///////////////////////////////////////");
      // clearInterval(this.intervalID);
      removeAudioInterval();
    } else {
      createAudioInterval();
      // const audioTrack = this.rtc.localAudioTrack;
      // this.intervalID = setInterval(() => {
      //   const level = audioTrack.getVolumeLevel();
      //   // console.log("642354754236 local stream audio level ###################### ", level);
      //   const vol = level*1000;
      //   this.setState({audioLevel:vol});

      // }, 1000);
    }
  };

  getVideoButtons = () => {
    const { isVideoOn } = this.state;
    const { toggleVideo, formatMessage } = this;
    // console.log("642354754236 ####################");

    return (
      <div className="ml24 z999 pointer">
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

  openVideoChatTab = () => {
    const { match: { params: { room_id: roomId } = {} } = {} } = this.props;
    const { isAudioOn = false, isVideoOn = false } = this.state;

    // console.log("32564572354754327 =================>>>>",{roomId});
    localStorage.removeItem(LOCAL_STORAGE.LOCAL_IS_AUDIO_ON);
    localStorage.removeItem(LOCAL_STORAGE.LOCAL_IS_VIDEO_ON);
    window.open(
      `${config.WEB_URL}${getPatientConsultingVideoUrl(
        roomId
      )}?isAudioOn=${isAudioOn}&isVideoOn=${isVideoOn}`,
      "_self"
    );
  };

  getAudioButtons = () => {
    const { isAudioOn } = this.state;
    const { toggleAudio, formatMessage } = this;

    return (
      <div className="z999 pointer">
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

  getStartCallButton = () => {
    const { startVideoCall, formatMessage, openVideoChatTab } = this;

    return (
      <Button type={"primary"} className={"mb40"} onClick={openVideoChatTab}>
        {formatMessage(messages.startCall)}
      </Button>
    );
  };

  getVideoParticipants = () => {
    const {
      match: { params: { room_id } = {} } = {},
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

  testDevices = async () => {
    this.setState({ testing: true });

    AgoraRTC.getDevices()
      .then(async (devices) => {
        const audioDevices = devices.filter(function (device) {
          return device.kind === "audioinput";
        });
        const videoDevices = devices.filter(function (device) {
          return device.kind === "videoinput";
        });

        var selectedMicrophoneId = audioDevices[0].deviceId;
        var selectedCameraId = videoDevices[0].deviceId;
        return await Promise.all([
          AgoraRTC.createCameraVideoTrack({ cameraId: selectedCameraId }),
          AgoraRTC.createMicrophoneAudioTrack({
            microphoneId: selectedMicrophoneId,
          }),
        ]);
      })
      .then(([videoTrack, audioTrack]) => {
        this.rtc.localVideoTrack = videoTrack;
        this.rtc.localAudioTrack = audioTrack;
        videoTrack.play("test-container");
        this.setState({ isAudioOn: true, isVideoOn: true });
        this.createAudioInterval();
        // this.intervalID = setInterval(() => {
        //   const level = audioTrack.getVolumeLevel();
        //   // console.log("642354754236 local stream audio level ###################### ", level);
        //   const vol = level*1000;
        //   this.setState({audioLevel:vol});

        // }, 1000);
      });
  };

  getHeader = () => {
    return (
      <div className="fs24 fw800 mt40">
        {/* {this.formatMessage(messages.checkAudioVideo)} */}
        <img className="company-logo" src={Logo} alt="Adherence logo" />
        <span className="fs28 medium italic black-85">
          {this.formatMessage(messages.adhereLive)}
        </span>
      </div>
    );
  };

  getAudioVideoSection = () => {
    const { isVideoOn = false, isAudioOn = false, audioLevel = 0 } = this.state;
    const { getVideoButtons, getAudioButtons } = this;

    return (
      <div className="hp100 wp100 flex direction-column align-center justify-center">
        <div
          className="hp60 wp100 relative class-test-container bg-black br10"
          id="test-container"
        >
          {!isVideoOn ? (
            <div className="absolute z999 t10 l10 text-white wp100 hp100 flex direction-column align-center justify-center">
              <span className="fs16 fw800">
                {this.formatMessage(messages.videoOff)}
              </span>
            </div>
          ) : null}
          <div className="absolute b10 wp100 flex justify-center  ">
            <div className="flex align-center justify-center wp100">
              <div className="flex z999">
                {/*   AUDIO   */}
                {getAudioButtons()}

                {/*   VIDEO   */}
                {getVideoButtons()}
              </div>
            </div>
          </div>
        </div>

        <div className="flex direction-row wp100 mt40  ">
          <div className="fs16 fw800 flex align-start  ">
            {this.formatMessage(messages.audioCheck)}
            {!isAudioOn && (
              <span className="red ml24 ">
                <AudioMutedOutlined color="red" />
              </span>
            )}
          </div>
        </div>

        <div className="flex direction-row align-center justify-center wp100 mt28 ">
          <div className="wp100">
            <Progress
              strokeLinecap="square"
              percent={isAudioOn ? audioLevel : 0}
              status="active"
              showInfo={false}
              strokeWidth={10}
              strokeColor={{
                from: "#108ee9",
                to: "#87d068",
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  getStartCallSection = () => {
    const { formatMessage, getVideoParticipants } = this;

    const {
      remoteData: {
        basic_info: { full_name } = {},
        details: { profile_pic } = {},
      } = {},
    } = getVideoParticipants();

    return (
      <div className="flex direction-column align-center justify-center wp100 hp100 ">
        <div className="flex wp100  align-center justify-center ">
          <div className=" mauto  ">
            <img
              src={profile_pic || UserDpPlaceholder}
              className="pointer h120 w120 br50  "
              alt="userDp"
            />
          </div>
        </div>

        <div className="fs20 fw800 mt20 flex wp100 align-center justify-center  ">
          <span>{`${formatMessage(messages.readyToCall)} ${full_name} ?`}</span>
        </div>

        <div className="flex wp100 align-center justify-center mt20  ">
          {this.getStartCallButton()}
        </div>
      </div>
    );
  };

  render() {
    const { audioLevel } = this.state;
    const { getHeader, getAudioVideoSection, getStartCallSection } = this;

    return (
      <div className="ml-vp4 flex direction-column hp100 wp100">
        <div>{getHeader()}</div>

        <div className="flex align-center hp100 wp100">
          <div className="hp100 wp50">{getAudioVideoSection()}</div>

          <div className="flex align-center justify-center wp50">
            {getStartCallSection()}
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(TestAgoraVideo);
