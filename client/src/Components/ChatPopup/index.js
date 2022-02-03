import React, { Component, Fragment } from "react";
import {
  Form,
  Input,
  Button,
  Spin,
  // Avatar,
  Upload,
  // Modal,
  message,
} from "antd";
// import moment from "moment";
import Chat from "twilio-chat";
// import DoubleTick from "../../Assets/images/double-tick-indicator.png";
import Send from "../../Assets/images/send.png";
// import SingleTick from "../../Assets/images/check-symbol.png";
import PaperClip from "../../Assets/images/attachPop.png";
// import ImagePlaceHolder from "../../Assets/images/image_placeholder.png";
import Close from "../../Assets/images/close.png";
import Maximize from "../../Assets/images/maximize.png";
// import Download from "../../Assets/images/down-arrow.png";
// import File from "../../Assets/images/file.png";
import messages from "./messages";
import { injectIntl } from "react-intl";
// import bodyImage from "../../../src/Assets/images/body.jpg";
// import CloseChatIcon from "../../Assets/images/ico-vc-message-close.png";
import CallIcon from "../../Assets/images/telephone.png";
import CallDisabledIcon from "../../Assets/images/call-disabled.png";

import {
  // USER_ADHERE_BOT,
  // CHAT_MESSAGE_TYPE,
  FEATURES,
  USER_CATEGORY,
} from "../../constant";
import ChatMessageDetails from "./chatMessageDetails";

import Menu from "antd/es/menu";
import Dropdown from "antd/es/dropdown";
import { MENU_ITEMS } from "../ChatFullScreen/twilioChat";
import { MoreOutlined } from "@ant-design/icons";

import Tooltip from "antd/es/tooltip";
import isEmpty from "../../Helper/is-empty";

const Header = ({
  placeVideoCall,
  patientName,
  patientDp = "",
  isOnline = false,
  onHeaderClick,
  close,
  maximizeChat,
  otherTyping = false,
  formatMessage,
  videoCallBlocked,
  getMenu,
}) => {
  // let pic = patientName ?
  //     <Avatar src={patientDp}>{patientName[0]}</Avatar> : <Avatar src={patientDp} icon="user" />
  return (
    <div className="chat-patientListheader-PopUp pt4 pb4">
      <div className="flex direction-row align-center ">
        <div className="flex direction-column  justify-center">
          <div
            className="doctor-name-chat-header-popup pointer"
            onClick={onHeaderClick}
          >
            {patientName.length > 10
              ? `${patientName.substring(0, 11)}..`
              : patientName}
          </div>
          <div className="doctor-name-chat-header-online-popup ml10">
            {otherTyping
              ? formatMessage(messages.typing)
              : isOnline
              ? formatMessage(messages.online)
              : formatMessage(messages.offline)}
          </div>
        </div>
      </div>

      <div className="flex direction-row align-center">
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

        <img
          src={Maximize}
          className="callIcon-header-PopUp mr20"
          onClick={maximizeChat}
        />

        <Dropdown
          overlay={getMenu()}
          trigger={["click"]}
          placement="bottomRight"
          className="mr20"
        >
          <MoreOutlined className="text-white fs25 pointer" />
        </Dropdown>

        <img
          src={Close}
          className="callIcon-header-PopUp mr20"
          onClick={close}
        />
      </div>
    </div>
  );
};

const MinimizedHeader = ({
  placeVideoCall,
  patientName,
  isOnline = false,
  onHeaderClick,
  close,
}) => {
  return (
    <div className="chat-patientListheader-PopUp-minimized">
      <div className="flex direction-row align-center">
        <div className="flex direction-column align-center justify-center">
          <div
            className="doctor-name-chat-header mb2 pointer"
            onClick={onHeaderClick}
          >
            {patientName}
          </div>
          {/* <div className='doctor-name-chat-header-online-popup ml10'>{otherTyping ? formatMessage(messages.typing) : isOnline ? formatMessage(messages.online) : formatMessage(messages.offline)}</div> */}
        </div>
      </div>
      <div>
        <img
          src={Close}
          className="callIcon-header-PopUp mr20"
          onClick={close}
        />
      </div>
    </div>
  );
};

