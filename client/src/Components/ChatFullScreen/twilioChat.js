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
import ChatMessageDetails from "../ChatPopup/chatMessageDetails";
// import { USER_ADHERE_BOT, CHAT_MESSAGE_TYPE, PARTS, PART_LIST_BACK, PART_LIST_CODES, PART_LIST_FRONT, BODY,PARTS_GRAPH,BODY_VIEW,BODY_SIDE } from "../../constant";


const Header = ({ placeVideoCall, patientName, patientDp = '', isOnline = false, otherTyping = false, formatMessage }) => {
    let pic = patientName ?
        <Avatar src={patientDp}>{patientName[0]}</Avatar> : <Avatar src={patientDp} icon="user" />
    return (
        <div className='chat-patientListheader-chatBox'>
            <div className='flex direction-row align-center flex-grow-1 mb4'>
                {pic}

                <div className='flex direction-column justify-center'>
                    <div className='doctor-name-chat-header medium mt4'>{patientName}</div>
                    <div className='doctor-name-chat-header-online ml10'>{otherTyping ? formatMessage(messages.typing) : isOnline ? formatMessage(messages.online) : formatMessage(messages.offline)}</div>
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
                    accept=".jpg,.jpeg,.png,.pdf,.mp4"
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
            loadSymptoms:true,
            loadingMessageDetails: false,
            message_numbers: 0
        };
        this.channelName = "test";
    }

    scrollToBottom = () => {
        const chatEndElement = document.getElementById("chatEnd");
        chatEndElement.focus();
        chatEndElement.scrollIntoView({ behavior: "smooth" });
    };

    async componentDidMount() {

        const {
            fetchChatAccessToken,
            authenticated_user
        } = this.props;


        const response = await fetchChatAccessToken(authenticated_user);
        const { status = false, payload: { data: { token: chatToken = '' } = {} } = {} } = response;

        if (status) {
            this.setState({ token: chatToken }, () => {
                this.getToken();
            })
        }
        this.scrollToBottom();

        this.intervalID = setInterval(() => this.tick(), 2000);
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            roomId,
            chatMessages
        } = this.props;
        const {
            roomId: prevRoomId
        } = prevProps;
        const { token } = prevState;
        if (roomId !== prevRoomId && (token)) {
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

    getToken = () => {
        const {
            roomId,
        } = this.props;
        this.channelName =
            roomId ? roomId :
                "test";

        this.initChat();
    };


    formatMessage = data => this.props.intl.formatMessage(data);

    initChat = () => {
        this.chatClient = new Chat(this.state.token);

        this.chatClient.initialize().then(this.clientInitiated.bind(this)).catch(err => {
            console.log("chatClient AUTH error", err);
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
                        this.checkOtherTyping(obj);
                    });
                    this.channel.on("typingEnded", obj => {
                        this.otherTypingStopped(obj);
                    });
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
                    // console.log('didMount======================>clientInitiatedlast');
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
        const { roomId, addMessageOfChat } = this.props
        if (messagePage.items.length) {
            let message = messagePage.items[0];
            const { channel: { channelState: { uniqueName = '' } = {} } = {} } = message;
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
        console.log('didMount======================>messagesLoaded', moment());

        console.log('didMount======================>msgs loaded', moment());
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

    getReplyMetaData = (side,part) => {
       
        if(side === '' || part.length === 0){
            return null;
        }
       
        return (
            <Fragment>
                <div className="bot-msg-detail-container wp50" >
                    <span className="bot-m-h ">
                        Symptom
                    </span>
                    
                    <div className="bot-msg-details" >
                        <span className="fs14 fw500  ">
                            {side}
                        </span> 
                        <span className="dot" >&bull;</span>
                        <span className="side">
                            {part}
                        </span>
                    </div>
                    
                </div>
            </Fragment>
            )
        
    }

    getReplyMessage = () => {
        const { ChatForm } = this;
       
        const {replyMessadeId =''} = this.props;
        const renderArray = [];
        const {updateReplyMessadeId} = this.props;
        const ellipsisContainer = document.getElementById(replyMessadeId); 
        // console.log(ellipsisContainer);
        const metaDataContainer = ellipsisContainer.nextElementSibling;
        const  msgDetailsContainer = metaDataContainer.getElementsByClassName("bot-msg-details");
        const msgChildNodes = msgDetailsContainer[0].children;
        const data1 = msgChildNodes[0].innerHTML;
        const data2 = msgChildNodes[2].innerHTML;
        let mess ='';
        const metaDataReply = this.getReplyMetaData(data1,data2);

       
        mess = (
            <div className="wp100 flex direction-row bg-whitesmoke">
                <div className="wp90 flex direction-column justify-space-between p20 mh100" >
                    {metaDataReply}
                   
                </div>
                <div className="fs30" onClick={this.unsetReplyId}>&times;</div>
            </div>
        )
        return mess;
    }

    unsetReplyId = (e) => {
        e.preventDefault();
        const {updateReplyMessadeId} = this.props;
        updateReplyMessadeId();
       
    }

 
    render() {
        const { ChatForm } = this;

        const { messagesLoading = false, other_user_online = false, other_typing = false, otherUserLastConsumedMessageIndex } = this.state;
        const { placeVideoCall, patientDp = '', patientName = '',replyMessadeId='' } = this.props;
        console.log("replyMessadeId ===>",replyMessadeId);
        const { ...props} = this.props;

        return (
            <Fragment>
                <Header placeVideoCall={placeVideoCall} patientName={patientName} patientDp={patientDp} isOnline={other_user_online} otherTyping={other_typing} formatMessage={this.formatMessage} />
                <div className="twilio-chat-container">
                    <div className="twilio-chat-body">
                        {messagesLoading ?
                            <div className='wp100 hp100 flex justify-center align-center'>
                                <Spin />
                            </div>
                            : <ChatMessageDetails {...props} scrollToBottom={this.scrollToBottom} otherUserLastConsumedMessageIndex={otherUserLastConsumedMessageIndex}/>}
                        <div id="chatEnd" style={{ float: "left", clear: "both" }} />
                    </div>

                    {replyMessadeId ? 
                        this.getReplyMessage()
                        : null
                    }
                   

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
