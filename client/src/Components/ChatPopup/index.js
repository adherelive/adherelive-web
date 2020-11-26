import React, { Component, Fragment } from "react";
import { Form, Input, Button, Spin, Avatar, Upload, Modal } from "antd";
import moment from 'moment';
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
import messages from './messages';
import { injectIntl } from "react-intl";
import bodyImage from "../../../src/Assets/images/body.jpg";
// import CloseChatIcon from "../../Assets/images/ico-vc-message-close.png";
import CallIcon from '../../Assets/images/telephone.png';
import { USER_ADHERE_BOT, CHAT_MESSAGE_TYPE } from "../../constant";
import ChatMessageDetails from "./chatMessageDetails";

const Header = ({ placeVideoCall, patientName, patientDp = '', isOnline = false, onHeaderClick, close, maximizeChat, otherTyping = false, formatMessage }) => {
    // let pic = patientName ?
    //     <Avatar src={patientDp}>{patientName[0]}</Avatar> : <Avatar src={patientDp} icon="user" />
    return (
        <div className='chat-patientListheader-PopUp pt4 pb4' >
            <div className='flex direction-row align-center '>
                <div className='flex direction-column  justify-center'>
                    <div className='doctor-name-chat-header-popup pointer' onClick={onHeaderClick}>{patientName}</div>
                    <div className='doctor-name-chat-header-online-popup ml10'>{otherTyping ? formatMessage(messages.typing) : isOnline ? formatMessage(messages.online) : formatMessage(messages.offline)}</div>
                </div>
            </div>
            <div>
                <img src={CallIcon} className='callIcon-header-PopUp mr20' onClick={placeVideoCall} />

                <img src={Maximize} className='callIcon-header-PopUp mr20' onClick={maximizeChat} />

                <img src={Close} className='callIcon-header-PopUp mr20' onClick={close} />
            </div>
        </div>
    );
}

const MinimizedHeader = ({ placeVideoCall, patientName, isOnline = false, onHeaderClick, close }) => {
    return (
        <div className='chat-patientListheader-PopUp-minimized'>
            <div className='flex direction-row align-center'>
                <div className='flex direction-column align-center justify-center'>
                    <div className='doctor-name-chat-header mb2 pointer' onClick={onHeaderClick}>{patientName}</div>
                    {/* <div className='doctor-name-chat-header-online-popup ml10'>{otherTyping ? formatMessage(messages.typing) : isOnline ? formatMessage(messages.online) : formatMessage(messages.offline)}</div> */}
                </div>
            </div>
            <div>
                <img src={Close} className='callIcon-header-PopUp mr20' onClick={close} />
            </div>
        </div>
    );
}

class ChatForm extends Component {
    constructor() {
        super();
        this.state = {
            newMessage: "",
            fileList: [],
        };
    }

    onMessageChanged = event => {
        this.setState({ newMessage: event.target.value });
    };


    sendMessage = event => {
        if (event) {
            event.preventDefault();
        }
        let trimmedMessage = this.state.newMessage.trim();
        if (this.state.newMessage.length > 0 && trimmedMessage.length > 0) {
            const message = this.state.newMessage;
            this.setState({ newMessage: "" });
            this.props.channel.sendMessage(message);
        }
        if (this.state.fileList.length > 0) {
            for (let i = 0; i < this.state.fileList.length; ++i) {
                const formData = new FormData();
                formData.append("file", this.state.fileList[i]);
                this.props.channel.sendMessage(formData);
            }
            this.setState({ fileList: [] });
        }
    };


    handleUpload = () => {
        this.sendMessage();
    };

