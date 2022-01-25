import React, { Component, Fragment } from "react";
import {
  Form,
  Input,
  Button,
  Spin,
  Avatar,
  Icon,
  Upload,
  Modal,
  message,
} from "antd";
import moment from "moment";
import Chat from "twilio-chat";
// import DoubleTick from "../../Assets/images/double-tick-indicator.png";
import Send from "../../Assets/images/send.png";
// import SingleTick from "../../Assets/images/check-symbol.png";
// import PaperClip from "../../Assets/images/attach.png";
// import ImagePlaceHolder from "../../Assets/images/image_placeholder.png";
// import Download from "../../Assets/images/down-arrow.png";
// import File from "../../Assets/images/file.png";
import messages from "./messages";
import { injectIntl } from "react-intl";
import CallIcon from "../../Assets/images/telephone.png";
import CallDisabledIcon from "../../Assets/images/call-disabled.png";
import ChatMessageDetails from "../ChatPopup/chatMessageDetails";
import Tooltip from "antd/es/tooltip";
import { SwapOutlined, MoreOutlined } from "@ant-design/icons";
import {
  CONSULTATION_FEE_TYPE_TEXT,
  USER_CATEGORY,
  FEATURES,
} from "../../constant";

// import Button from "antd/es/button";
import Menu from "antd/es/menu";
import Dropdown from "antd/es/dropdown";
import { CHAT_MESSAGE_TYPE } from "../../constant";
// import { USER_ADHERE_BOT, CHAT_MESSAGE_TYPE, PARTS, PART_LIST_BACK, PART_LIST_CODES, PART_LIST_FRONT, BODY,PARTS_GRAPH,BODY_VIEW,BODY_SIDE } from "../../constant";

export const MENU_ITEMS = {
  TOGGLE_CHAT_MESSAGES_PERMISSION: "TOGGLE_CHAT_MESSAGES_PERMISSION",
  TOGGLE_VIDEO_CALL_PERMISSION: "TOGGLE_VIDEO_CALL_PERMISSION",
};

const Header = ({
  placeVideoCall,
  patientName,
  patientDp = "",
  isOnline = false,
  otherTyping = false,
  formatMessage,
  getMenu,
  videoCallBlocked = false,
}) => {
  let pic = patientName ? (
    <Avatar src={patientDp}>{patientName[0]}</Avatar>
  ) : (
    <Avatar src={patientDp} icon="user" />
  );
  return (
    <div className="chat-patientListheader-chatBox">
      <div className="flex direction-row align-center flex-grow-1 mb4">
        {pic}

        <div className="flex direction-column justify-center">
          <div className="doctor-name-chat-header medium mt4">
            {patientName}
          </div>
          <div className="doctor-name-chat-header-online ml10">
            {otherTyping
              ? formatMessage(messages.typing)
              : isOnline
              ? formatMessage(messages.online)
              : formatMessage(messages.offline)}
          </div>
        </div>
      </div>

      {videoCallBlocked ? (
        <Tooltip
          placement={"topRight"}
          title="Call is blocked for this patient. Please unblock call to converse."
        >
          <img
            src={CallDisabledIcon}
            className="disabledCallIcon-header-PopUp mr20"
          />
        </Tooltip>
      ) : (
        <img
          src={CallIcon}
          className="callIcon-header-PopUp mr20"
          onClick={placeVideoCall}
        />
      )}

      <Dropdown overlay={getMenu()} trigger={["click"]} placement="bottomRight">
        <MoreOutlined className="text-white fs30 pointer" />
      </Dropdown>
    </div>
  );
};

class ChatForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newMessage: "",
      fileList: [],
      payment_products: {},
    };
  }

  async componentDidMount() {
    const { getDoctorConsultations } = this.props;
    const resp = await getDoctorConsultations();
    const { status, payload: { data: { payment_products } = {} } = {} } =
      resp || {};

    console.log("0928209834 resp", { resp });
    if (status === true) {
      this.setState({ payment_products });
    }
  }

  onMessageChanged = (event) => {
    this.setState({ newMessage: event.target.value });
  };

  sendMessage = async (event) => {
    if (event) {
      event.preventDefault();
    }

    const { raiseChatNotificationFunc, authenticated_user } = this.props;
    let trimmedMessage = this.state.newMessage.trim();
    if (this.state.newMessage.length > 0 && trimmedMessage.length > 0) {
      const message = this.state.newMessage;
      this.setState({ newMessage: "" });

      const { channel = null } = this.props;

      if (channel) {
        const resp = await channel.sendMessage(message, {
          sender_id: authenticated_user,
        });
      }

      if (message) {
        raiseChatNotificationFunc(message);
      }
    }
    if (this.state.fileList.length > 0) {
      for (let i = 0; i < this.state.fileList.length; ++i) {
        const formData = new FormData();
        formData.append("file", this.state.fileList[i]);
        const respo = await this.props.channel.sendMessage(formData);
        raiseChatNotificationFunc(
          this.props.formatMessage(messages.newDocumentUploadedNotify)
        );
      }
      this.setState({ fileList: [] });
    }
  };

  handleUpload = () => {
    this.sendMessage();
  };

  beforeUpload = (file) => {
    this.setState((state) => ({
      fileList: [...state.fileList, file],
    }));
    return true;
  };

  handleConsultationModal = (e) => {
    e.preventDefault();
    this.setState({ viewConsultationModal: true });
  };

  closeConsultationModal = (e) => {
    e.preventDefault();
    this.setState({ viewConsultationModal: false });
  };

  sendPaymentMessage = (data) => async (e) => {
    const {
      authenticated_user,
      authenticated_category,
      raiseChatNotificationFunc,
    } = this.props;
    e.preventDefault();
    const { name, type, amount, productId } = data || {};
    const response = await this.props.channel.sendMessage(
      JSON.stringify({
        meta: {
          name,
          payment_type: type,
          type: CHAT_MESSAGE_TYPE.CONSULTATION,
          amount,
          productId,
        },
        author: {
          id: authenticated_user,
          category: authenticated_category,
        },
      })
    );

    const notificationMessage = this.props.formatMessage(
      messages.newPaymentAddedNotify,
      { name }
    );
    raiseChatNotificationFunc(notificationMessage);

    this.setState({ viewConsultationModal: false });
  };

  getConsultationOptions = () => {
    const { payment_products } = this.state;

    console.log("098181302 payment_products ", { payment_products });
    return Object.keys(payment_products).map((id) => {
      const { basic_info: { name, type, amount } = {} } =
        payment_products[id] || {};

      return (
        <div
          key={`consultation-${id}`}
          className="mb10 pointer"
          onClick={this.sendPaymentMessage({
            name,
            type,
            amount,
            productId: id,
          })}
        >
          <div className="flex justify-space-between align-center bw1 br5 p10">
            <div className="">
              <div className="fs18 fw700">{name}</div>
              <div>{CONSULTATION_FEE_TYPE_TEXT[type]}</div>
            </div>
            <div>{`Rs.${amount}/-`}</div>
          </div>
        </div>
      );
    });
  };

  render() {
    console.log("8929829 this.props", this.props);
    const { viewConsultationModal } = this.state;
    return (
      <Fragment>
        <Form
          onSubmit={this.sendMessage}
          className="chat-form"
          //style={{ position: "absolute", bottom: 0, left: 72, width: 264 }}
        >
          <div className="form-input">
            <Input
              type="text"
              value={this.state.newMessage}
              onChange={this.onMessageChanged}
              placeholder={this.props.formatMessage(messages.writeMessage)}
              className="message-input"
              suffix={
                <div className="form-button">
                  <Button htmlType="submit">
                    <img src={Send} className="h20" />
                  </Button>
                </div>
              }
            />
          </div>

          <div className="flex mr10 align-center">
            <Tooltip placement={"topRight"} title={"Request Consultation Fee"}>
              {" "}
              {/*formatMessage(messages.consultationFeeText)*/}
              <SwapOutlined
                className="text-white fs20 pointer br50 h36 w36 p8 bg-lighter-sky-blue"
                onClick={this.handleConsultationModal}
              />
            </Tooltip>
          </div>

          <Upload
            onClick
            customRequest={this.handleUpload}
            beforeUpload={this.beforeUpload}
            showUploadList={false}
            multiple={false}
            accept=".jpg,.jpeg,.png,.pdf,.mp4"
            className="flex align-center chat-upload-component"
          >
            <div className="chat-upload-btn">
              <Icon
                type="paper-clip"
                className="text-white fs20 pointer br50 h36 w36 p8 bg-lighter-sky-blue"
              />
            </div>
          </Upload>
        </Form>
        {viewConsultationModal && (
          <Modal
            className=""
            visible={viewConsultationModal}
            title={"Consultation Fees"}
            closable
            mask
            maskClosable
            onCancel={this.closeConsultationModal}
            wrapClassName={"chat-media-modal-dialog"}
            width={`50%`}
          >
            {this.getConsultationOptions()}
          </Modal>
        )}
      </Fragment>
    );
  }
}

