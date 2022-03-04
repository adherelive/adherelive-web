import React, { Component, Fragment } from "react";
import Video from "twilio-video";
// import TwilioChat from "../TwilioChat";
import { injectIntl } from "react-intl";
import moment from "moment";
import UserDpPlaceholder from "../../Assets/images/ico-placeholder-userdp.svg";
import StartCallIcon from "../../Assets/images/ico-vc-start-call.png";
import EndCallIcon from "../../Assets/images/ico-vc-end-call.png";
// import ChatIcon from "../../Assets/images/ico-vc-message.png";
import AudioIcon from "../../Assets/images/ico-vc-audio.png";
import VideoIcon from "../../Assets/images/ico-vc-video.png";
import VideoDisabledIcon from "../../Assets/images/ico-vc-video-off.png";
import AudioDisabledIcon from "../../Assets/images/ico-vc-audio-off.png";
import { doRequest } from "../../Helper/network";
import { Twilio } from "../../Helper/urls";
import { REQUEST_TYPE, USER_CATEGORY } from "../../constant";

import { Button, message, Icon, Spin } from "antd";

class VideoComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      identity: null,
      roomName: "",
      roomNameErr: false, // Track error for room name TextField
      previewTracks: null,
      localMediaAvailable: false,
      hasJoinedRoom: false,
      activeRoom: "", // Track the current active room
      video2connected: false,
      participantConnected: false,
      videoEnabled: true,
      audioEnabled: true,
      status: "",
    };
    this.toggleLocalVideo = this.toggleLocalVideo.bind(this);
  }

  componentDidMount() {
    console.log("65584464444444447648", this.props);
    const {
      match: {
        params: { room_id },
      },
      authenticated_user,
      fetchVideoAccessToken,
      // fetchEventUsers
    } = this.props;
    fetchVideoAccessToken(authenticated_user).then((result) => {
      this.setState((prevState, props) => {
        return {
          identity: props.twilio.identity,
          token: props.twilio.videoToken,
        };
      });
    });
    // fetchEventUsers(room_id);
    //this.fetchEventDataById(room_id);
    const roomName = room_id;
    this.setState({ roomName });
  }

  // fetchEventDataById = async eventId => {
  //     const response = await doRequest({
  //         method: REQUEST_TYPE.GET,
  //         url: Event.getEventDataById(eventId)
  //     });
  //     const { payload } = response;

  //     const { data: { events = {} } = {} } = payload;
  //     await this.setState((state, props) => ({ status: events.status }));
  // };

  toggleLocalVideo(flag) {
    this.setState({ videoEnabled: !this.state.videoEnabled });
    //
    var localParticipant = this.state.activeRoom.localParticipant;
    if (flag === "disable") {
      localParticipant.videoTracks.forEach(function (videoTrack) {
        videoTrack.disable();
      });
      //var remoteContainer = this.refs.remoteMedia;
      //
      //
    } else if (flag === "enable") {
      localParticipant.videoTracks.forEach(function (videoTrack) {
        videoTrack.enable();
      });
      //
    }
  }

  toggleLocalAudio(flag) {
    this.setState({ audioEnabled: !this.state.audioEnabled });
    var localParticipant = this.state.activeRoom.localParticipant;
    if (flag === "disable") {
      localParticipant.audioTracks.forEach(function (audioTrack) {
        audioTrack.disable();
      });
    } else if (flag === "enable") {
      localParticipant.audioTracks.forEach(function (audioTrack) {
        audioTrack.enable();
      });
    }
  }

  joinRoom = async () => {
    // const {
    //     match: {
    //         params: { room_id }
    //     }
    // } = this.props;

    this.setState({ status: "loading" });

    // await this.fetchEventDataById(room_id);
    if (!this.state.roomName.trim()) {
      this.setState({ roomNameErr: true });
      return;
    }

    let connectOptions = {
      name: this.state.roomName,
      video: { width: 1440 },
      audio: true,
      _useTwilioConnection: true,
    };

    if (this.state.previewTracks) {
      connectOptions.tracks = this.state.previewTracks;
    }
    // const { status } = this.state;

    // if (status === PASSED || status === COMPLETED) {
    //   this.showMessage();
    // } else {

    // Join the Room with the token from the server and the
    // LocalParticipant's Tracks.

    Video.connect(this.state.token, connectOptions).then(
      this.roomJoined,
      (error) => {
        alert("Could not connect to Twilio: " + error.message);
      }
    );
    // }
  };

  attachTracks = (tracks, container) => {
    console.log("73648723648723684723684==========>", tracks);

    tracks.forEach((track) => {
      if (track.kind !== "data") {
        console.log("73648723648723684723684", track);
        container.appendChild(track.attach());
      }
    });
  };

  // Attaches a track to a specified DOM container
  attachParticipantTracks = (participant, container) => {
    var tracks = Array.from(participant.tracks.values());
    this.attachTracks(tracks, container);
  };
  // attachParticipantTracks(participant, container, isLocal) {
  //     var tracks = this.getTracks(participant);
  //     this.attachTracks(tracks, container, isLocal);
  // }

  // getTracks(participant) {
  //     return Array.from(participant.tracks.values()).filter(function (publication) {
  //         return publication.track;
  //     }).map(function (publication) {
  //         return publication.track;
  //     });
  // }

  detachTracks = (tracks) => {
    tracks.forEach((track) => {
      if (track.kind !== "data") {
        track.detach().forEach((detachedElement) => {
          detachedElement.remove();
        });
      }
    });
  };

  detachParticipantTracks = (participant) => {
    var tracks = Array.from(participant.tracks.values());
    this.detachTracks(tracks);
  };

  roomJoined = async (room) => {
    // Called when a participant joins a room

    this.setState({
      activeRoom: room,
      localMediaAvailable: true,
      hasJoinedRoom: true,
    });

    const { sid } = room;

    const response = await doRequest({
      method: REQUEST_TYPE.GET,
      url: Twilio.getConnectedParticipants(sid),
    });

    const { payload: { data: { connectedParticipants = {} } = {} } = {} } =
      response;
    const { users, authenticated_user } = this.props;

    const userIds = Object.keys(users);
    const otherUserId = userIds.filter(
      (id) => parseInt(id) !== parseInt(authenticated_user)
    )[0];

    if (connectedParticipants[otherUserId] === "connected") {
      this.setState({
        video2connected: true,
        participantConnected: otherUserId,
        status: "connected",
      });
    } else {
      this.setState({ status: "waiting" });
    }
    // Attach LocalParticipant's Tracks, if not already attached.
    var previewContainer = this.refs.localMedia;

    if (!previewContainer.querySelector("video")) {
      this.attachParticipantTracks(room.localParticipant, previewContainer);
    }

    // Attach the Tracks of the Room's Participants.
    room.participants.forEach((participant) => {
      var previewContainer = this.refs.remoteMedia;

      this.attachParticipantTracks(participant, previewContainer);
    });

    // When a Participant joins the Room, log the event.
    room.on("participantConnected", (participant) => {
      this.setState({
        video2connected: true,
        participantConnected: participant.identity,
        status: "Call Started",
      });
    });

    // When a Participant adds a Track, attach it to the DOM.
    room.on("trackAdded", (track, participant) => {
      var previewContainer = this.refs.remoteMedia;
      this.attachTracks([track], previewContainer);
    });

    // When a Participant removes a Track, detach it from the DOM.
    room.on("trackRemoved", (track, participant) => {
      //

      this.detachTracks([track]);
    });

    // When a Participant leaves the Room, detach its Tracks.
    room.on("participantDisconnected", (participant) => {
      this.detachParticipantTracks(participant);
      this.setState({
        video2connected: false,
        participantConnected: false,
        status: "partcipantDisconnected",
      });
    });

    // Once the LocalParticipant leaves the room, detach the Tracks
    // of all Participants, including that of the LocalParticipant.
    room.on("disconnected", () => {
      if (this.state.previewTracks) {
        this.state.previewTracks.forEach((track) => {
          track.stop();
        });
      }
      this.detachParticipantTracks(room.localParticipant);
      room.participants.forEach(this.detachParticipantTracks);
      this.setState({
        activeRoom: null,
        hasJoinedRoom: false,
        localMediaAvailable: false,
        video2connected: false,
        participantConnected: false,
        status: "Appointment done",
      });
    });
  };

  leaveRoom = () => {
    if (
      this.state.activeRoom !== null &&
      this.state.activeRoom !== "" &&
      this.state.activeRoom.disconnect
    ) {
      this.state.activeRoom.disconnect();
    }
    this.setState({ hasJoinedRoom: false, localMediaAvailable: false });
    window.close();
  };

  componentDidUpdate(prevProps, prevState) {
    // const {
    //     video2connected,
    //     participantConnected,
    //     roomName: eventId
    // } = this.state;
    // const { authenticated_user, addVideoRoomParticipantsInEvent } = this.props;
    // if (video2connected) {
    // addVideoRoomParticipantsInEvent(
    //     eventId,
    //     participantConnected,
    //     authenticated_user
    // );
    // }
  }

  componentWillUnmount() {
    this.leaveRoom();
  }

  getOtherParticipantData = () => {
    const {
      users,
      match: {
        params: { room_id = "" },
      },
      patients = {},
    } = this.props;
    let patientUserId = room_id.split("-")[room_id.split("-").length - 1];
    let patientId = "";
    for (let pat of Object.values(patients)) {
      let {
        basic_info: { user_id, id = 1 },
      } = pat;
      if (parseInt(user_id) === parseInt(patientUserId)) {
        patientId = id;
      }
    }
    // const userIds = Object.keys(users);
    // const otherUserId = userIds.filter(id => id !== authenticated_user)[0];

    let {
      basic_info: {
        user_id: otherUserId = 1,
        first_name: name = "",
        gender = "",
      } = {},
      dob = "",
      details: { profile_pic: profilePic = UserDpPlaceholder },
    } = patients[patientId];
    if (otherUserId) {
      const { category } = users[otherUserId] || {};
      // const {
      //     // name,
      //     category
      // } = basic_info;

      if (category !== USER_CATEGORY.PATIENT) {
        return { profilePic: profilePic, name, category };
      } else if (category === USER_CATEGORY.PATIENT) {
        // const {
        //     personalInfo: { dob, gender }
        // } = users[otherUserId] || {};
        const age = moment().diff(dob, "years", false);
        return { profilePic: profilePic, name, category, age, gender };
      }
    }
  };

  render() {
    const otherUserdata = this.getOtherParticipantData();
    console.log("83658713658791345", otherUserdata);
    console.log("73648723648723684723684===>>*****", Video.version);
    // Only show video track after user has joined a room
    let showLocalTrack = this.state.localMediaAvailable ? (
      <div className="videoWrapper" ref="localMedia" />
    ) : (
      ""
    );
    // Hide 'Join Room' button if user has already joined a room.
    // eslint-disable-next-line no-unused-vars
    let joinOrLeaveRoomButton = this.state.hasJoinedRoom ? (
      <Button type="danger" onClick={this.leaveRoom}>
        Leave Room
      </Button>
    ) : (
      <Button type="primary" onClick={this.joinRoom}>
        Join Room
      </Button>
    );

    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

    const { video2connected, participantConnected, hasJoinedRoom, status } =
      this.state;
    const { users, showChatBox } = this.props;
    const user =
      participantConnected && users[participantConnected]
        ? users[participantConnected]
        : {};

    const {
      basic_info: { profilePicLink: profilePic = UserDpPlaceholder, name } = {},
    } = user;

    let showWaitngMsg = false;
    if (hasJoinedRoom) {
      if (
        (status === "waiting" || !video2connected) &&
        status !== "loading" &&
        status !== "started"
      ) {
        showWaitngMsg = true;
      }
    }

    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: "black",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      >
        <div ref="remoteMedia" id="remote-media" />
        {
          status === "loading" || status === "started"
          // && (
          // <Spin
          //     indicator={antIcon}
          //     className="loadingForUser loadingForUserSub flex align-items-center justify-center mlp49"
          // />
          // )
        }

        <div
          style={{
            position: "absolute",
            bottom: 32,
            right: 32,
            height: 180,
            width: 250,
          }}
        >
          {showLocalTrack}
        </div>
        {this.state.hasJoinedRoom ? (
          <div>
            {/* <img
                            src={ChatIcon}
                            style={{
                                position: "absolute",
                                bottom: 32,
                                left: 32,
                                cursor: "pointer"
                            }}
                            alt="chatIcon"
                            onClick={this.props.showChat}
                        /> */}
            <div
              style={
                participantConnected && video2connected
                  ? {
                      position: "absolute",
                      top: 32,
                      left: showChatBox ? 400 : 32,
                      cursor: "pointer",
                    }
                  : { display: "none" }
              }
            >
              <img
                style={{ height: "40px", width: "40px", borderRadius: "50%" }}
                src={otherUserdata.profilePic || UserDpPlaceholder}
                alt="chatIcon"
              />{" "}
              <span
                style={{ fontSize: "14px", color: "white", padding: "10px" }}
              >
                {name}
              </span>
            </div>
            {showWaitngMsg && (
              <div className="flex direction-column text-white fs16 medium align-items-center justify-center WaitingForUser">
                <div className="mb10">
                  <img
                    src={otherUserdata.profilePic || UserDpPlaceholder}
                    style={{
                      cursor: "pointer",
                      height: "94px",
                      width: "96px",
                      borderRadius: "50%",
                    }}
                    alt="userDp"
                  />
                </div>

                <div>
                  {otherUserdata.category !== USER_CATEGORY.PATIENT ? (
                    <span className="fs16 medium text-white white">
                      {status !== "partcipantDisconnected"
                        ? `Waiting for ${otherUserdata.name}`
                        : `${otherUserdata.name} left the call.`}
                    </span>
                  ) : (
                    <span className="fs16 medium text-white white">
                      {status !== "partcipantDisconnected"
                        ? ` Waiting for ${otherUserdata.name}`
                        : `${otherUserdata.name} left the call.`}
                    </span>
                  )}
                </div>
              </div>
            )}
            <div style={{ position: "absolute", bottom: 32, right: "41%" }}>
              {this.state.videoEnabled ? (
                <img
                  src={VideoIcon}
                  style={{ cursor: "pointer", marginLeft: 24 }}
                  onClick={() => this.toggleLocalVideo("disable")}
                  alt="chatIcon"
                />
              ) : (
                <img
                  src={VideoDisabledIcon}
                  style={{ cursor: "pointer", marginLeft: 24 }}
                  onClick={() => this.toggleLocalVideo("enable")}
                  alt="chatIcon"
                />
              )}
              {this.state.audioEnabled ? (
                <img
                  src={AudioIcon}
                  style={{ cursor: "pointer", marginLeft: 24 }}
                  onClick={() => this.toggleLocalAudio("disable")}
                  alt="chatIcon"
                />
              ) : (
                <img
                  src={AudioDisabledIcon}
                  style={{ cursor: "pointer", marginLeft: 24 }}
                  onClick={() => this.toggleLocalAudio("enable")}
                  alt="chatIcon"
                />
              )}

              <img
                src={EndCallIcon}
                style={{ cursor: "pointer", marginLeft: 24 }}
                onClick={this.leaveRoom}
                alt="chatIcon"
              />
            </div>
          </div>
        ) : (
          <Fragment>
            {/* <div className='wp100 hp10 flex justify-center mb20'> */}
            {!(status === "loading") && (
              <img
                src={StartCallIcon}
                style={{
                  position: "absolute",
                  bottom: 32,
                  right: "46.5%",
                  cursor: "pointer",
                }}
                onClick={this.joinRoom}
                alt="chatIcon"
              />
            )}
            {/* </div> */}
          </Fragment>
        )}
        {!(showWaitngMsg || video2connected) && (
          <div className="flex column align-items-center justify-center WaitingForUser">
            <div className="mb10">
              <img
                src={otherUserdata.profilePic || UserDpPlaceholder}
                style={{
                  cursor: "pointer",
                  height: "94px",
                  width: "96px",
                  borderRadius: "50%",
                }}
                alt="userDp"
              />
            </div>
            <div>
              <span className="fs16 medium text-white">
                {status === "loading" || status === "started"
                  ? `Calling ${otherUserdata.name}`
                  : `${otherUserdata.name}`}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default injectIntl(VideoComponent);