class ChatForm extends Component {
  constructor() {
    super();
    this.state = {
      newMessage: "",
      fileList: [],
    };
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
        const respo = await this.props.channel.sendMessage(formData, {
          sender_id: authenticated_user,
        });

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

  render() {
    return (
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

        <Upload
          onClick
          customRequest={this.handleUpload}
          beforeUpload={this.beforeUpload}
          showUploadList={false}
          multiple={false}
          accept=".jpg,.jpeg,.png,.pdf,.mp4"
          className="chat-upload-component"
        >
          <div className="chat-upload-btn">
            {/* <Icon type="paper-clip" className='h20 mt6' /> */}
            <img src={PaperClip} className="h20 mt6 pointer" />
          </div>
        </Upload>
      </Form>
    );
  }
}

class ChatPopUp extends Component {
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
    const { chats: { minimized = false } = {} } = this.props;
    if (!minimized) {
      const chatEndElement = document.getElementById("chatEnd");
      chatEndElement.focus();
      chatEndElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  componentDidMount = async () => {
    // this.getToken();
    const {
      twilio: { chatToken = "" },
    } = this.props;
    this.setState({ token: chatToken }, this.getToken);
    // this.scrollToBottom();

    this.intervalID = setInterval(() => this.tick(), 2000);
    await this.props.getAllFeatures();
    this.checkChatAndVideoFeaturesAllowed();
  };

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  componentDidUpdate(prevProps, prevState) {
    const { roomId, chatMessages } = this.props;
    const { message_numbers, loadSymptoms } = this.state;
    const { messageIds = [] } = chatMessages[roomId] || {};
    if (
      chatMessages[roomId] != undefined &&
      messageIds.length > 0 &&
      message_numbers != messageIds.length &&
      !loadSymptoms
    ) {
      this.setState({ loadSymptoms: true, message_numbers: messageIds.length });
    }
    const { roomId: prevRoomId } = prevProps;
    if (roomId !== prevRoomId) {
      this.setState({ messagesLoading: true });
      this.getToken();
      this.scrollToBottom();
    }
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

  formatMessage = (data) => this.props.intl.formatMessage(data);

  getToken = () => {
    const {
      // match: {
      roomId,
      // },
      fetchChatAccessToken,
      authenticated_user,
      carePlan,
      dashboardChat,
      care_plans,
    } = this.props;
    const { payload: { patient_id } = {} } = this.props;
    let finalChannel = "";
    if (dashboardChat == true) {
      // AKSHAY NEW CODE IMPLEMENTATIONS
      if (!isEmpty(care_plans)) {
        var filtered = Object.fromEntries(
          Object.entries(care_plans).filter(
            ([key, value]) =>
              value.basic_info.patient_id == patient_id &&
              value.channel_id !== null &&
              value.channel_id.split("-")[4] !== "demo_group"
          )
        );

        for (const key in filtered) {
          finalChannel = filtered[key].channel_id;
        }
      }
    } else {
      finalChannel = carePlan.channel_id;
    }

    console.log("finalChannel", finalChannel);

    // this.channelName = roomId ? roomId : "test";
    // AKSHAY NEW CODE IMPLEMENTATIONS
    this.channelName = finalChannel;

    // fetchChatAccessToken(authenticated_user).then(result => {
    //     this.setState((prevState, props) => {
    //         return {
    //             token: props.twilio.chatToken
    //         };
    //     },
    //         () => {
    this.initChat();
    //         }
    //     );
    // });
  };

  initChat = () => {
    this.chatClient = new Chat(this.state.token);
    this.chatClient
      .initialize()
      .then(this.clientInitiated.bind(this))
      .catch((err) => {
        console.log("79873973892 twilio chat connection error --> ", err);
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
            // console.log("typing started:::::::::::::: ", obj);
            this.checkOtherTyping(obj);
            // const { identity = null } = obj;
            // if (identity !== `${authenticated_user}`) {
            //     console.log("typing started:::::::::::::: 11");
            //     this.setState({ other_typing: true });
            // }
          });
          this.channel.on("typingEnded", (obj) => {
            // console.log("typing stopped: :::::: ", obj);
            this.otherTypingStopped(obj);
          });
          const members = await this.channel.getMembers();

          members.map(async (mem) => {
            if (mem.identity !== `${authenticated_user}`) {
              const other_user = await mem.getUser();

              this.setState({
                other_user_online: other_user.online,
                otherUserLastConsumedMessageIndex: mem.lastConsumedMessageIndex,
              });

              other_user.on("updated", (obj) => {
                console.log("user_updated", obj);
              });
            }
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
    let messages = this.updateMessageRecieved(messagePage.items);
    const { carePlan, roomId, addMessageOfChat, care_plans, dashboardChat } =
      this.props;
    const { payload: { patient_id } = {} } = this.props;
    console.log("messages", messages);
    // AKSHAY NEW CODE IMPLEMENTATIONS
    let finalChannel = "";
    if (dashboardChat == true) {
      // AKSHAY NEW CODE IMPLEMENTATIONS
      if (!isEmpty(care_plans)) {
        var filtered = Object.fromEntries(
          Object.entries(care_plans).filter(
            ([key, value]) =>
              value.basic_info.patient_id == patient_id &&
              value.channel_id !== null &&
              value.channel_id.split("-")[4] !== "demo_group"
          )
        );
        console.log("filtered", filtered);
        for (const key in filtered) {
          finalChannel = filtered[key].channel_id;
        }
      }
    } else {
      finalChannel = carePlan.channel_id;
    }
    console.log("finalChannel", finalChannel);
    addMessageOfChat(finalChannel, messages);
    // OLD CODE OF VINEET
    // addMessageOfChat(roomId, message);
    this.setState(
      {
        messagesLoading: false,
        // messages: messagePage.items,
        // messages
      },
      this.scrollToBottom
    );
  };

  messageAdded = (message) => {
    const { carePlan, roomId, addMessageOfChat, dashboardChat, care_plans } =
      this.props;
    const { payload: { patient_id } = {} } = this.props;
    // AKSHAY NEW CODE IMPLEMENTATIONS
    let finalChannel = "";
    if (dashboardChat == true) {
      // AKSHAY NEW CODE IMPLEMENTATIONS
      if (!isEmpty(care_plans)) {
        var filtered = Object.fromEntries(
          Object.entries(care_plans).filter(
            ([key, value]) =>
              value.basic_info.patient_id == patient_id &&
              value.channel_id !== null &&
              value.channel_id.split("-")[4] !== "demo_group"
          )
        );
        console.log("filtered", filtered);
        for (const key in filtered) {
          finalChannel = filtered[key].channel_id;
        }
      }
    } else {
      finalChannel = carePlan.channel_id;
    }
    console.log("finalChannel", finalChannel);
    addMessageOfChat(finalChannel, message);
    // OLD CODE OF VINEET
    // addMessageOfChat(roomId, message);
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

  // onClickDownloader = (link, name) => () => {
  //     // e.preventDefault();
  //     // const { url, message } = this.state;
  //     if (link && link.length > 0) {
  //         fetch(link, {
  //             method: "GET"
  //         })
  //             .then(response => response.blob())
  //             .then(blob => {
  //                 const blobUrl = window.URL.createObjectURL(new Blob([blob]));
  //                 const downloader = document.createElement("a");
  //                 downloader.href = blobUrl;
  //                 downloader.download = name;
  //                 downloader.target = "_blank";
  //                 document.body.appendChild(downloader);
  //                 downloader.click();
  //                 document.body.removeChild(downloader);
  //             });
  //     }
  // };
  // renderSymptomMessage = (message) => {
  //     let symptomId = parseInt(message.split(':')[1]);
  //     const { symptoms = {}, upload_documents = {} } = this.props;
  //     const { text = '', config: { parts = [] } = {}, audio_document_ids = [], image_document_ids = [] } = symptoms[symptomId] || {};
  //     let mediaLinkIndex = audio_document_ids.length ? audio_document_ids[0] : image_document_ids.length ? image_document_ids[0] : '';
  //     let mediaLink = '';
  //     let mediaName = '';
  //     if (mediaLinkIndex) {
  //         const { basic_info: { document = '', name = '' } = {} } = upload_documents[mediaLinkIndex] || {};
  //         mediaLink = document;
  //         mediaName = name;
  //     }
  //     console.log('ryutduruytxud===================>', symptomId, text, parts[0], symptoms[symptomId], symptoms);
  //     return (
  //         <div className='flex direction-column'>
  //             <div className={'fs14'}>{parts.length ? parts[0] : ''}</div>
  //             <div className={'fs12'}>{text}</div>
  //             {image_document_ids.length ? (<div
  //             // onClick={this.openModal}
  //             >
  //                 <img
  //                     className="chat-media-message-image pointer"
  //                     src={mediaLink}
  //                     alt="Uploaded Image"
  //                 />
  //             </div>) : audio_document_ids.length ? (
  //                 <div className='downloadable-file'>
  //                     <img src={File} className='h20 mr10' />
  //                     <div className='fs14 mr10'>{mediaName}</div>
  //                     <img src={Download} className='h20 mr10 pointer' onClick={this.onClickDownloader(mediaLink, mediaName)} />
  //                 </div>
  //             ) : null}
  //         </div>
  //     );
  // }
  // renderMessages() {
  //     const { authenticated_user, users, roomId, chatMessages, patientDp } = this.props;
  //     const { otherUserLastConsumedMessageIndex } = this.state;
  //     const { messages: messagesArray = [] } = chatMessages[roomId] || {};
  //     if (messagesArray.length > 0) {
  //         // const messagesArray = this.state.messages;
  //         const messagesToRender = [];
  //         for (let i = 0; i < messagesArray.length; ++i) {
  //             const message = messagesArray[i];
  //             const prevMessage = i > 1 ? messagesArray[i - 1] : 1;
  //             let sameDate = message && prevMessage && message.state && prevMessage.state ? moment(message.state.timestamp).isSame(moment(prevMessage.state.timestamp), 'date') : false;

  //             // console.log("jskdjskjsd 23456789034567 messagesArray ------------> ", sameDate,message,prevMessage,message.state,prevMessage.state,moment(message.state.timestamp).isSame(moment(prevMessage.state.timestamp),'date'));
  //             if (!sameDate) {
  //                 messagesToRender.push(
  //                     <div className='mt16 mb16 flex wp100 text-grey justify-center fs12'>{moment(message.state.timestamp).isSame(moment(), 'date') ? this.formatMessage(messages.today) : moment(message.state.timestamp).format('ll')}</div>
  //                 )
  //             }
  //             const { state: { index = 1 } = {} } = message;
  //             const user = users[message.state.author]
  //                 ? users[message.state.author]
  //                 : {};
  //             // const { basicInfo: { profilePicLink: profilePic } = {} } = user;
  //             messagesToRender.push(
  //                 <Fragment key={message.state.sid}>
  //                     {parseInt(message.state.author) !== parseInt(authenticated_user) ? (
  //                         <div className="chat-messages">
  //                             {/* <div
  //                   className={
  //                     "chat-message-box other " +
  //                     (message.type === "media" ? "media-text-width" : "")
  //                   }
  //                 > */}
  //                             <div className="chat-avatar">
  //                                 <span className="twilio-avatar">
  //                                     <Avatar src={patientDp} />
  //                                 </span>
  //                                 {message.type === "media" ? (
  //                                     <div className="chat-text">
  //                                         <div className="clickable white chat-media-message-text">
  //                                             <MediaComponent message={message}></MediaComponent>
  //                                         </div>
  //                                     </div>
  //                                 ) : message.state.body.includes('symptom') ? (
  //                                     <div className="chat-text">{this.renderSymptomMessage(message.state.body)}</div>
  //                                 ) : (
  //                                             <div className="chat-text">{message.state.body}</div>
  //                                         )}
  //                             </div>
  //                             <div className="chat-time start">
  //                                 {moment(message.state.timestamp).format("H:mm")}
  //                             </div>
  //                             {/* </div> */}
  //                         </div>
  //                     ) : (
  //                             <div className="chat-messages end">
  //                                 {/* <div
  //                   className={
  //                     "chat-message-box " +
  //                     (message.type === "media" ? "media-text-width" : "")
  //                   }
  //                 > */}
  //                                 {message.type === "media" ? (
  //                                     <div className="chat-text end">
  //                                         <div className="clickable white chat-media-message-text">
  //                                             <MediaComponent message={message}></MediaComponent>
  //                                         </div>
  //                                     </div>
  //                                 ) : (
  //                                         <div className="chat-text end">{message.state.body}</div>
  //                                     )}
  //                                 {/* <div className="chat-text end">{message.state.body}</div> */}
  //                                 <div className="flex justify-end">
  //                                     <div className="chat-time mr-4">
  //                                         {moment(message.state.timestamp).format("H:mm")}
  //                                     </div>
  //                                     <img className={index < otherUserLastConsumedMessageIndex ? `h14 mt4` : `h12 mt4`} src={index <= otherUserLastConsumedMessageIndex ? DoubleTick : SingleTick} />
  //                                 </div>
  //                                 {/* </div> */}
  //                                 {/* <div className="chat-avatar left">
  //                 <Avatar src={profilePic} />
  //               </div> */}
  //                             </div>
  //                         )}
  //                 </Fragment>
  //             );
  //         }
  //         return messagesToRender;
  //     } else {
  //         return "";
  //     }
  // }

  checkChatAndVideoFeaturesAllowed = () => {
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

  getMenu = () => {
    const menuList = this.getMenuList();
    return (
      <Menu>
        {menuList.map((item, index) => {
          const { label, pressHandler } = item;
          return (
            <Menu.Item onClick={pressHandler} key={`chat-popup-menu-${index}`}>
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
    const { ChatForm } = this;
    const {
      chatMessages,
      roomId,
      authenticated_user,
      dashboardChat,
      care_plans,
      carePlan,
    } = this.props;
    const { payload: { patient_id } = {} } = this.props;
    const {
      messagesLoading = false,
      other_user_online = false,
      other_typing = false,
      otherUserLastConsumedMessageIndex,
      chatBlocked,
      videoCallBlocked,
    } = this.state;
    const { ...props } = this.props;
    const {
      placeVideoCall,
      patientName = "",
      chats: { minimized = false } = {},
      minimizePopUp,
      maximizePopUp,
      closePopUp,
      maximizeChat,
    } = this.props;
    if (minimized) {
      return (
        <MinimizedHeader
          patientName={patientName}
          isOnline={other_user_online}
          onHeaderClick={maximizePopUp}
          close={closePopUp}
        />
      );
    }

    let finalChannel = "";
    if (dashboardChat == true) {
      // AKSHAY NEW CODE IMPLEMENTATIONS
      if (!isEmpty(care_plans)) {
        var filtered = Object.fromEntries(
          Object.entries(care_plans).filter(
            ([key, value]) =>
              value.basic_info.patient_id == patient_id &&
              value.channel_id !== null &&
              value.channel_id.split("-")[4] !== "demo_group"
          )
        );
        console.log("filtered", filtered);
        for (const key in filtered) {
          finalChannel = filtered[key].channel_id;
        }
      }
    } else {
      finalChannel = carePlan.channel_id;
    }

    return (
      <Fragment>
        <div className={"popup-chatWindow"}>
          <Header
            placeVideoCall={placeVideoCall}
            patientName={patientName}
            isOnline={other_user_online}
            onHeaderClick={minimizePopUp}
            close={closePopUp}
            maximizeChat={maximizeChat}
            otherTyping={other_typing}
            formatMessage={this.formatMessage}
            videoCallBlocked={videoCallBlocked}
            getMenu={this.getMenu}
          />
          <div className="twilio-chat-container-popUp">
            <div className="twilio-chat-body">
              {messagesLoading ? (
                <div className="wp100 hp100 flex justify-center align-center">
                  <Spin size="default" />
                </div>
              ) : (
                <ChatMessageDetails
                  scrollToBottom={this.scrollToBottom}
                  {...props}
                  otherUserLastConsumedMessageIndex={
                    otherUserLastConsumedMessageIndex
                  }
                  //AKSHAY NEW CODE IMPLEMENTATIONS
                  channelId={finalChannel}
                />
              )}
              <div id="chatEnd" style={{ float: "left", clear: "both" }} />
            </div>
          </div>

          {chatBlocked && (
            <div className="flex ml14 mr14 h55 text-center fs12 justify-center align-center ">
              {this.formatMessage(messages.chatBlockedMessage)}
            </div>
          )}

          {!chatBlocked && (
            <div className="twilio-chat-footer-popUp">
              <div className="footer-right-popUp">
                <ChatForm
                  messages={this.messages}
                  channel={this.channel}
                  formatMessage={this.formatMessage}
                  raiseChatNotificationFunc={this.raiseChatNotificationFunc}
                  authenticated_user={authenticated_user}
                />
              </div>
            </div>
          )}
        </div>
      </Fragment>
    );
  }
}

export default injectIntl(ChatPopUp);
