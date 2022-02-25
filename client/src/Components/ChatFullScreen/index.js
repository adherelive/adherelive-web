import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import PatientList from "./patientListSideBar";
import TwilioChat from "../../Containers/ChatFullScreen/twilioChat";
import { getPatientConsultingVideoUrl } from "../../Helper/url/patients";
import config from "../../config";
import { getRoomId } from "../../Helper/twilio";
import { FEATURES } from "../../constant";
import { message } from "antd";
import messages from "./messages";
import NotificationDrawer from "../../Containers/Drawer/notificationDrawer";

class ChatFullScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doctorUserId: 1,
      roomId: "",
      patientUserId: 1,
      patientId: 1,
      placeCall: false,
      replyMessadeId: null,
    };
  }

  componentDidMount() {
    let {
      match: {
        params: { patient_id },
      },
      doctors = {},
      patients = {},
      authenticated_user = 1,
    } = this.props;

    let doctorUserId = ""; //user_id of doctor
    let {
      basic_info: { user_id: patientUserId = "" } = {},
      user_role_id: patientRoleId = null,
    } = patients[patient_id] || {};
    // for (let doc of Object.values(doctors)) {
    //   let {
    //     basic_info: { user_id, id = 1 }
    //   } = doc;
    //   if (parseInt(user_id) === parseInt(authenticated_user)) {
    //     doctorUserId = user_id;
    //   }
    // }

    const { auth_role: doctorRoleId = null } = this.props;
    // const roomId = getRoomId(doctorUserId, patientUserId);

    const roomId = getRoomId(doctorRoleId, patientRoleId);

    this.setState({
      doctorUserId,
      roomId,
      patientUserId: patientUserId,
      patientId: patient_id,
    });
  }

  async componentDidUpdate(prevProps, prevState) {
    const {
      notification_redirect: { patient_id = null } = {},
      resetNotificationRedirect,
    } = this.props;
    const {
      notification_redirect: { patient_id: prev_patient_id = null } = {},
    } = prevProps;
    if (patient_id && patient_id !== prev_patient_id) {
      await this.handleRedirectUpdate();
      resetNotificationRedirect();
    }
  }

  handleRedirectUpdate = () => {
    const {
      notification_redirect: { patient_id = null } = {},
      patients = {},
      authenticated_user = 1,
      doctors = {},
      resetNotificationRedirect,
    } = this.props;

    let doctorUserId = null;

    const { basic_info: { user_id: patientUserId = null } = {} } =
      patients[patient_id] || {};

    for (let doc of Object.values(doctors)) {
      let {
        basic_info: { user_id, id = 1 },
      } = doc;
      if (parseInt(user_id) === parseInt(authenticated_user)) {
        doctorUserId = user_id;
      }
    }

    const roomId = getRoomId(doctorUserId, patientUserId);

    this.setState({
      doctorUserId,
      roomId,
      patientUserId: patientUserId,
      patientId: patient_id,
    });
  };

  updateReplyMessageId = (newId = null) => {
    const { replyMessadeId: currentId } = this.state;

    if (currentId !== newId && newId === null && currentId !== null) {
      this.setState({
        replyMessadeId: newId,
      });
    } else if (currentId !== newId && newId !== null && currentId === null) {
      this.setState({
        replyMessadeId: newId,
      });
    }
  };

  openVideoChatTab = async () => {
    const { roomId = "" } = this.state;

    await this.props.getAllFeatures();

    const videoCallBlocked = this.checkVideoCallIsBlocked();

    if (videoCallBlocked) {
      message.error(this.formatMessage(messages.videoCallBlocked));
      return;
    }

    window.open(
      `${config.WEB_URL}/test${getPatientConsultingVideoUrl(roomId)}`,
      "_blank"
    );
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  checkVideoCallIsBlocked = () => {
    const { features_mappings = {} } = this.props;
    let videoCallBlocked = false;
    const videoCallFeatureId = this.getFeatureId(FEATURES.VIDEO_CALL);
    const otherUserCategoryId = this.getOtherUserCategoryId();
    const { [otherUserCategoryId]: mappingsData = [] } = features_mappings;

    if (mappingsData.indexOf(videoCallFeatureId) >= 0) {
      videoCallBlocked = false;
    } else {
      videoCallBlocked = true;
    }

    return videoCallBlocked;
  };

  getFeatureId = (featureName) => {
    const { features = {} } = this.props;
    const featuresIds = Object.keys(features);

    for (const id of featuresIds) {
      const { [id]: { name = null } = ({} = {}) } = features;

      if (name === featureName) {
        return parseInt(id, 10);
      }
    }

    return null;
  };

  getOtherUserCategoryId = () => {
    const {
      match: {
        params: { patient_id = null },
      },
    } = this.props;
    return patient_id;
  };

  setPatientId = (patient_id) => () => {
    const { doctorUserId } = this.state;

    const { patients = {}, auth_role: doctorRoleId = null } = this.props;
    const {
      basic_info: { user_id: patientUserId = "" } = {},
      user_role_id: patientRoleId = null,
    } = patients[patient_id];

    const roomId = getRoomId(doctorRoleId, patientRoleId);
    this.setState({
      patientUserId: patientUserId,
      patientId: patient_id,
      roomId,
    });
  };

  showVideoCall = () => {
    this.setState({ placeCall: true });
  };

  hideVideoCall = () => {
    this.setState({ placeCall: false });
  };

  // componentDidUpdate(prevProps, prevState) {
  //     const { patientUserId } = this.state;
  //
  //     const { patientUserId: prevPatientId } = this.state;
  //     if (patientUserId !== prevPatientId) {
  //
  //         const { doctorUserId } = this.state;
  //         let roomId = doctorUserId + '-' + patientUserId;
  //         this.setState({ roomId });
  //     }
  // }

  render() {
    let { roomId, patientId, doctorUserId, replyMessadeId } = this.state;

    let { patients = {}, getDoctorConsultations } = this.props;

    const {
      basic_info: {
        first_name = "",
        middle_name = "",
        last_name = "",
        full_name = "",
      } = {},
      details: { profile_pic: patientDp = "" } = {},
    } = patients[patientId] || {};
    return (
      <div className="chat-screen-container">
        {/* {placeCall
                    ?
                    (<TwilioVideo patientUserId={patientUserId} hideChat={this.hideVideoCall} roomId={roomId} />) :
                    ( */}
        <Fragment>
          <div className="chat-patientList-container">
            <PatientList
              setPatientId={this.setPatientId}
              doctorUserId={doctorUserId}
              patientId={patientId}
              {...this.props}
            />
          </div>
          <div className="chat-messageBox-container">
            {/* <Header placeVideoCall={this.openVideoChatTab} patientName={first_name ? `${first_name} ${middle_name ? `${middle_name} ` : ''}${last_name ? `${last_name}` : ''}` : ''} patientDp={} /> */}
            <TwilioChat
              getDoctorConsultations={getDoctorConsultations}
              replyMessadeId={replyMessadeId}
              updateReplyMessageId={this.updateReplyMessageId}
              roomId={roomId}
              placeVideoCall={this.openVideoChatTab}
              patientName={full_name}
              patientDp={patientDp}
              patientId={patientId}
            />
          </div>
        </Fragment>
      </div>
    );
  }
}

export default injectIntl(ChatFullScreen);