class TwilioChat extends Component {
  constructor(props) {
    super(props);
    this.ChatForm = Form.create()(ChatForm);
    this.state = {
      token: "",
      chatReady: false,
      messages: [],
      messagesLoading: true,
      newMessage: "",
      other_user_online: false,
      otherUserLastConsumedMessageIndex: null,
      other_typing: false,
      loadSymptoms: true,
      loadingMessageDetails: false,
      message_numbers: 0,

      chatBlocked: false,
      videoCallBlocked: false,
    };
    this.channelName = "test";
  }

  scrollToBottom = () => {
    const chatEndElement = document.getElementById("chatEnd");
    chatEndElement.focus();
    chatEndElement.scrollIntoView({ behavior: "smooth" });
  };

  async componentDidMount() {
    const { fetchChatAccessToken, authenticated_user } = this.props;

    const response = await fetchChatAccessToken(authenticated_user);
    const {
      status = false,
      payload: { data: { token: chatToken = "" } = {} } = {},
    } = response;

    if (status) {
      this.setState({ token: chatToken }, () => {
        this.getToken();
      });
    }
    this.scrollToBottom();

    this.intervalID = setInterval(() => this.tick(), 2000);
    await this.props.getAllFeatures();

    this.checkFeatures();
  }

  componentDidUpdate(prevProps, prevState) {
    const { roomId, chatMessages } = this.props;
    const { roomId: prevRoomId } = prevProps;
    const { token } = prevState;
    if (roomId !== prevRoomId && token) {
      if (!chatMessages[roomId]) {
        this.setState({ messagesLoading: true });
      }
      this.getToken();
      this.scrollToBottom();
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  tick = async () => {
    const { authenticated_user } = this.props;
    const members = this.channel ? await this.channel.getMembers() : [];
    let other_user_online = false;
    let otherUserLastConsumedMessageIndex = 0;

    await Promise.all(
      members.map(async (mem) => {
        if (mem.identity !== `${authenticated_user}`) {
          const other_user = await mem.getUser();

          other_user_online = other_user.online;
          otherUserLastConsumedMessageIndex = mem.lastConsumedMessageIndex;

          other_user.on("updated", (obj) => {
            console.log("user_updated", obj);
          });
        }
      })
    );
    if (otherUserLastConsumedMessageIndex) {
      this.setState({
        other_user_online,
        otherUserLastConsumedMessageIndex,
      });
    } else {
      this.setState({
        other_user_online,
      });
    }
  };

  getToken = () => {
    const { roomId } = this.props;
    let channel = `careplan-${roomId.split("-")[0]}-${
      roomId.split("-")[3]
    }-adherelive-demo`;
    console.log("channel", channel);
    // this.channelName = roomId ? roomId : "test";
    // AKSHAY NEW CODE IMPLEMENTATIONS
    this.channelName = channel;

    this.initChat();
  };

  formatMessage = (data, ...rest) =>
    this.props.intl.formatMessage(data, ...rest);

  initChat = () => {
    this.chatClient = new Chat(this.state.token);

    this.chatClient
      .initialize()
      .then(this.clientInitiated.bind(this))
      .catch((err) => {
        console.log("chatClient AUTH error", err);
      });
  };

  checkOtherTyping = (obj) => {
    const { authenticated_user = 1 } = this.props;
    const { identity = null } = obj;
    if (identity !== `${authenticated_user}`) {
      this.setState({ other_typing: true });
    }
  };

  otherTypingStopped = (obj) => {
    const { authenticated_user = 1 } = this.props;
    const { identity = null } = obj;
    if (identity !== `${authenticated_user}`) {
      this.setState({ other_typing: false });
    }
  };

  clientInitiated = async () => {
    const { authenticated_user } = this.props;
    this.setState({ chatReady: true }, () => {
      this.chatClient
        .getChannelByUniqueName(this.channelName)
        .then((channel) => {
          if (channel) {
            return (this.channel = channel);
          }
        })
        .catch((err) => {
          if (err.body.code === 50300) {
            return this.chatClient.createChannel({
              uniqueName: this.channelName,
            });
          }
        })
        .then((channel) => {
          this.channel = channel;
          window.channel = channel;
          if (channel.channelState.status !== "joined") {
            return this.channel.join();
          } else {
            return this.channel;
          }
        })
        .then(async () => {
          this.channel.getMessages().then(this.messagesLoaded);
          this.channel.on("messageAdded", this.messageAdded);
          this.channel.on("typingStarted", (obj) => {
            this.checkOtherTyping(obj);
          });
          this.channel.on("typingEnded", (obj) => {
            this.otherTypingStopped(obj);
          });
          const members = await this.channel.getMembers();
          let other_user_online = false;
          let otherUserLastConsumedMessageIndex = 0;

          await Promise.all(
            members.map(async (mem) => {
              if (mem.identity !== `${authenticated_user}`) {
                const other_user = await mem.getUser();

                other_user_online = other_user.online;
                otherUserLastConsumedMessageIndex =
                  mem.lastConsumedMessageIndex;

                other_user.on("updated", (obj) => {
                  console.log("user_updated", obj);
                });
              }
            })
          );
          // console.log('didMount======================>clientInitiatedlast');
          this.setState({
            other_user_online,
            otherUserLastConsumedMessageIndex,
          });
        });
    });
  };

  updateMessageRecieved = (messages) => {
    const { otherUserLastConsumedMessageIndex } = this.state;
    const { authenticated_user } = this.props;

    for (let messageData of messages) {
      const {
        index,
        attributes: { sender_id } = {},
        author,
      } = messageData.state;
      if (
        index <= otherUserLastConsumedMessageIndex &&
        (sender_id === `${authenticated_user}` ||
          author === `${authenticated_user}`)
      ) {
        messageData.received = true;
        messageData.sent = true;
      }
    }
    return messages;
  };

  messagesLoaded = (messagePage) => {
    const { roomId, addMessageOfChat } = this.props;
    if (messagePage.items.length) {
      let message = messagePage.items[0];
      const { channel: { channelState: { uniqueName = "" } = {} } = {} } =
        message;
      if (!uniqueName.localeCompare(roomId)) {
        // let messages = this.updateMessageRecieved(messagePage.items);
        addMessageOfChat(roomId, messagePage.items);
      }
    }
    this.setState(
      {
        messagesLoading: false,
      },
      this.scrollToBottom
    );
    console.log("didMount======================>messagesLoaded", moment());

    console.log("didMount======================>msgs loaded", moment());
  };

  messageAdded = (message) => {
    const { roomId, addMessageOfChat } = this.props;
    addMessageOfChat(roomId, message);
    // this.setState((prevState, props) => {
    //     const newVal = [...prevState.messages, message];
    //     return ({ messages: newVal })
    // });

    this.scrollToBottom();
    this.channel.setAllMessagesConsumed();
  };

  logOut = (event) => {
    event.preventDefault();
    this.setState({
      token: "",
      chatReady: false,
      messages: [],
    });
    this.chatClient.shutdown();
    this.channel = null;
  };

  getReplyMetaData = (heading, side, part) => {
    if (side === "" || part.length === 0) {
      return null;
    }

    return (
      <div>
        <div className="bot-msg-detail-container wp50">
          <span className="bot-m-h ">{heading}</span>

          <div className="bot-msg-details">
            <span className="fs14 fw500  ">{side}</span>
            <span className="dot">&bull;</span>
            <span className="side">{part}</span>
          </div>
        </div>
      </div>
    );
  };

  getReplyMessage = () => {
    const { replyMessadeId = null } = this.props;
    const { updateReplyMessageId } = this.props;
    const Container = document.getElementById(replyMessadeId);
    const metaDataContainer = Container.getElementsByClassName(
      "bot-msg-detail-container"
    )[0];
    const heading = Container.getElementsByClassName("bot-m-h")[0].innerHTML;
    const msgDetailsContainer =
      Container.getElementsByClassName("bot-msg-details");

    const msgChildNodes = msgDetailsContainer[0].children;
    const data1 = msgChildNodes[0].innerHTML;
    const data2 = msgChildNodes[2].innerHTML;
    let mess = "";
    const metaDataReply = this.getReplyMetaData(heading, data1, data2);

    mess = (
      <div className="wp100 flex direction-row bg-whitesmoke relative">
        <div className="wp90 flex direction-column justify-space-between p20 mh100">
          {metaDataReply}
        </div>
        <div
          className="fs30 h-cursor-p close-reply"
          onClick={this.unsetReplyId}
        ></div>
      </div>
    );
    return mess;
  };

  unsetReplyId = (e) => {
    e.preventDefault();
    const { updateReplyMessageId } = this.props;
    updateReplyMessageId();
  };

  handleReply = (data) => (e) => {
    e.preventDefault();
    this.setState({ replyMeta: data });
  };

  getMenu = () => {
    const menuList = this.getMenuList();
    return (
      <Menu>
        {menuList.map((item) => {
          const { label, pressHandler } = item;
          return (
            <Menu.Item onClick={pressHandler}>
              <div className="tac">{label}</div>
            </Menu.Item>
          );
        })}
      </Menu>
    );
  };

  getMenuList = () => {
    const menuList = [];
    const menuItemsKeys = Object.keys(MENU_ITEMS);
    for (const key of menuItemsKeys) {
      const menuItemData = this.getMenuItemData(MENU_ITEMS[key]);
      menuList.push(menuItemData);
    }

    return menuList;
  };

  getMenuItemData = (key) => {
    const { chatBlocked, videoCallBlocked } = this.state;
    let label = "";
    switch (key) {
      case MENU_ITEMS.TOGGLE_CHAT_MESSAGES_PERMISSION:
        label = chatBlocked
          ? this.formatMessage(messages.unblockChatMessage)
          : this.formatMessage(messages.blockChatMessage);
        return {
          label: label,
          pressHandler: this.toggleChatPermission,
        };
      case MENU_ITEMS.TOGGLE_VIDEO_CALL_PERMISSION:
        label = videoCallBlocked
          ? this.formatMessage(messages.unblockVideoCall)
          : this.formatMessage(messages.blockVideoCall);
        return {
          label: label,
          pressHandler: this.toggleVideoCallPermission,
        };
      default:
        return;
    }
  };

  checkFeatures = () => {
    const { features_mappings = {}, patientId } = this.props;
    let chatBlocked = false,
      videoCallBlocked = false;

    const chatFeatureId = this.getFeatureId(FEATURES.CHAT);
    const videoCallFeatureId = this.getFeatureId(FEATURES.VIDEO_CALL);
    const { [patientId]: mappingsData = [] } = features_mappings;
    if (mappingsData.indexOf(chatFeatureId) >= 0) {
      chatBlocked = false;
    } else {
      chatBlocked = true;
    }

    if (mappingsData.indexOf(videoCallFeatureId) >= 0) {
      videoCallBlocked = false;
    } else {
      videoCallBlocked = true;
    }

    this.setState({ chatBlocked, videoCallBlocked });
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

  toggleChatPermission = async () => {
    const { authenticated_category, patientId } = this.props;
    if (
      authenticated_category !== USER_CATEGORY.DOCTOR &&
      authenticated_category !== USER_CATEGORY.HSP
    ) {
      return;
    }

    const { chatBlocked } = this.state;
    const mute = chatBlocked ? false : true;

    const response = await this.props.toggleChatPermission(patientId, { mute });
    const { status = false, payload = {} } = response;

    if (status) {
      const successMessage = chatBlocked
        ? this.formatMessage(messages.successInUnBlockingChatPermission)
        : this.formatMessage(messages.successInBlockingChatPermission);
      message.success(successMessage);
      this.setState({ chatBlocked: !chatBlocked });
    } else {
      const { message = "" } = payload;
      const errorMessage = message
        ? message
        : chatBlocked
        ? this.formatMessage(messages.errorInUnBlockingChatPermission)
        : this.formatMessage(messages.errorInBlockingChatPermission);
      message.error(errorMessage);
    }
  };

  toggleVideoCallPermission = async () => {
    const { authenticated_category, patientId } = this.props;
    if (
      authenticated_category !== USER_CATEGORY.DOCTOR &&
      authenticated_category !== USER_CATEGORY.HSP
    ) {
      return;
    }

    const { videoCallBlocked } = this.state;
    const block = videoCallBlocked ? false : true;

    const response = await this.props.toggleVideoPermission(patientId, {
      block,
    });

    const { status = false, payload = {} } = response;

    if (status) {
      const successMessage = videoCallBlocked
        ? this.formatMessage(messages.successInUnBlockingVideoPermission)
        : this.formatMessage(messages.successInBlockingVideoPermission);
      message.success(successMessage);
      this.setState({ videoCallBlocked: !videoCallBlocked });
    } else {
      const { message = "" } = payload;
      const errorMessage = message
        ? message
        : videoCallBlocked
        ? this.formatMessage(messages.errorInUnBlockingVideoPermission)
        : this.formatMessage(messages.errorInBlockingVideoPermission);
      message.error(errorMessage);
    }
  };

  raiseChatNotificationFunc = (message) => {
    const {
      patientId = null,
      patients = {},
      raiseChatNotification,
    } = this.props;

    const {
      [patientId]: {
        basic_info: { user_id: patientUserId = null } = {},
        user_role_id: patientRoleId = null,
      } = {},
    } = patients;

    const data = {
      message,
      receiver_id: patientUserId,
      receiver_role_id: patientRoleId,
    };

    const resp = raiseChatNotification(data);
  };

  render() {
    const { getDoctorConsultations } = this.props;
    const { ChatForm, handleReply } = this;

    const {
      messagesLoading = false,
      other_user_online = false,
      other_typing = false,
      otherUserLastConsumedMessageIndex,
      chatBlocked = false,
      videoCallBlocked = false,
    } = this.state;
    const {
      placeVideoCall,
      patientDp = "",
      patientName = "",
      replyMessadeId = null,
    } = this.props;
    const { ...props } = this.props;

    return (
      <Fragment>
        <Header
          placeVideoCall={placeVideoCall}
          patientName={patientName}
          patientDp={patientDp}
          isOnline={other_user_online}
          otherTyping={other_typing}
          formatMessage={this.formatMessage}
          getMenu={this.getMenu}
          videoCallBlocked={videoCallBlocked}
        />
        <div className="twilio-chat-container">
          <div className="twilio-chat-body">
            {messagesLoading ? (
              <div className="wp100 hp100 flex justify-center align-center">
                <Spin />
              </div>
            ) : (
              <ChatMessageDetails
                handleReply={handleReply}
                {...props}
                scrollToBottom={this.scrollToBottom}
                otherUserLastConsumedMessageIndex={
                  otherUserLastConsumedMessageIndex
                }
              />
            )}
            <div id="chatEnd" style={{ float: "left", clear: "both" }} />
          </div>

          {replyMessadeId ? this.getReplyMessage() : null}
        </div>

        {chatBlocked && (
          <div className="flex mb12 mt12 fs20 justify-center align-center wp100">
            {this.formatMessage(messages.chatBlockedMessage)}
          </div>
        )}

        <div className="twilio-chat-footer">
          {/* <div className="footer-left"> */}
          {/* <img
              src={CloseChatIcon}
              className="back-image"
              onClick={this.props.hideChat}
              alt="chatImg"
            /> */}
          {/* </div> */}

          {!chatBlocked && (
            <div className="footer-right wp100">
              <ChatForm
                messages={this.messages}
                channel={this.channel}
                formatMessage={this.formatMessage}
                getDoctorConsultations={getDoctorConsultations}
                raiseChatNotificationFunc={this.raiseChatNotificationFunc}
                {...this.props}
              />
            </div>
          )}
        </div>
      </Fragment>
    );
  }
}

export default injectIntl(TwilioChat);