    beforeUpload = file => {
        this.setState(state => ({
            fileList: [...state.fileList, file]
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
                        className='message-input'
                        suffix={<div className="form-button">
                            <Button htmlType="submit"><img src={Send} className='h20' /></Button>
                        </div>}
                    />
                </div>

                <Upload
                    onClick
                    customRequest={this.handleUpload}
                    beforeUpload={this.beforeUpload}
                    showUploadList={false}
                    multiple={false}
                    accept="image/*"
                    className="chat-upload-component"
                >
                    <div className="chat-upload-btn">
                        {/* <Icon type="paper-clip" className='h20 mt6' /> */}
                        <img src={PaperClip} className='h20 mt6 pointer' />
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
            message_numbers: 0
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

    componentDidMount() {
        // this.getToken();
        const { twilio: { chatToken = '' } } = this.props;
        this.setState({ token: chatToken }, this.getToken)
        // this.scrollToBottom();

        this.intervalID = setInterval(() => this.tick(), 2000);
    }

    componentWillUnmount() {

        clearInterval(this.intervalID);
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            roomId,
            chatMessages
        } = this.props;
        const {
            message_numbers,
            loadSymptoms
        } = this.state;
        const { messageIds = [] } = chatMessages[roomId] || {};
        if (chatMessages[roomId] != undefined && messageIds.length > 0 && message_numbers != messageIds.length && !loadSymptoms) {
            this.setState({ loadSymptoms: true, message_numbers: messageIds.length });
        }
        const {
            roomId: prevRoomId
        } = prevProps;
        if (roomId !== prevRoomId) {
            this.setState({ messagesLoading: true });
            this.getToken();
            this.scrollToBottom();
        }
    }
    tick = async () => {
        console.log('897987 tick called78934793');
        const { authenticated_user } = this.props;
        const members = this.channel ? await this.channel.getMembers() : [];
        let other_user_online = false;
        let otherUserLastConsumedMessageIndex = 0;

        await Promise.all(members.map(async mem => {
            if (mem.identity !== `${authenticated_user}`) {
                const other_user = await mem.getUser();

                other_user_online = other_user.online;
                otherUserLastConsumedMessageIndex = mem.lastConsumedMessageIndex;


                other_user.on("updated", obj => {
                    console.log("user_updated", obj);
                });
            }
        }));
        if (otherUserLastConsumedMessageIndex) {
            this.setState({
                other_user_online,
                otherUserLastConsumedMessageIndex
            });
        } else {
            this.setState({
                other_user_online
            });
        }
    };


    formatMessage = data => this.props.intl.formatMessage(data);

    getToken = () => {
        const {
            // match: {
            roomId,
            // },
            fetchChatAccessToken,
            authenticated_user
        } = this.props;
        this.channelName =
            roomId ? roomId :
                "test";
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
        console.log('846328756839658932', this.channelName, this.state.token);
        this.chatClient = new Chat(this.state.token);
        this.chatClient.initialize().then(this.clientInitiated.bind(this)).catch(err => {
            console.log("79873973892 twilio chat connection error --> ", err);
        });
    };


    checkOtherTyping = (obj) => {
        const { authenticated_user = 1 } = this.props
        const { identity = null } = obj;
        if (identity !== `${authenticated_user}`) {
            this.setState({ other_typing: true });
        }
    }

    otherTypingStopped = (obj) => {
        const { authenticated_user = 1 } = this.props
        const { identity = null } = obj;
        if (identity !== `${authenticated_user}`) {
            this.setState({ other_typing: false });
        }
    }

    clientInitiated = async () => {
        const { authenticated_user } = this.props;
        this.setState({ chatReady: true }, () => {
            this.chatClient
                .getChannelByUniqueName(this.channelName)
                .then(channel => {
                    if (channel) {
                        return (this.channel = channel);
                    }
                })
                .catch(err => {
                    if (err.body.code === 50300) {
                        return this.chatClient.createChannel({
                            uniqueName: this.channelName
                        });
                    }
                })
                .then(channel => {
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
                    this.channel.on("typingStarted", obj => {
                        // console.log("typing started:::::::::::::: ", obj);
                        this.checkOtherTyping(obj);
                        // const { identity = null } = obj;
                        // if (identity !== `${authenticated_user}`) {
                        //     console.log("typing started:::::::::::::: 11");
                        //     this.setState({ other_typing: true });
                        // }
                    });
                    this.channel.on("typingEnded", obj => {
                        // console.log("typing stopped: :::::: ", obj);
                        this.otherTypingStopped(obj);
                    });
                    const members = await this.channel.getMembers();

                    members.map(async mem => {
                        if (mem.identity !== `${authenticated_user}`) {
                            const other_user = await mem.getUser();

                            this.setState({
                                other_user_online: other_user.online,
                                otherUserLastConsumedMessageIndex: mem.lastConsumedMessageIndex
                            });

                            other_user.on("updated", obj => {
                                console.log("user_updated", obj);
                            });
                        }
                    });
                });
        });
    };

    updateMessageRecieved = messages => {	
        const { otherUserLastConsumedMessageIndex } = this.state;	
        const { authenticated_user } = this.props;	
        for (let messageData of messages) {	
            if (	
                messageData.state.index <= otherUserLastConsumedMessageIndex &&	
                messageData.state.author === `${authenticated_user}`	
            ) {	
                messageData.received = true;	
                messageData.sent = true;	
            }	
        }	
        return messages;	
    };

    messagesLoaded = messagePage => {
        let messages = this.updateMessageRecieved(messagePage.items);
        const { roomId, addMessageOfChat } = this.props
        addMessageOfChat(roomId, messages);
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
        const { roomId, addMessageOfChat } = this.props
        addMessageOfChat(roomId, message);
        // this.setState((prevState, props) => {
        //     const newVal = [...prevState.messages, message];
        //     return ({ messages: newVal })
        // });

        this.scrollToBottom();
        this.channel.setAllMessagesConsumed();
    };



    logOut = event => {
        event.preventDefault();
        this.setState({
            token: "",
            chatReady: false,
            messages: []
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


    render() {
        const { ChatForm } = this;
        const { chatMessages, roomId } = this.props;
        const { messagesLoading = false, other_user_online = false, other_typing = false, otherUserLastConsumedMessageIndex } = this.state;
        const { ...props } = this.props;
        const { placeVideoCall, patientName = '', chats: { minimized = false } = {}, minimizePopUp, maximizePopUp, closePopUp, maximizeChat } = this.props;
        if (minimized) {
            return (

                <MinimizedHeader patientName={patientName} isOnline={other_user_online} onHeaderClick={maximizePopUp} close={closePopUp} />
            );
        }
        return (
            <Fragment>
                <div className={'popup-chatWindow'}>
                    <Header placeVideoCall={placeVideoCall} patientName={patientName} isOnline={other_user_online} onHeaderClick={minimizePopUp} close={closePopUp} maximizeChat={maximizeChat} otherTyping={other_typing} formatMessage={this.formatMessage} />
                    <div className="twilio-chat-container-popUp">
                        <div className="twilio-chat-body">
                            {messagesLoading ?
                                <div className='wp100 hp100 flex justify-center align-center'>
                                    <Spin size="medium" />
                                </div>
                                : <ChatMessageDetails scrollToBottom={this.scrollToBottom} {...props} otherUserLastConsumedMessageIndex={otherUserLastConsumedMessageIndex} />}
                            <div id="chatEnd" style={{ float: "left", clear: "both" }} />
                        </div>
                    </div>

                    <div className="twilio-chat-footer-popUp">
                        <div className="footer-right-popUp">
                            <ChatForm messages={this.messages} channel={this.channel} formatMessage={this.formatMessage} />
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default injectIntl(ChatPopUp);
