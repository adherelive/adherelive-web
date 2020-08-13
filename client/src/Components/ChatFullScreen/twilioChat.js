import React, { Component, Fragment } from "react";
import { Form, Input, Button, Spin, Avatar, Icon, Upload, Modal } from "antd";
import moment from 'moment';
import Chat from "twilio-chat";
import DoubleTick from "../../Assets/images/double-tick-indicator.png";
import Send from "../../Assets/images/send.png";
import SingleTick from "../../Assets/images/check-symbol.png";
import PaperClip from "../../Assets/images/attach.png";
import ImagePlaceHolder from "../../Assets/images/image_placeholder.png";
import Download from "../../Assets/images/down-arrow.png";
import File from "../../Assets/images/file.png";
import messages from './messages';
import { injectIntl } from "react-intl";
// import CloseChatIcon from "../../Assets/images/ico-vc-message-close.png";
import CallIcon from '../../Assets/images/telephone.png';

const Header = ({ placeVideoCall, patientName, patientDp = '', isOnline = false }) => {
    let pic = patientName ?
        <Avatar src={patientDp}>{patientName[0]}</Avatar> : <Avatar src={patientDp} icon="user" />
    return (
        <div className='chat-patientListheader-chatBox'>
            <div className='flex direction-row align-center flex-grow-1 mb4'>
                {pic}

                <div className='flex direction-column align-center justify-center'>
                    <div className='doctor-name-chat-header medium mt4'>{patientName}</div>
                    <div className='doctor-name-chat-header-online'>{isOnline ? 'online' : ''}</div>
                </div>
            </div>

            <img src={CallIcon} className='callIcon-header mr10' onClick={placeVideoCall} />
        </div>
    );
}

class ChatForm extends Component {
    constructor() {
        super();
        this.state = {
            newMessage: "",
            fileList: []
        };
    }

    onMessageChanged = event => {
        this.setState({ newMessage: event.target.value });
    };

    sendMessage = event => {
        if (event) {
            event.preventDefault();
        }
        if (this.state.newMessage.length > 0) {
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
                        <img src={PaperClip} className='h30 mt6 pointer' />
                    </div>
                </Upload>

            </Form>
        );
    }
}

class MediaComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: "",
            blobUrl: "",
            message: "",
            imageModalVisible: false
        };
    }

    componentDidMount() {
        const { message } = this.props;
        this.setState({ message: message }, this.getUrl);
        // this.getUrl(message);
    }

    componentWillUnmount() { }

    onClickDownloader = e => {
        e.preventDefault();
        const { url, message } = this.state;
        if (url && url.length > 0) {
            fetch(url, {
                method: "GET"
            })
                .then(response => response.blob())
                .then(blob => {
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

    closeModal = () => {

        this.setState({ imageModalVisible: false });
    }

    openModal = () => {

        this.setState({ imageModalVisible: true });
    }

    getUrl = async () => {
        const { message } = this.state;
        const url = await message.media.getContentTemporaryUrl();
        this.setState({ url: url });
    };

    imageModal = () => {

        return (
            <Modal
                className={"chat-media-modal"}
                visible={this.state.imageModalVisible}
                title={' '}
                closable
                mask
                maskClosable
                onCancel={this.closeModal}
                wrapClassName={"chat-media-modal-dialog"}
                width={`50%`}
                footer={null}
            >
                <img src={this.state.url} alt="qualification document" className="wp100" />
            </Modal>
        );
    };

    getMedia = () => {
        const { message } = this.props;
        if (message && message.media) {
            const { url = "", blobUrl = "" } = this.state;
            if (message.media.contentType.indexOf("image") !== -1) {
                return (
                    <Fragment>
                        {url.length > 0 ? (
                            <div
                                onClick={this.openModal}
                            >
                                <img
                                    className="chat-media-message-image pointer"
                                    src={url}
                                    alt="Uploaded Image"
                                />
                            </div>
                        ) : (
                                <img
                                    className="chat-media-message-image"
                                    src={ImagePlaceHolder}
                                    alt="Uploaded Image"
                                />
                            )}
                        {this.imageModal()}
                    </Fragment>
                );
            } else {
                return (
                    <div className='downloadable-file'>
                        <img src={File} className='w20 mr10' />
                        <div className='fs14 mr10'>{message.media.filename}</div>
                        <img src={Download} className='w20 mr10 pointer' onClick={this.onClickDownloader} />
                    </div>
                );
            }
        }

        return <div>Message Cannot be Displayed</div>;
    };

    render() {
        return <Fragment>{this.getMedia()}</Fragment>;
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
        };
        this.channelName = "test";
    }

    scrollToBottom = () => {
        const chatEndElement = document.getElementById("chatEnd");
        chatEndElement.focus();
        chatEndElement.scrollIntoView({ behavior: "smooth" });
    };

    componentDidMount() {
        this.getToken();
        this.scrollToBottom();
    }

    getToken = async () => {
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
        // this.channelName = '1-adhere-3';

        fetchChatAccessToken(authenticated_user).then(result => {
            this.setState((prevState, props) => {
                return {
                    token: props.twilio.chatToken
                };
            }, () => { this.initChat() });
        });
    };


    formatMessage = data => this.props.intl.formatMessage(data);

    initChat = () => {
        this.chatClient = new Chat(this.state.token);
        this.chatClient.initialize().then(this.clientInitiated.bind(this));
    };

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

                    const members = await this.channel.getMembers();
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
                    this.setState({
                        other_user_online,
                        otherUserLastConsumedMessageIndex
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
        console.log("4567895678  8237897323 on MEssage Added------------->   ", messagePage.items.length);
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

        this.channel.setAllMessagesConsumed();
    };

    componentDidUpdate(prevProps, prevState) {
        const {
            roomId,
            chatMessages
        } = this.props;
        const {
            roomId: prevRoomId
        } = prevProps;
        if (roomId !== prevRoomId) {

            // console.log("******** other user details: didUpdate", roomId, prevRoomId);
            if (!chatMessages[roomId]) {
                this.setState({ messagesLoading: true });
            }
            this.getToken();
        }
        this.scrollToBottom();
    }

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


    renderMessages() {
        const { authenticated_user, users, roomId, chatMessages } = this.props;
        const { otherUserLastConsumedMessageIndex } = this.state;
        const { messages: messagesArray = [] } = chatMessages[roomId] || {};
        if (messagesArray.length > 0) {
            // const messagesArray = this.state.messages;
            const messagesToRender = [];
            // console.log("jskdjskjsd 23456789034567 messagesArray ------------> ", messagesArray, roomId, chatMessages);
            for (let i = 0; i < messagesArray.length; ++i) {
                const message = messagesArray[i];
                const { state: { index = 1 } = {} } = message;
                const user = users[message.state.author]
                    ? users[message.state.author]
                    : {};
                const { basicInfo: { profilePicLink: profilePic } = {} } = user;
                messagesToRender.push(
                    <Fragment key={message.state.sid}>
                        {parseInt(message.state.author) !== parseInt(authenticated_user) ? (
                            <div className="chat-messages">
                                {/* <div
                      className={
                        "chat-message-box other " +
                        (message.type === "media" ? "media-text-width" : "")
                      }
                    > */}
                                <div className="chat-avatar">
                                    <span className="twilio-avatar">
                                        <Avatar src={profilePic} />
                                    </span>
                                    {message.type === "media" ? (
                                        <div className="chat-text">
                                            <div className="clickable white chat-media-message-text">
                                                <MediaComponent message={message}></MediaComponent>
                                            </div>
                                        </div>
                                    ) : (
                                            <div className="chat-text">{message.state.body}</div>
                                        )}
                                </div>
                                <div className="chat-time start">
                                    {moment(message.state.timestamp).format("H:mm")}
                                </div>
                                {/* </div> */}
                            </div>
                        ) : (
                                <div className="chat-messages end">
                                    {/* <div
                      className={
                        "chat-message-box " +
                        (message.type === "media" ? "media-text-width" : "")
                      }
                    > */}
                                    {message.type === "media" ? (
                                        <div className="chat-text end">
                                            <div className="clickable white chat-media-message-text">
                                                <MediaComponent message={message}></MediaComponent>
                                            </div>
                                        </div>
                                    ) : (
                                            <div className="chat-text end">{message.state.body}</div>
                                        )}
                                    {/* <div className="chat-text end">{message.state.body}</div> */}
                                    <div className="flex justify-end">
                                        <div className="chat-time mr-4">
                                            {moment(message.state.timestamp).format("H:mm")}
                                        </div>
                                        <img className={index < otherUserLastConsumedMessageIndex ? `h14 mt4` : `h12 mt4`} src={index < otherUserLastConsumedMessageIndex ? DoubleTick : SingleTick} />
                                    </div>
                                    {/* </div> */}
                                    {/* <div className="chat-avatar left">
                    <Avatar src={profilePic} />
                  </div> */}
                                </div>
                            )}
                    </Fragment>
                );
            }
            return messagesToRender;
        } else {
            return "";
        }
    }

    render() {
        const { ChatForm } = this;
        const { messagesLoading = false, other_user_online = false } = this.state;
        const { placeVideoCall, patientDp = '', patientName = '' } = this.props;
        return (
            <Fragment>
                <Header placeVideoCall={placeVideoCall} patientName={patientName} patientDp={patientDp} isOnline={other_user_online} />
                <div className="twilio-chat-container">
                    <div className="twilio-chat-body">
                        {messagesLoading ?
                            <div className='wp100 hp100 flex justify-center align-center'>
                                <Spin />
                            </div>
                            : this.renderMessages()}
                        <div id="chatEnd" style={{ float: "left", clear: "both" }} />
                    </div>
                </div>

                <div className="twilio-chat-footer">
                    {/* <div className="footer-left"> */}
                    {/* <img
              src={CloseChatIcon}
              className="back-image"
              onClick={this.props.hideChat}
              alt="chatImg"
            /> */}
                    {/* </div> */}
                    <div className="footer-right wp100">
                        <ChatForm messages={this.messages} channel={this.channel} formatMessage={this.formatMessage} />
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default injectIntl(TwilioChat);
