import React, { Component, Fragment } from "react";
import {
  USER_ADHERE_BOT,
  CHAT_MESSAGE_TYPE,
  PARTS,
  PART_LIST_BACK,
  PART_LIST_CODES,
  PART_LIST_FRONT,
  BODY,
  PARTS_GRAPH,
  BODY_VIEW,
  BODY_SIDE_TEXT,
} from "../../constant";
import messages from "./messages";
import { injectIntl } from "react-intl";
import { Form, Input, Button, Spin, Avatar, Upload, Modal } from "antd";
import moment from "moment";

import DownloadOutlined from "@ant-design/icons/DownloadOutlined";

class symptomBotMessage extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   replyMessage : ''
    // }
  }

  componentDidMount() {}

  getEllipsis = (message, side, parts) => {
    const { handleReply } = this.props;
    return (
      <div className="wp100 tar fs20 pr20">
        <span
          onClick={this.replyToMessage}
          className="h-cursor-p "
          meta-id={`${message.state.sid}-symptom`}
        >
          {" "}
          &hellip;
        </span>
      </div>
    );
  };

  replyToMessage = (e) => {
    e.preventDefault();
    const { updateReplyMessageId, handleReply } = this.props;
    if (typeof updateReplyMessageId === "function") {
      const node = e.target;

      const id = node.getAttribute("meta-id");
      updateReplyMessageId(id);
    }
  };

  getText = (symptom_text) => {
    let text = "";
    text = (
      <div>
        <div className="text-msg-container ">
          <span>{symptom_text}</span>
        </div>
      </div>
    );
    return text;
  };

  getImagesMedia = (image_document_ids, upload_documents) => {
    const imagesMediaArray = [];
    image_document_ids.forEach((image_doc_id) => {
      let imageMessage = "";
      const { basic_info: { document: img_src = "" } = {} } =
        upload_documents[image_doc_id];
      imageMessage = <div>{this.getImage(img_src)}</div>;
      imagesMediaArray.push(imageMessage);
    });

    return imagesMediaArray;
  };

  getAudioMedia = (audio_document_ids, upload_documents) => {
    const audioMediaArray = [];

    audio_document_ids.forEach((audio_doc_id) => {
      let audioMessage = "";
      const {
        basic_info: { document: audio_src = "", name: audio_name = "" } = {},
      } = upload_documents[audio_doc_id];
      // console.log("upload_documents",upload_documents);
      let audio_type = "mp3";
      // audio_type = audio_name.split('.')[1];
      audio_name.split(".")[1] === ""
        ? (audio_type = "mp3")
        : (audio_type = audio_name.split(".")[1]);
      audioMessage = <div>{this.getAudio(audio_src, audio_type)}</div>;
      audioMediaArray.push(audioMessage);
    });

    return audioMediaArray;
  };

  getVideoMedia = (video_document_ids, upload_documents) => {
    const videoMediaArray = [];

    video_document_ids.forEach((video_doc_id) => {
      let videoMessage = "";
      const {
        basic_info: { document: video_src = "", name: video_name = "" } = {},
      } = upload_documents[video_doc_id];

      let video_type = "mp4";
      // video_type = video_name.split('.')[1];
      video_name.split(".")[1] === ""
        ? (video_type = "mp4")
        : (video_type = video_name.split(".")[1]);
      videoMessage = <div>{this.getVideo(video_src, video_type)}</div>;

      videoMediaArray.push(videoMessage);
    });

    return videoMediaArray;
  };

  getPatientAvatar = (patientDp) => {
    return (
      <span className="twilio-avatar">
        <Avatar src={patientDp} />
      </span>
    );
  };

  getMessageTime = (message) => {
    let mess = "";
    mess = (
      <div className="chat-time start">
        {moment(message.state.timestamp).format("H:mm")}
      </div>
    );
    return mess;
  };

  getImage = (img_src) => {
    let mess = "";
    mess = (
      <div className="media-container ">
        <div className="overlay"></div>
        <div
          className="
                         media-doc-container
                           "
        >
          <a
            download={`img-${img_src}`}
            className="doc-opt "
            href={img_src}
            target={"_blank"}
            style={{ color: "#fff" }}
          >
            <DownloadOutlined className="fs18 pointer " twoToneColor="#fff" />
          </a>
        </div>

        <img className="symptom-image " src={img_src} alt="Symptom Image"></img>
      </div>
    );
    return mess;
  };

  getAudio = (audio_src, audio_type) => {
    let mess = "";
    mess = (
      <div className="media-container symptom-audio-container">
        <div className="audio-overlay"></div>
        <div
          className="
                         media-doc-container
                         rI2p
                         z999
                         black
                        "
        >
          <a
            download={`audio-${audio_src}`}
            className="doc-opt pointer "
            href={audio_src}
            target={"_blank"}
            style={{ color: "black" }}
          >
            <DownloadOutlined className="fs18  " twoToneColor="black" />
          </a>
        </div>
        <audio controls className="symptom-audio" width="100%" height="100%">
          <source
            src={audio_src}
            alt="symptom audio"
            type={`audio/${audio_type}`}
          ></source>
          {/* <source src={audio_src} alt="symptom audio" type="audio/mpeg" ></source> */}
          {this.props.intl.formatMessage(messages.audioNotSupported)}
        </audio>
      </div>
    );
    return mess;
  };

  getVideo = (video_src, video_type) => {
    let mess = "";
    mess = (
      <div className="media-container ">
        <div className="overlay"></div>
        <div
          className="
                         media-doc-container
                         z999
                        "
        >
          <a
            download={`video-${video_src}`}
            className="doc-opt pointer "
            href={video_src}
            target={"_blank"}
            style={{ color: "#fff" }}
          >
            <DownloadOutlined className="fs18  " twoToneColor="#fff" />
          </a>
        </div>
        <video controls width="100%" height="100%">
          <source src={video_src} type={`video/${video_type}`}></source>
          {/* <source src={video_src} type="video/ogg"></source> */}
          {this.props.intl.formatMessage(messages.videoNotSupported)}
        </video>
      </div>
    );
    return mess;
  };

  getSymptomMessage = (message, side, parts) => {
    console.log(
      "JSON.parse(message.state.body);",
      JSON.parse(message.state.body)
    );
    // OLD CODE
    // if (side === "" || parts.length === 0) {
    //   return "";
    // }

    let parsedMessage = JSON.parse(message.state.body);
    // AKSHAY NEW CODE IMPLEMENTATIONS
    const { symptom_id, symptoms } = parsedMessage || {};
    const { config } = symptoms[symptom_id] || {};
    console.log("symptoms[symptom_id]", symptoms[symptom_id]);
    // parts...
    const { name: partName = "" } = PARTS_GRAPH[config.parts] || {};
    // side...
    const body_side = BODY_SIDE_TEXT[config.side] || {};

    // AKSHAY NEW CODE IMPLEMENTATIONS NED

    // OLD CODE
    // const part = PARTS_GRAPH[parts].name || "";
    // const body_side = BODY_SIDE_TEXT[side] || "";
    let mess = "";

    mess = (
      <div>
        <div
          className="bot-msg-detail-container"
          id={`${message.state.sid}-symptom`}
        >
          <span className="bot-m-h ">Symptom</span>

          <div className="bot-msg-details">
            <span className="fs14 fw500  ">{body_side}</span>
            <span className="dot">&bull;</span>
            <span className="side">{partName}</span>
          </div>
        </div>
      </div>
    );
    return mess;
  };

  getFinalMessage = (message, patientDp, side, parts, allMediaArray) => {
    let mess = "";
    mess = (
      <div>
        <div className="chat-messages" key={`${message.state.sid}-symptom-key`}>
          <div className="chat-avatar">
            {/*{this.getPatientAvatar(patientDp)}*/}
            <div className="bot-message-container">
              {this.getEllipsis(message, side, parts)}
              <div>{this.getSymptomMessage(message, side, parts)}</div>
              <div className="media-container symptom-video-container">
                {allMediaArray}
              </div>
            </div>
          </div>
          {this.getMessageTime(message)}
        </div>
      </div>
    );

    return mess;
  };

  getAllMedia = () => {
    const {
      body: this_body,
      message,
      patientDp,
      symptoms,
      upload_documents = {},
    } = this.props;

    const body = JSON.parse(this_body);

    const symptom_id = body.symptom_id;
    const allMediaArray = [];
    let finalMessage = "";
    if (symptom_id != undefined) {
      // const {upload_documents = {} } = body;

      // const { text : symptom_text = '' , audio_document_ids = [], image_document_ids=[] ,video_document_ids = [], config : {side = '1' , parts = [] , duration='' }} = {} = body.symptoms[symptom_id] || {};

      const {
        text: symptom_text = "",
        audio_document_ids = [],
        image_document_ids = [],
        video_document_ids = [],
        config: { side = "1", parts = [], duration = "" } = {},
      } = symptoms[symptom_id] || {};

      const imagesMediaArray = this.getImagesMedia(
        image_document_ids,
        upload_documents
      );
      const audioMediaArray = this.getAudioMedia(
        audio_document_ids,
        upload_documents
      );
      const videoMediaArray = this.getVideoMedia(
        video_document_ids,
        upload_documents
      );
      const textMessage = this.getText(symptom_text);

      imagesMediaArray.forEach((each) => {
        allMediaArray.push(each);
      });
      videoMediaArray.forEach((each) => {
        allMediaArray.push(each);
      });
      audioMediaArray.forEach((each) => {
        allMediaArray.push(each);
      });
      allMediaArray.push(textMessage);
      finalMessage = this.getFinalMessage(
        message,
        patientDp,
        side,
        parts,
        allMediaArray
      );
    }

    return finalMessage;
  };

  render() {
    // const {allMedia} = this.state;
    const finalMessage = this.getAllMedia();

    return finalMessage;
  }
}

export default injectIntl(symptomBotMessage);
