import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import {
  Drawer,
  Icon,
  Select,
  Input,
  message,
  Button,
  Spin,
  Radio,
  DatePicker,
  Modal,
} from "antd";
import config from "../../../config";
import messages from "./message";
import File from "../../../Assets/images/file.png";
import "react-datepicker/dist/react-datepicker.css";
import humanBody from "../../../Assets/images/humanBodyFront.jpeg";
import ImagePlaceHolder from "../../../Assets/images/image_placeholder.png";
import humanBodyBack from "../../../Assets/images/humanBodyBack.jpeg";
import Download from "../../../Assets/images/down-arrow.png";
import {
  PARTS,
  PART_LIST_BACK,
  PART_LIST_CODES,
  PART_LIST_FRONT,
  BODY,
} from "../../../constant";

class SymptomsDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageModalVisible: false,
    };
  }

  componentDidMount() {}

  formatMessage = (data) => this.props.intl.formatMessage(data);

  getBodyPartName = (selected_part) => {
    const { formatMessage } = this;
    if (selected_part === PART_LIST_CODES.HEAD) {
      return formatMessage(messages.head);
    } else if (selected_part === PART_LIST_CODES.LEFT_EYE) {
      return formatMessage(messages.leftEye);
    } else if (selected_part === PART_LIST_CODES.RIGHT_EYE) {
      return formatMessage(messages.rightEye);
    } else if (selected_part === PART_LIST_CODES.LEFT_EAR) {
      return formatMessage(messages.leftEar);
    } else if (selected_part === PART_LIST_CODES.RIGHT_EAR) {
      return formatMessage(messages.rightEar);
    } else if (selected_part === PART_LIST_CODES.NOSE) {
      return formatMessage(messages.nose);
    } else if (selected_part === PART_LIST_CODES.MOUTH) {
      return formatMessage(messages.mouth);
    } else if (selected_part === PART_LIST_CODES.NECK) {
      return formatMessage(messages.neck);
    } else if (selected_part === PART_LIST_CODES.LEFT_SHOULDER) {
      return formatMessage(messages.leftShoulder);
    } else if (selected_part === PART_LIST_CODES.RIGHT_SHOULDER) {
      return formatMessage(messages.rightShoulder);
    } else if (selected_part === PART_LIST_CODES.CHEST) {
      return formatMessage(messages.chest);
    } else if (selected_part === PART_LIST_CODES.LEFT_ARM) {
      return formatMessage(messages.leftArm);
    } else if (selected_part === PART_LIST_CODES.RIGHT_ARM) {
      return formatMessage(messages.rightArm);
    } else if (selected_part === PART_LIST_CODES.LEFT_ELBOW) {
      return formatMessage(messages.leftElbow);
    } else if (selected_part === PART_LIST_CODES.RIGHT_ELBOW) {
      return formatMessage(messages.rightElbow);
    } else if (selected_part === PART_LIST_CODES.STOMACH) {
      return formatMessage(messages.stomach);
    } else if (selected_part === PART_LIST_CODES.ABDOMEN) {
      return formatMessage(messages.abdomen);
    } else if (selected_part === PART_LIST_CODES.LEFT_FOREARM) {
      return formatMessage(messages.leftForearm);
    } else if (selected_part === PART_LIST_CODES.RIGHT_FOREARM) {
      return formatMessage(messages.rightForearm);
    } else if (selected_part === PART_LIST_CODES.LEFT_WRIST) {
      return formatMessage(messages.leftWrist);
    } else if (selected_part === PART_LIST_CODES.RIGHT_WRIST) {
      return formatMessage(messages.rightWrist);
    } else if (selected_part === PART_LIST_CODES.LEFT_HAND) {
      return formatMessage(messages.leftHand);
    } else if (selected_part === PART_LIST_CODES.RIGHT_HAND) {
      return formatMessage(messages.rightHand);
    } else if (selected_part === PART_LIST_CODES.LEFT_HAND_FINGER) {
      return formatMessage(messages.leftHandFingers);
    } else if (selected_part === PART_LIST_CODES.RIGHT_HAND_FINGER) {
      return formatMessage(messages.rightHandFingers);
    } else if (selected_part === PART_LIST_CODES.LEFT_HIP) {
      return formatMessage(messages.leftHip);
    } else if (selected_part === PART_LIST_CODES.RIGHT_HIP) {
      return formatMessage(messages.rightHip);
    } else if (selected_part === PART_LIST_CODES.LEFT_THIGH) {
      return formatMessage(messages.leftThigh);
    } else if (selected_part === PART_LIST_CODES.RIGHT_THIGH) {
      return formatMessage(messages.rightThigh);
    } else if (selected_part === PART_LIST_CODES.LEFT_KNEE) {
      return formatMessage(messages.leftKnee);
    } else if (selected_part === PART_LIST_CODES.RIGHT_KNEE) {
      return formatMessage(messages.rightKnee);
    } else if (selected_part === PART_LIST_CODES.LEFT_SHIN) {
      return formatMessage(messages.leftShin);
    } else if (selected_part === PART_LIST_CODES.RIGHT_SHIN) {
      return formatMessage(messages.rightShin);
    } else if (selected_part === PART_LIST_CODES.LEFT_ANKLE) {
      return formatMessage(messages.leftAnkle);
    } else if (selected_part === PART_LIST_CODES.RIGHT_ANKLE) {
      return formatMessage(messages.rightAnkle);
    } else if (selected_part === PART_LIST_CODES.LEFT_FOOT) {
      return formatMessage(messages.leftFoot);
    } else if (selected_part === PART_LIST_CODES.RIGHT_FOOT) {
      return formatMessage(messages.rightFoot);
    } else if (selected_part === PART_LIST_CODES.LEFT_TOE) {
      return formatMessage(messages.leftToe);
    } else if (selected_part === PART_LIST_CODES.RIGHT_TOE) {
      return formatMessage(messages.rightToe);
    } else if (selected_part === PART_LIST_CODES.RECTUM) {
      return formatMessage(messages.rectum);
    } else if (selected_part === PART_LIST_CODES.URINARY_BLADDER) {
      return formatMessage(messages.urinary);
    } else if (selected_part === PART_LIST_CODES.HEAD_BACK) {
      return formatMessage(messages.head);
    } else if (selected_part === PART_LIST_CODES.NECK_BACK) {
      return formatMessage(messages.neck);
    } else if (selected_part === PART_LIST_CODES.RIGHT_SHOULDER_BACK) {
      return formatMessage(messages.rightShoulder);
    } else if (selected_part === PART_LIST_CODES.LEFT_SHOULDER_BACK) {
      return formatMessage(messages.leftShoulder);
    } else if (selected_part === PART_LIST_CODES.BACK) {
      return formatMessage(messages.back);
    } else if (selected_part === PART_LIST_CODES.LOWER_BACK) {
      return formatMessage(messages.lowerBack);
    } else if (selected_part === PART_LIST_CODES.LEFT_TRICEP) {
      return formatMessage(messages.leftTricep);
    } else if (selected_part === PART_LIST_CODES.RIGHT_TRICEP) {
      return formatMessage(messages.rightTricep);
    } else if (selected_part === PART_LIST_CODES.LEFT_FOREARM_BACK) {
      return formatMessage(messages.leftForearm);
    } else if (selected_part === PART_LIST_CODES.RIGHT_FOREARM_BACK) {
      return formatMessage(messages.rightForearm);
    } else if (selected_part === PART_LIST_CODES.LEFT_HAMSTRING) {
      return formatMessage(messages.leftHamString);
    } else if (selected_part === PART_LIST_CODES.RIGHT_HAMSTRING) {
      return formatMessage(messages.rightHamString);
    } else if (selected_part === PART_LIST_CODES.LEFT_CALF) {
      return formatMessage(messages.leftCalf);
    } else if (selected_part === PART_LIST_CODES.RIGHT_CALF) {
      return formatMessage(messages.rightCalf);
    }
  };

  closeModal = () => {
    this.setState({ imageModalVisible: false });
  };

  openModal = () => {
    this.setState({ imageModalVisible: true });
  };

  imageModal = (url) => {
    return (
      <Modal
        className={"chat-media-modal"}
        visible={this.state.imageModalVisible}
        title={" "}
        closable
        mask
        maskClosable
        onCancel={this.closeModal}
        wrapClassName={"chat-media-modal-dialog"}
        width={`50%`}
        footer={null}
      >
        <img src={url} alt="qualification document" className="wp100" />
      </Modal>
    );
  };

  onClickDownloader = (url, name) => () => {
    // e.preventDefault();
    // const { url, message } = this.state;
    if (url && url.length > 0) {
      fetch(url, {
        method: "GET",
      })
        .then((response) => response.blob())
        .then((blob) => {
          const blobUrl = window.URL.createObjectURL(new Blob([blob]));
          const downloader = document.createElement("a");
          downloader.href = blobUrl;
          downloader.download = name;
          downloader.target = "_blank";
          document.body.appendChild(downloader);
          downloader.click();
          document.body.removeChild(downloader);
        });
    }
  };

  renderBody = () => {
    const {
      payload: {
        data: {
          body_part = "",
          body_part_key = "",
          description = "",
          side = "1",
          image_document_ids = [],
          audio_document_ids = [],
        },
      },
      upload_documents = {},
    } = this.props;
    let imageUrl = "";
    let audioUrl = "";
    let audioName = "";

    if (image_document_ids.length) {
      const { basic_info: { document = "" } = {} } =
        upload_documents[image_document_ids[0]] || {};
      imageUrl = document;
    }

    if (audio_document_ids.length) {
      const { basic_info: { document = "", name = "" } = {} } =
        upload_documents[audio_document_ids[0]] || {};
      audioUrl = document;
      audioName = name;
    }
    console.log(
      "4895724839uf89324uufu489urfj",
      this.props.payload.data,
      body_part,
      side,
      description
    );
    return (
      <div className="humanbody-container hp100">
        <div className="fs20 medium tac">
          {this.getBodyPartName(body_part_key)}
        </div>
        <div className={"flex direction-row flex-1 align-center"}>
          <div className="fs14 medium">
            {side === "1"
              ? this.formatMessage(messages.right)
              : this.formatMessage(messages.left)}
          </div>
          <div className="humanBodyWrapper">
            <img
              src={side === "1" ? humanBody : humanBodyBack}
              className={"wp100 hp100"}
            />
            {side === "1"
              ? PART_LIST_FRONT.map((part) => {
                  const { key, areaStyle = {}, dotStyle = {} } = BODY[part];
                  const {
                    top: bpTop = 0,
                    left: bpLeft = 0,
                    height: bpHeight = 0,
                    width: bpWidth = 0,
                  } = areaStyle || {};
                  const { top: dotTop = 0, left: dotLeft = 0 } = dotStyle || {};
                  console.log(
                    "isSAMEEEEEEEE============>",
                    body_part,
                    key,
                    body_part === key
                  );
                  return (
                    <div
                      key={key}
                      style={{
                        position: "absolute",
                        top: `${bpTop}px`,
                        left: `${bpLeft}px`,
                        height: `${bpHeight}px`,
                        width: `${bpWidth}px`,
                      }}
                    >
                      <div
                        style={{
                          top: `${dotTop}px`,
                          left: `${dotLeft}px`,
                          position: "absolute",
                          height: body_part_key === key ? 12 : 0,
                          width: body_part_key === key ? 12 : 0,
                          backgroundColor:
                            body_part_key === key
                              ? "rgba(0, 129, 138, 0.41)"
                              : "rgba(0,0,0,0)",
                          borderRadius: "50%",

                          // height:  12,
                          // width:  12 ,
                          // backgroundColor: "red",
                          // borderRadius: '50%'
                        }}
                      />
                    </div>
                  );
                })
              : PART_LIST_BACK.map((part) => {
                  const { key, areaStyle = {}, dotStyle = {} } = BODY[part];
                  const {
                    top: bpTop = 0,
                    left: bpLeft = 0,
                    height: bpHeight = 0,
                    width: bpWidth = 0,
                  } = areaStyle || {};
                  const { top: dotTop = 0, left: dotLeft = 0 } = dotStyle || {};
                  return (
                    <div
                      key={key}
                      style={{
                        position: "absolute",
                        top: `${bpTop}px`,
                        left: `${bpLeft}px`,
                        height: `${bpHeight}px`,
                        width: `${bpWidth}px`,
                      }}
                    >
                      <div
                        style={{
                          top: `${dotTop}px`,
                          left: `${dotLeft}px`,
                          position: "absolute",
                          height: body_part_key === key ? 12 : 0,
                          width: body_part_key === key ? 12 : 0,
                          backgroundColor:
                            body_part_key === key
                              ? "rgba(0, 129, 138, 0.41)"
                              : "rgba(0,0,0,0)",
                          borderRadius: "50%",

                          // height:  12,
                          // width:  12 ,
                          // backgroundColor: "red",
                          // borderRadius: '50%'
                        }}
                      />
                    </div>
                  );
                })}
          </div>

          <div className="fs14 medium">
            {side === "1"
              ? this.formatMessage(messages.left)
              : this.formatMessage(messages.right)}
          </div>
        </div>

        <div className={"fs18 medium"}>
          {this.formatMessage(messages.description)}
        </div>
        {description && description.length ? (
          <div className="fs16 tal">{`${description}`}</div>
        ) : null}
        {imageUrl && imageUrl.length ? (
          <Fragment>
            {imageUrl.length > 0 ? (
              <div onClick={this.openModal}>
                <img
                  className="symptom-image mt10 pointer"
                  src={imageUrl}
                  alt="Uploaded Image"
                />
              </div>
            ) : (
              <img
                className="symptom-image mt10"
                src={ImagePlaceHolder}
                alt="Uploaded Image"
              />
            )}
            {this.imageModal(imageUrl)}
          </Fragment>
        ) : null}
        {audioUrl && audioUrl.length ? (
          <div className="downloadable-file mt10">
            <img src={File} className="w20 mr10" />
            <div className="fs14 mr10">
              {audioName.length <= 12
                ? audioName
                : `${audioName.substring(0, 13)}...`}
            </div>
            <img
              src={Download}
              className="w20 mr10 pointer"
              onClick={this.onClickDownloader(audioUrl, audioName)}
            />
          </div>
        ) : null}
      </div>
    );
  };

  render() {
    const { visible, close } = this.props;
    if (visible !== true) {
      return null;
    }
    console.log("86348732648732684723=======>", this.props);
    return (
      <Fragment>
        <Drawer
          className={"human-body-drawer"}
          title={this.formatMessage(messages.symptoms)}
          placement="right"
          // closable={false}
          // closeIcon={<img src={backArrow} />}
          maskClosable={false}
          headerStyle={{
            position: "sticky",
            zIndex: "9999",
            top: "0px",
          }}
          onClose={close}
          visible={visible} // todo: change as per state, -- WIP --
          width={400}
        >
          {this.renderBody()}
        </Drawer>
      </Fragment>
    );
  }
}

export default injectIntl(SymptomsDrawer);
