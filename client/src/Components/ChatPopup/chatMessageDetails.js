import React, { Component, Fragment } from "react";
import { Form, Input, Button, Spin, Avatar, Upload, Modal } from "antd";
import moment from "moment";
import Chat from "twilio-chat";
import DoubleTick from "../../Assets/images/double-tick-indicator.png";
import Send from "../../Assets/images/send.png";
import SingleTick from "../../Assets/images/check-symbol.png";
import PaperClip from "../../Assets/images/attachPop.png";
import ImagePlaceHolder from "../../Assets/images/image_placeholder.png";
import Close from "../../Assets/images/close.png";
import Maximize from "../../Assets/images/maximize.png";
import Download from "../../Assets/images/down-arrow.png";
import File from "../../Assets/images/file.png";
import messages from "./messages";
import { injectIntl } from "react-intl";
import humanBody from "../../Assets/images/humanBodyFront.jpeg";
import humanBodyBack from "../../Assets/images/humanBodyBack.jpeg";
import bodyImage from "../../../src/Assets/images/body.jpg";
// import CloseChatIcon from "../../Assets/images/ico-vc-message-close.png";
import CallIcon from "../../Assets/images/telephone.png";
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
  BODY_SIDE,
  USER_CATEGORY,
  EVENT_TYPE,
} from "../../constant";
import BotMessage from "./botMessage";
import { getFullName, isJSON } from "../../Helper/common";
import ReactAudioPlayer from "react-audio-player";
import DownloadOutlined from "@ant-design/icons/DownloadOutlined";

class MediaComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      blobUrl: "",
      message: "",
      imageModalVisible: false,
    };
  }

  componentDidMount() {
    const { message } = this.props;
    this.setState({ message: message }, this.getUrl);
    // this.getUrl(message);
  }

  componentWillUnmount() {}

  imageModal = () => {
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
        <img
          src={this.state.url}
          alt="qualification document"
          className="wp100"
        />
      </Modal>
    );
  };
  closeModal = () => {
    this.setState({ imageModalVisible: false });
  };

  openModal = () => {
    this.setState({ imageModalVisible: true });
  };
  onClickDownloader = (e) => {
    e.preventDefault();
    const { url, message } = this.state;
    if (url && url.length > 0) {
      fetch(url, {
        method: "GET",
      })
        .then((response) => response.blob())
        .then((blob) => {
          const blobUrl = window.URL.createObjectURL(new Blob([blob]));
          const downloader = document.createElement("a");
          downloader.href = blobUrl;
          downloader.download = message.media.filename;
          downloader.target = "_blank";
          document.body.appendChild(downloader);
          downloader.click();
          document.body.removeChild(downloader);
        });
    }
  };

  getUrl = async () => {
    const { message } = this.state;
    const { document = null } = message.media;
    if (document != null) {
      this.setState({ url: document });
    } else {
      const url = await message.media.getContentTemporaryUrl();
      this.setState({ url: url });
    }
  };

  onDownloadClick = (e) => {
    e.stopPropagation();
  };

  getMedia = () => {
    const { message } = this.props;
    if (message && message.media) {
      const { url = "", blobUrl = "" } = this.state;
      if (message.media.contentType.indexOf("image") !== -1) {
        return (
          <Fragment>
            {url.length > 0 ? (
              <div onClick={this.openModal} className="media-container">
                <div className="overlay"></div>
                <div
                  className="
                          media-doc-container
                          rI2p
                          z999
                          white
                          "
                >
                  <a
                    onClick={this.onDownloadClick}
                    download={`image-${Download}`}
                    className="doc-opt pointer "
                    href={Download}
                    target={"_blank"}
                    style={{ color: "white" }}
                  >
                    <DownloadOutlined className="fs18  " twoToneColor="white" />
                  </a>
                </div>

                <img className="wp100 pointer" src={url} alt="Uploaded Image" />
              </div>
            ) : (
              <img
                className="wp100"
                src={ImagePlaceHolder}
                alt="Uploaded Image"
              />
            )}
            {this.imageModal()}
          </Fragment>
        );
      } else if (message.media.contentType.includes("audio")) {
        // console.log("18939712 File", { url, cT: message.media.contentType });
        return (
          <div className="flex align-center justify-center">
            <ReactAudioPlayer
              src={url}
              // autoPlay
              controls
              className="bg-current-message"
              // style={{background: "#3d77d2"}}
            />
          </div>
        );
      } else {
        return (
          // <div onClick={this.onClickDownloader}>{message.media.filename}</div>
          <div className="downloadable-file">
            <img src={File} className="h20 mr10" />
            <div className="fs14 mr10">
              {message.media.filename.length <= 12
                ? message.media.filename
                : `${message.media.filename.substring(0, 13)}...`}
            </div>
            <img
              src={Download}
              className="h20 mr10 pointer"
              onClick={this.onClickDownloader}
            />
          </div>
        );
      }
    }

    return <div>{this.props.formatMessage(messages.cantDisplay)}</div>;
  };

  render() {
    return <Fragment>{this.getMedia()}</Fragment>;
  }
}

class ChatMessageDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadSymptoms: true,
      loadingMessageDetails: false,
      message_numbers: 0,
      vital_repeat_intervals: {},
      message_ids_length: 0,
    };
  }

  scrollToBottom = () => {
    const { chats: { minimized = false } = {} } = this.props;
    this.props.scrollToBottom();
    // if (!minimized) {
    //     const chatEndElement = document.getElementById("chatEnd");
    //     chatEndElement.focus();
    //     chatEndElement.scrollIntoView({ behavior: "smooth" });
    // }
  };

  componentDidMount() {
    this.fetchVitalDetails();
  }

  handleGetSymptomDetails = async ({ message_ids_length }) => {
    try {
      const { channelId, roomId, chatMessages, getSymptomDetails } = this.props;

      const { messageIds = [], messages = {} } = chatMessages[channelId] || {};
      let symtomMessageIds = [];

      await this.setState({ message_ids_length: messageIds.length });

      const newIdsLengthArr = messageIds.slice(message_ids_length) || [];
      const newIdsLength = newIdsLengthArr.length || 0;

      if (newIdsLength && newIdsLength > 0) {
        for (let each of newIdsLengthArr) {
          const { state: { body: jsonBody = "" } = {} } = messages[each] || {};
          if (isJSON(jsonBody)) {
            const body = JSON.parse(jsonBody);
            const { symptom_id = null } = body || {};
            const { type = "" } = body;
            if (type === CHAT_MESSAGE_TYPE.SYMPTOM && symptom_id) {
              symtomMessageIds.push(symptom_id);
            }
          }
        }

        if (symtomMessageIds.length) {
          const res = await getSymptomDetails(symtomMessageIds);
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  componentDidUpdate() {
    const { roomId, chatMessages, channelId } = this.props;
    const {
      message_numbers,
      loadSymptoms,
      message_ids_length = 0,
    } = this.state;
    const { messageIds = [] } = chatMessages[channelId] || {};

    if (
      chatMessages[channelId] != undefined &&
      messageIds.length !== message_ids_length
    ) {
      this.handleGetSymptomDetails({ message_ids_length });
    }

    if (
      chatMessages[channelId] != undefined &&
      messageIds.length > 0 &&
      message_numbers != messageIds.length &&
      !loadSymptoms
    ) {
      this.setState({ loadSymptoms: true, message_numbers: messageIds.length });
    }
  }

  formatMessage = (data) => this.props.intl.formatMessage(data);

  fetchMessageDetails = (data) => {
    const { messages: messagesArray = [] } = data || {};
    const { getSymptomDetails } = this.props;
    let adhere_bot_messages = {
      symptom_ids: [],
    };
    for (let i in messagesArray) {
      let message = messagesArray[i];

      const { author = "", body = "" } = message.state;
      if (author === USER_ADHERE_BOT) {
        const message_type = body.split(":");
        if (message_type[0] && message_type[0] == CHAT_MESSAGE_TYPE.SYMPTOM) {
          adhere_bot_messages["symptom_ids"].push(message_type[1]);
        }
      }
    }
    this.setState({ loadSymptoms: false, loadingMessageDetails: true });
    getSymptomDetails(adhere_bot_messages["symptom_ids"]).then((res) => {
      if (res) {
        this.setState({ loadingMessageDetails: false });
        this.scrollToBottom();
      }
    });
  };

  fetchVitalDetails = () => {
    const { getVitalOccurence } = this.props;
    getVitalOccurence().then((res) => {
      const { status = false } = res;
      if (status) {
        const { payload: { data } = {} } = res;
        const { repeat_intervals = {} } = data;
        this.setState({
          vital_repeat_intervals: repeat_intervals,
        });
      }
    });
  };

  getBlankStateComp = () => {
    return (
      <div className="flex wp100 hp100 align-center justify-center">
        {this.formatMessage(messages.blankStateChatText)}
      </div>
    );
  };

  getAuthor = ({ id, category }) => {
    const { doctors, patients } = this.props;

    let authorName = "";

    switch (category) {
      case USER_CATEGORY.DOCTOR:
        const { basic_info: { first_name, middle_name, last_name } = {} } =
          doctors[id] || {};
        authorName = getFullName({ first_name, middle_name, last_name });
        break;
      case USER_CATEGORY.HSP:
        const {
          basic_info: {
            first_name: hsp_first_name,
            middle_name: hsp_middle_name,
            last_name: hsp_last_name,
          } = {},
        } = doctors[id] || {};
        authorName = getFullName({
          first_name: hsp_first_name,
          middle_name: hsp_middle_name,
          last_name: hsp_last_name,
        });
        break;
      case USER_CATEGORY.PATIENT:
        const {
          basic_info: {
            first_name: p_first_name,
            middle_name: p_middle_name,
            last_name: p_last_name,
          } = {},
        } = patients[id] || {};
        authorName = getFullName({
          first_name: p_first_name,
          middle_name: p_middle_name,
          last_name: p_last_name,
        });
        break;
      default:
        break;
    }

    return authorName;
  };

  getMetaBlock = (metaContent, isCurrent) => {
    console.log("1038193280 metaContent", { metaContent });
    const { meta, author = {} } = metaContent || {};

    if (isJSON(meta)) {
      console.log("081231982310 meta", { meta });
      const { type } = meta || {};
      if (type === EVENT_TYPE.SYMPTOMS) {
        const { symptom_id, symptoms } = meta;
        const { config: { side, parts } = {} } = symptoms[symptom_id] || {};

        // parts...
        const { name: partName } = PARTS_GRAPH[parts] || {};

        // side...
        const sideName = BODY_SIDE[side] || {};

        return (
          <div
            className={`br5 mt6 mb6 ml6 mr6 flex direction-column justify-space-between ${
              isCurrent
                ? "text-white bg-current-meta"
                : "bg-other-meta bl-brown pl6"
            }`}
          >
            <div className="fs16 pt6 pb6 pl6 pr6 fw700">
              {this.formatMessage(messages.symptomMessageText)}
            </div>
            <div className="flex align-center">
              <div className="pl6 pr6">{sideName}</div>
              <div
                className={`br50 w10 h10 ${
                  isCurrent ? "bg-white" : "bg-black-65"
                }`}
              ></div>
              <div className="pl6 pr6">{partName}</div>
            </div>
          </div>
        );
      }

      if (type === EVENT_TYPE.VITALS) {
        const { vital_id, vitals, vital_templates } = meta;

        const { basic_info: { vital_template_id } = {} } =
          vitals[vital_id] || {};
        const {
          basic_info: { name: vitalName } = {},
          details: { template } = {},
        } = vital_templates[vital_template_id] || {};

        return (
          <div
            className={`br5 mt6 mb6 ml6 mr6 flex direction-column justify-space-between ${
              isCurrent
                ? "text-white bg-current-meta"
                : "bg-other-meta bl-brown pl6"
            }`}
          >
            <div className="fs16 pt6 pb6 pl6 pr6 fw700">
              {this.formatMessage(messages.vitalMessageText)}
            </div>
            <div className="flex align-center">
              <div className="pl6 pr6">{vitalName}</div>
            </div>
          </div>
        );
      }
    } else {
      return (
        <div
          className={`br5 mt6 mb6 ml6 mr6 flex direction-column justify-space-between ${
            isCurrent
              ? "text-white bg-current-meta"
              : "bg-other-meta bl-brown pl6"
          }`}
        >
          <div className="fs16 fw700">{this.getAuthor(author)}</div>
          <div>{meta}</div>
        </div>
      );
    }
  };

  getMessageComp = (messageArr) => {
    const {
      authenticated_user,
      otherUserLastConsumedMessageIndex,
      handleReply,
    } = this.props;
    const { getMetaBlock } = this;

    const messageToRender = [];
    messageArr.forEach((message, index) => {
      const { state: { attributes: { sender_id } = {}, author, body } = {} } =
        message || {};

      const prevMessage = messageArr[index - 1] || null;

      if (prevMessage) {
        if (
          !moment(message.state.timestamp).isSame(
            moment(prevMessage.state.timestamp),
            "date"
          )
        ) {
          messageToRender.push(
            <div className="mt16 mb16 flex wp100 text-grey justify-center fs12">
              {moment(message.state.timestamp).isSame(moment(), "date")
                ? this.formatMessage(messages.today)
                : moment(message.state.timestamp).format("ll")}
            </div>
          );
        }
      } else {
        messageToRender.push(
          <div className="mt16 mb16 flex wp100 text-grey justify-center fs12">
            {moment(message.state.timestamp).isSame(moment(), "date")
              ? this.formatMessage(messages.today)
              : moment(message.state.timestamp).format("ll")}
          </div>
        );
      }

      if (author === USER_ADHERE_BOT) {
        messageToRender.push(
          <BotMessage
            body={body}
            message={message}
            // patientDp={patientDp}
            // vital_repeat_intervals={vital_repeat_intervals}
            {...this.props}
          />
        );
        return;
      }

      if (
        (sender_id && sender_id === `${authenticated_user}`) ||
        author === `${authenticated_user}`
      ) {
        // RIGHT

        // media types here
        if (message.type === "media") {
          messageToRender.push(
            <div className="wp100 flex justify-end">
              <div className="bg-current-message wp40 mt10 mb10 ml10 mr10 p10 br5 text-white">
                <MediaComponent message={message}></MediaComponent>
                <div className="flex justify-space-between mr-4 text-white pl6 pr6">
                  <div>{moment(message.state.timestamp).format("h:mm A")}</div>
                  <img
                    className={
                      index < otherUserLastConsumedMessageIndex
                        ? `h14 mt4`
                        : `h12 mt4`
                    }
                    src={
                      index <= otherUserLastConsumedMessageIndex
                        ? DoubleTick
                        : SingleTick
                    }
                  />
                </div>
              </div>
              {/* date here */}
            </div>
          );
          return;
        }

        // replies
        if (isJSON(body)) {
          const parsedMessage = JSON.parse(body);
          console.log("128781732 parsedMessage ---> ", parsedMessage);
          const {
            text,
            meta: { productId = null } = {},
            meta,
          } = parsedMessage || {};

          if (productId) {
            const { amount, type, name } = meta || {};
            messageToRender.push(
              <div className="wp100 flex justify-end">
                <div className="flex direction-column bg-current-message wp40 mr10 mb10 mt20 ml10 br5">
                  {/*{getMetaBlock(parsedMessage, true)}*/}
                  <div className="wp100 p10 br5 text-white fs16 fw600 word-wrap tac">
                    {`Pay Rs.${amount}`}
                  </div>
                  <div className="wp100 p10 br5 text-white fs16 fw600 word-wrap tac">
                    {`For ${name}`}
                  </div>
                  {/* date here */}
                  <div className="flex justify-space-between mr-4 text-white pl6 pr6">
                    <div>
                      {moment(message.state.timestamp).format("h:mm A")}
                    </div>
                    <img
                      className={
                        index < otherUserLastConsumedMessageIndex
                          ? `h14 mt4`
                          : `h12 mt4`
                      }
                      src={
                        index <= otherUserLastConsumedMessageIndex
                          ? DoubleTick
                          : SingleTick
                      }
                    />
                  </div>
                </div>
              </div>
            );
            return;
          }

          messageToRender.push(
            <div className="wp100 flex justify-end">
              <div className="flex direction-column bg-current-message wp40 mr10 mb10 mt10 ml10 br5">
                {getMetaBlock(parsedMessage, true)}
                <div className="wp100 p10 br5 text-white fs16 fw600 word-wrap">
                  {text}
                </div>
                {/* date here */}
                <div className="flex justify-space-between mr-4 text-white pl6 pr6">
                  <div>{moment(message.state.timestamp).format("h:mm A")}</div>
                  <img
                    className={
                      index < otherUserLastConsumedMessageIndex
                        ? `h14 mt4`
                        : `h12 mt4`
                    }
                    src={
                      index <= otherUserLastConsumedMessageIndex
                        ? DoubleTick
                        : SingleTick
                    }
                  />
                </div>
              </div>
            </div>
          );
        } else {
          messageToRender.push(
            <div className="wp100 flex justify-end">
              <div className="direction-column bg-current-message wp40 mt10 mb10 ml10 mr10 p10 br5 text-white">
                <div className="fs16 fw600 word-wrap">{body}</div>
                <div className="flex justify-space-between mr-4 text-white pl6 pr6">
                  <div>{moment(message.state.timestamp).format("h:mm A")}</div>
                  <img
                    className={
                      index < otherUserLastConsumedMessageIndex
                        ? `h14 mt4`
                        : `h12 mt4`
                    }
                    src={
                      index <= otherUserLastConsumedMessageIndex
                        ? DoubleTick
                        : SingleTick
                    }
                  />
                </div>
              </div>
              {/* date here */}
            </div>
          );
        }
      } else {
        // LEFT

        // media types here
        if (message.type === "media") {
          messageToRender.push(
            <div className="wp100 flex justify-start">
              <div className="bg-other-message wp40 mt10 mb10 ml10 mr10 p10 br5 text-white fs16 fw700">
                <MediaComponent message={message}></MediaComponent>
              </div>
              {/* date here */}
              <div className="flex justify-space-between mr-4 pl6 pr6">
                <div>{moment(message.state.timestamp).format("h:mm A")}</div>
                <img
                  className={
                    index < otherUserLastConsumedMessageIndex
                      ? `h14 mt4`
                      : `h12 mt4`
                  }
                  src={
                    index <= otherUserLastConsumedMessageIndex
                      ? DoubleTick
                      : SingleTick
                  }
                />
              </div>
            </div>
          );
          return;
        }

        // replies
        if (isJSON(body)) {
          const parsedMessage = JSON.parse(body);
          console.log("128781732 parsedMessage ---> ", parsedMessage);
          const { text } = parsedMessage || {};

          messageToRender.push(
            <div className="wp100 flex justify-start">
              <div className="flex direction-column bg-other-message wp40 mr10 mb10 mt10 ml10 br5">
                {getMetaBlock(parsedMessage, false)}
                <div className="wp100 p10 br5 fs16 fw500 word-wrap">{text}</div>
                {/* date here */}
                <div className="flex justify-space-between mr-4 pl6 pr6">
                  <div>{moment(message.state.timestamp).format("h:mm A")}</div>
                  <img
                    className={
                      index < otherUserLastConsumedMessageIndex
                        ? `h14 mt4`
                        : `h12 mt4`
                    }
                    src={
                      index <= otherUserLastConsumedMessageIndex
                        ? DoubleTick
                        : SingleTick
                    }
                  />
                </div>
              </div>
            </div>
          );
        } else {
          messageToRender.push(
            <div className="wp100 flex justify-start">
              <div className="direction-column bg-other-message wp40 mt10 mb10 ml10 mr10 p10 br5 fs16 fw500 word-wrap">
                <div className="fs16 fw600 word-wrap">{body}</div>
                {/* date here */}
                <div className="flex justify-space-between mr-4 pl6 pr6">
                  <div>{moment(message.state.timestamp).format("h:mm A")}</div>
                  <img
                    className={
                      index < otherUserLastConsumedMessageIndex
                        ? `h14 mt4`
                        : `h12 mt4`
                    }
                    src={
                      index <= otherUserLastConsumedMessageIndex
                        ? DoubleTick
                        : SingleTick
                    }
                  />
                </div>
              </div>
            </div>
          );
        }
      }
    });

    return messageToRender;
  };

  render() {
    console.log("342423432432", { props: this.props }); // TODO: Added
    const {
      // authenticated_user,
      // users,
      roomId,
      chatMessages,
      channelId,
      // patientDp,
      // symptoms,
      // upload_documents,
      // otherUserLastConsumedMessageIndex,
      // getVitalOccurence
    } = this.props;

    const { getBlankStateComp, getMessageComp } = this;

    // const { messageIds = [] } = chatMessages[roomId] || {};
    // const {
    //   loadSymptoms,
    //   loadingMessageDetails,
    //   message_numbers,
    //   vital_repeat_intervals
    // } = this.state;
    // if (
    //   chatMessages[roomId] !== undefined &&
    //   (loadSymptoms || message_numbers != messageIds.length) &&
    //   !loadingMessageDetails
    // ) {
    //   this.fetchMessageDetails(chatMessages[roomId]);
    // }

    const { messages: messagesArray = [] } = chatMessages[channelId] || {};

    if (messagesArray.length === 0) {
      return getBlankStateComp();
    }

    if (messagesArray.length > 0) {
      // const messagesToRender = [];

      return (
        <div className="wp100 bg-chat-color">
          {getMessageComp(messagesArray)}
        </div>
      );
      // for (let i = 0; i < messagesArray.length; ++i) {
      //   const message = messagesArray[i];
      //   const prevMessage = i > 1 ? messagesArray[i - 1] : 1;
      //   let sameDate =
      //     message && prevMessage && message.state && prevMessage.state
      //       ? moment(message.state.timestamp).isSame(
      //           moment(prevMessage.state.timestamp),
      //           "date"
      //         )
      //       : false;

      //   if (!sameDate) {
      //     messagesToRender.push(
      //       <div className="mt16 mb16 flex wp100 text-grey justify-center fs12">
      //         {moment(message.state.timestamp).isSame(moment(), "date")
      //           ? this.formatMessage(messages.today)
      //           : moment(message.state.timestamp).format("ll")}
      //       </div>
      //     );
      //   }
      //   const { state: { index = 1 } = {} } = message;
      //   const user = users[message.state.author]
      //     ? users[message.state.author]
      //     : {};
      //   let mess = "";
      //   const body = message.state.body;

      //   if (message.state.author == USER_ADHERE_BOT) {
      //     mess = (
      //       <BotMessage
      //         body={body}
      //         message={message}
      //         patientDp={patientDp}
      //         vital_repeat_intervals={vital_repeat_intervals}
      //         {...this.props}
      //       />
      //     );
      //   } else {
      //     mess = (
      //       <Fragment key={message.state.sid}>
      //         {parseInt(message.state.author) !==
      //         parseInt(authenticated_user) ? null : (
      //           // Human wrapper code ------>>>>>>>

      //           // mess = (
      //           // <Fragment key={message.state.sid}>
      //           // <div className="chat-messages">
      //           // <div className="chat-avatar">
      //           // <span className="twilio-avatar">
      //           // <Avatar src={patientDp} />
      //           // </span>
      //           // <>
      //           // <div className="chat-text" style={{ display: "inline-block" }}>
      //           // { (side && parts[0]) ?
      //           // (<div className='humanBodyWrapper'>
      //           // <img
      //           // src={side === '1' ? humanBody : humanBodyBack}
      //           // className={'wp100 hp100'}
      //           // />
      //           // {side === '1' ? (PART_LIST_FRONT.map(part => {
      //           // const { key, areaStyle = {}, dotStyle = {} } = BODY[part];
      //           // const { top: bpTop = 0,
      //           // left: bpLeft = 0,
      //           // height: bpHeight = 0,
      //           // width: bpWidth = 0 } = areaStyle || {};
      //           // const { top: dotTop = 0, left: dotLeft = 0 } = dotStyle || {};
      //           // // console.log('isSAMEEEEEEEE============>', body_part, key, body_part === key);
      //           // return (
      //           // <div
      //           // key={key}
      //           // style={{ position: 'absolute', top: `${bpTop}px`, left: `${bpLeft}px`, height: `${bpHeight}px`, width: `${bpWidth}px` }}
      //           // >
      //           // <div
      //           // style={{
      //           // top: `${dotTop}px`,
      //           // left: `${dotLeft}px`,
      //           // position: "absolute",
      //           // height: parts[0] === key ? 12 : 0,
      //           // width: parts[0] === key ? 12 : 0,
      //           // backgroundColor: parts[0] === key ? "rgba(236,88,0,0.8)" : 'rgba(0,0,0,0)',
      //           // borderRadius: '50%',

      //           // // height: 12,
      //           // // width: 12 ,
      //           // // backgroundColor: "red",
      //           // // borderRadius: '50%'
      //           // }
      //           // }
      //           // />
      //           // </div>
      //           // );
      //           // })) :
      //           // (PART_LIST_BACK.map(part => {
      //           // const { key, areaStyle = {}, dotStyle = {} } = BODY[part];
      //           // const { top: bpTop = 0,
      //           // left: bpLeft = 0,
      //           // height: bpHeight = 0,
      //           // width: bpWidth = 0 } = areaStyle || {};
      //           // const { top: dotTop = 0, left: dotLeft = 0 } = dotStyle || {};
      //           // return (
      //           // <div
      //           // key={key}
      //           // style={{ position: 'absolute', top: `${bpTop}px`, left: `${bpLeft}px`, height: `${bpHeight}px`, width: `${bpWidth}px` }}
      //           // >
      //           // <div
      //           // style={{
      //           // top: `${dotTop}px`,
      //           // left: `${dotLeft}px`,
      //           // position: "absolute",
      //           // height: parts[0] === key ? 12 : 0,
      //           // width: parts[0] === key ? 12 : 0,
      //           // backgroundColor: parts[0] === key ? "rgba(236,88,0,0.8)" : 'rgba(0,0,0,0)',
      //           // borderRadius: '50%',

      //           // // height: 12,
      //           // // width: 12 ,
      //           // // backgroundColor: "red",
      //           // // borderRadius: '50%'
      //           // }
      //           // }
      //           // />
      //           // </div>
      //           // );
      //           // }))}
      //           // {/* <img src={bodyImage} height={260} width={200}></img> */}

      //           // </div>) : null}
      //           // {text.length ? (
      //           // <Fragment>
      //           // <div className='mt5 mb5'>Description :</div>
      //           // <div>{text}</div>
      //           // </Fragment>) : null}
      //           // {/* <div>{`Duration: `+duration}</div> */}
      //           // {audio_document_ids.length ? <div>Description :</div> : null}
      //           // {audio_document_ids.length ? (
      //           // Object.values(audio_document_ids).map(id => {
      //           // if (upload_documents[id] != undefined) {
      //           // const { basic_info: { name = '', document = '' } } = upload_documents[id];
      //           // let mediaData = {
      //           // media: {
      //           // contentType: '',
      //           // filename: name,
      //           // document: document
      //           // }
      //           // }
      //           // return (
      //           // <div className="clickable white chat-media-message-text">
      //           // <MediaComponent message={mediaData}></MediaComponent>
      //           // </div>);
      //           // } else {
      //           // return null;
      //           // }
      //           // })
      //           // ) : (
      //           // null
      //           // )}
      //           // {image_document_ids.length ? <div>Description :</div> : null}
      //           // {image_document_ids.length ? (
      //           // Object.values(image_document_ids).map(id => {
      //           // if (upload_documents[id] != undefined) {
      //           // const { basic_info: { name = '', document = '' } } = upload_documents[id];
      //           // let mediaData = {
      //           // media: {
      //           // contentType: 'image',
      //           // filename: name,
      //           // document: document
      //           // }
      //           // }
      //           // return (
      //           // <div className="clickable white chat-media-message-text">
      //           // <MediaComponent message={mediaData}></MediaComponent>
      //           // </div>);
      //           // } else {
      //           // return null;
      //           // }
      //           // })
      //           // ) : (
      //           // null
      //           // )}
      //           // </div>
      //           // {/* <div className="chat-text">
      //           // </div> */}
      //           // </>
      //           // </div>
      //           // <div className="chat-time start">
      //           // {moment(message.state.timestamp).format("H:mm")}
      //           // </div>
      //           // {/* </div> */}
      //           // </div>
      //           // </Fragment >
      //           // );
      //           // <<<<<<< ---------------------<<<<<

      //           // <div className="chat-messages">

      //           //     <div className="chat-avatar">
      //           //         <span className="twilio-avatar">
      //           //             <Avatar src={patientDp} />
      //           //         </span>
      //           //         {message.type === "media" ? (
      //           //             <div className="chat-text">
      //           //                 <div className="clickable white chat-media-message-text">
      //           //                     <MediaComponent message={message}></MediaComponent>
      //           //                 </div>
      //           //             </div>
      //           //         ) : (
      //           //                 <div className="chat-text">{message.state.body}</div>
      //           //             )}
      //           //     </div>
      //           //     <div className="chat-time start">
      //           //         {moment(message.state.timestamp).format("H:mm")}
      //           //     </div>
      //           //     {/* </div> */}
      //           // </div>

      //           <div className="chat-messages end">
      //             {message.type === "media" ? (
      //               <div className="chat-text end">
      //                 <div className="clickable white chat-media-message-text">
      //                   <MediaComponent message={message}></MediaComponent>
      //                 </div>
      //               </div>
      //             ) : (
      //               <div className="chat-text end">{message.state.body}</div>
      //             )}
      //             {/* <div className="chat-text end">{message.state.body}</div> */}
      //             <div className="flex justify-end">
      //               <div className="chat-time mr-4">
      //                 {moment(message.state.timestamp).format("H:mm")}
      //               </div>
      //               <img
      //                 className={
      //                   index < otherUserLastConsumedMessageIndex
      //                     ? `h14 mt4`
      //                     : `h12 mt4`
      //                 }
      //                 src={
      //                   index <= otherUserLastConsumedMessageIndex
      //                     ? DoubleTick
      //                     : SingleTick
      //                 }
      //               />
      //             </div>
      //           </div>
      //         )}
      //       </Fragment>
      //     );
      //   }
      //   messagesToRender.push(mess);
      // }
      // return messagesToRender;
    } else {
      return "";
    }
  }
}

export default injectIntl(ChatMessageDetails);
