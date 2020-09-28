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
import humanBody from '../../Assets/images/humanBodyFront.jpeg';
import humanBodyBack from '../../Assets/images/humanBodyBack.jpeg';
import bodyImage from "../../../src/Assets/images/body.jpg";
// import CloseChatIcon from "../../Assets/images/ico-vc-message-close.png";
import CallIcon from '../../Assets/images/telephone.png';
import { USER_ADHERE_BOT, CHAT_MESSAGE_TYPE, PARTS, PART_LIST_BACK, PART_LIST_CODES, PART_LIST_FRONT, BODY,PARTS_GRAPH,BODY_VIEW,BODY_SIDE } from "../../constant";


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
    closeModal = () => {
        this.setState({ imageModalVisible: false });
    }

    openModal = () => {
        this.setState({ imageModalVisible: true });
    }
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
                    // <div onClick={this.onClickDownloader}>{message.media.filename}</div>
                    <div className='downloadable-file'>
                        <img src={File} className='h20 mr10' />
                        <div className='fs14 mr10'>{message.media.filename.length <= 12 ? message.media.filename : `${message.media.filename.substring(0, 13)}...`}</div>
                        <img src={Download} className='h20 mr10 pointer' onClick={this.onClickDownloader} />
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
            message_numbers: 0

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
    }
    componentDidUpdate() {
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
    }

    formatMessage = data => this.props.intl.formatMessage(data);

    fetchMessageDetails = (data) => {
        const { messages: messagesArray = [] } = data || {};
        const { getSymptomDetails } = this.props;
        let adhere_bot_messages = {
            symptom_ids: []
        }
        for (let i in messagesArray) {
            let message = messagesArray[i];
            const { author = '', body = '' } = message.state;
            if (author == USER_ADHERE_BOT) {
                const message_type = body.split(':');
                if (message_type[0] && message_type[0] == CHAT_MESSAGE_TYPE.SYMPTOM) {
                    adhere_bot_messages['symptom_ids'].push(message_type[1]);
                }
            }
        }
        this.setState({ loadSymptoms: false, loadingMessageDetails: true });
        getSymptomDetails(adhere_bot_messages['symptom_ids']).then(res => {
            if (res) {
                this.setState({ loadingMessageDetails: false });
                this.scrollToBottom();
            }
        });
        




    }
    
     getSymptomMessage = (side = '', parts=[]) => {
        if(side == '' || parts.length == 0){
            return null;
        }
        
        const part = PARTS_GRAPH[7].name;
        const body_side = BODY_SIDE[side] || '';
       
        return (
            <Fragment>
                <div className="symptom-detail-container" >
                    <span className="symptom-h ">
                        Symptom
                    </span>
                    
                    <div className="symptom-details" >
                        <span className="fs14 fw500  ">
                            {body_side}
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
    
     
     
    render() {
        const { authenticated_user, users, roomId, chatMessages, patientDp, symptoms, upload_documents, otherUserLastConsumedMessageIndex } = this.props;
        const { messageIds = [] } = chatMessages[roomId] || {};
        const { loadSymptoms, loadingMessageDetails, message_numbers } = this.state;
        if (chatMessages[roomId] !== undefined && (loadSymptoms || message_numbers != messageIds.length) && !loadingMessageDetails) {
            this.fetchMessageDetails(chatMessages[roomId]);
        }
        const { messages: messagesArray = [] } = chatMessages[roomId] || {};
        if (messagesArray.length > 0) {
            const messagesToRender = [];
            for (let i = 0; i < messagesArray.length; ++i) {
                const message = messagesArray[i];
                const prevMessage = i > 1 ? messagesArray[i - 1] : 1;
                let sameDate = message && prevMessage && message.state && prevMessage.state ? moment(message.state.timestamp).isSame(moment(prevMessage.state.timestamp), 'date') : false;

                if (!sameDate) {
                    messagesToRender.push(
                        <div className='mt16 mb16 flex wp100 text-grey justify-center fs12'>{moment(message.state.timestamp).isSame(moment(), 'date') ? this.formatMessage(messages.today) : moment(message.state.timestamp).format('ll')}</div>
                    )
                }
                const { state: { index = 1 } = {} } = message;
                const user = users[message.state.author]
                    ? users[message.state.author]
                    : {};
                let mess = '';
                const body = message.state.body;
                // console.log("Body ==========>",body);

                if (message.state.author == USER_ADHERE_BOT && body.split(':')[0].slice(2,10) == CHAT_MESSAGE_TYPE.SYMPTOM) {
                    
                    const bodyObj = JSON.parse(body);
                    const symptom_id = bodyObj.symptom_id;
                    if (symptom_id != undefined) {
                       
                      
                        const {upload_documents = {} }  = bodyObj;
                        const { text : symptom_text = '' , audio_document_ids = [], image_document_ids=[] ,video_document_ids = [], config : {side = '1' , parts = [] , duration='' }} = {} = bodyObj.symptoms[symptom_id] || {};
                   
                
                    let textMessage ;
                    {
                        symptom_text
                        ?
                        textMessage = (
                            <Fragment>
                                <div className="symptom-message-container" >
                                <Fragment>{this.getSymptomMessage(side,parts)}</Fragment>
                                <div className="text-msg-container" >
                                    <span>{symptom_text}</span>
                                </div>

                                </div>
                            </Fragment>
                        )
                        :
                        textMessage = null;
                    }
                    
                    messagesToRender.push(textMessage);

                for(let  document_Id in upload_documents){


                    if(image_document_ids.includes(parseInt(document_Id))){
                       let  imageMess = null;
                       let {basic_info :{ document : img_src  = ''}} = upload_documents[image_document_ids];
                         imageMess = (
                                  <Fragment>
                                      <div className="symptom-message-container" >
                                            <Fragment>{this.getSymptomMessage(side,parts)}</Fragment>
                                            <div className="symptom-image-container" >
                                                
                                                <img  className="symptom-image" src={img_src} alt="Symptom Image" ></img>
                                            </div>
                                            
                                      </div>
                                       
                                    </Fragment>
                           
                           
                            )
                            messagesToRender.push(imageMess);
                    }else if(audio_document_ids.includes(parseInt(document_Id))){
                        let audioMess = null;
                        let {basic_info :{ document : audio_src = ''}} = upload_documents[audio_document_ids];

                          audioMess = (
                                  <Fragment>
                                      <div className="symptom-message-container" >
                                            <Fragment>{this.getSymptomMessage(side,parts)}</Fragment>
                                            <div className="symptom-audio-container" >
                                                <audio controls className="symptom-audio" >
                                                    <source src={audio_src} alt="symptom audio"   type="audio/ogg"></source>
                                                    <source src={audio_src} alt="symptom audio"  type="audio/mpeg" ></source>
                                                    Your browser does not support the audio element.
                                                </audio>
                                            </div>
                                             
                                      </div>
                                       
                                    </Fragment>
                           
                            )
                            messagesToRender.push(audioMess);
                    }else if(video_document_ids.includes(parseInt(document_Id))){
                        let videoMess = null ;
                        let {basic_info :{ document : video_src = ''}} = upload_documents[video_document_ids];

                              videoMess = (
                                  <Fragment>
                                      <div className="symptom-message-container" >
                                            <Fragment>{this.getSymptomMessage(side,parts)}</Fragment>
                                            <div className="symptom-video-container" >
                                               <video controls className="sympom-video" width="100%" height="100%" >
                                                <source src={video_src} type="video/mp4"></source>
                                                <source src={video_src} type="video/ogg"></source>
                                                    Your browser does not support the video element.
                                               </video>
                                            </div>
                                            
                                      </div>
                                       
                                    </Fragment>
                           
                            )
                            
                            messagesToRender.push(videoMess);
                       
                    }else{
                        mess=null;
                    }
                    
                    
                            
                }
                mess= null;
                            
                        // mess = (
                        //     <Fragment key={message.state.sid}>
                        //         <div className="chat-messages">
                        //             <div className="chat-avatar">
                        //                 <span className="twilio-avatar">
                        //                     <Avatar src={patientDp} />
                        //                 </span>
                        //                 <>
                        //                     <div className="chat-text" style={{ display: "inline-block" }}>
                        //                         { (side && parts[0]) ?
                        //                             (<div className='humanBodyWrapper'>
                        //                                 <img
                        //                                     src={side === '1' ? humanBody : humanBodyBack}
                        //                                     className={'wp100 hp100'}
                        //                                 />
                        //                                 {side === '1' ? (PART_LIST_FRONT.map(part => {
                        //                                     const { key, areaStyle = {}, dotStyle = {} } = BODY[part];
                        //                                     const { top: bpTop = 0,
                        //                                         left: bpLeft = 0,
                        //                                         height: bpHeight = 0,
                        //                                         width: bpWidth = 0 } = areaStyle || {};
                        //                                     const { top: dotTop = 0, left: dotLeft = 0 } = dotStyle || {};
                        //                                     // console.log('isSAMEEEEEEEE============>', body_part, key, body_part === key);
                        //                                     return (
                        //                                         <div
                        //                                             key={key}
                        //                                             style={{ position: 'absolute', top: `${bpTop}px`, left: `${bpLeft}px`, height: `${bpHeight}px`, width: `${bpWidth}px` }}
                        //                                         >
                        //                                             <div
                        //                                                 style={{
                        //                                                     top: `${dotTop}px`,
                        //                                                     left: `${dotLeft}px`,
                        //                                                     position: "absolute",
                        //                                                     height: parts[0] === key ? 12 : 0,
                        //                                                     width: parts[0] === key ? 12 : 0,
                        //                                                     backgroundColor: parts[0] === key ? "rgba(236,88,0,0.8)" : 'rgba(0,0,0,0)',
                        //                                                     borderRadius: '50%',

                        //                                                     // height:  12,
                        //                                                     // width:  12 ,
                        //                                                     // backgroundColor: "red",
                        //                                                     // borderRadius: '50%'
                        //                                                 }
                        //                                                 }
                        //                                             />
                        //                                         </div>
                        //                                     );
                        //                                 })) :
                        //                                     (PART_LIST_BACK.map(part => {
                        //                                         const { key, areaStyle = {}, dotStyle = {} } = BODY[part];
                        //                                         const { top: bpTop = 0,
                        //                                             left: bpLeft = 0,
                        //                                             height: bpHeight = 0,
                        //                                             width: bpWidth = 0 } = areaStyle || {};
                        //                                         const { top: dotTop = 0, left: dotLeft = 0 } = dotStyle || {};
                        //                                         return (
                        //                                             <div
                        //                                                 key={key}
                        //                                                 style={{ position: 'absolute', top: `${bpTop}px`, left: `${bpLeft}px`, height: `${bpHeight}px`, width: `${bpWidth}px` }}
                        //                                             >
                        //                                                 <div
                        //                                                     style={{
                        //                                                         top: `${dotTop}px`,
                        //                                                         left: `${dotLeft}px`,
                        //                                                         position: "absolute",
                        //                                                         height: parts[0] === key ? 12 : 0,
                        //                                                         width: parts[0] === key ? 12 : 0,
                        //                                                         backgroundColor: parts[0] === key ? "rgba(236,88,0,0.8)" : 'rgba(0,0,0,0)',
                        //                                                         borderRadius: '50%',

                        //                                                         // height:  12,
                        //                                                         // width:  12 ,
                        //                                                         // backgroundColor: "red",
                        //                                                         // borderRadius: '50%'
                        //                                                     }
                        //                                                     }
                        //                                                 />
                        //                                             </div>
                        //                                         );
                        //                                     }))}
                        //                                 {/* <img src={bodyImage} height={260} width={200}></img> */}

                        //                             </div>) : null}
                        //                         {text.length ? (
                        //                             <Fragment>
                        //                                 <div className='mt5 mb5'>Description :</div>
                        //                                 <div>{text}</div>
                        //                             </Fragment>) : null}
                        //                         {/* <div>{`Duration: `+duration}</div> */}
                        //                         {audio_document_ids.length ? <div>Description :</div> : null}
                        //                         {audio_document_ids.length ? (
                        //                             Object.values(audio_document_ids).map(id => {
                        //                                 if (upload_documents[id] != undefined) {
                        //                                     const { basic_info: { name = '', document = '' } } = upload_documents[id];
                        //                                     let mediaData = {
                        //                                         media: {
                        //                                             contentType: '',
                        //                                             filename: name,
                        //                                             document: document
                        //                                         }
                        //                                     }
                        //                                     return (
                        //                                         <div className="clickable white chat-media-message-text">
                        //                                             <MediaComponent message={mediaData}></MediaComponent>
                        //                                         </div>);
                        //                                 } else {
                        //                                     return null;
                        //                                 }
                        //                             })
                        //                         ) : (
                        //                                 null
                        //                             )}
                        //                         {image_document_ids.length ? <div>Description :</div> : null}
                        //                         {image_document_ids.length ? (
                        //                             Object.values(image_document_ids).map(id => {
                        //                                 if (upload_documents[id] != undefined) {
                        //                                     const { basic_info: { name = '', document = '' } } = upload_documents[id];
                        //                                     let mediaData = {
                        //                                         media: {
                        //                                             contentType: 'image',
                        //                                             filename: name,
                        //                                             document: document
                        //                                         }
                        //                                     }
                        //                                     return (
                        //                                         <div className="clickable white chat-media-message-text">
                        //                                             <MediaComponent message={mediaData}></MediaComponent>
                        //                                         </div>);
                        //                                 } else {
                        //                                     return null;
                        //                                 }
                        //                             })
                        //                         ) : (
                        //                                 null
                        //                             )}
                        //                     </div>
                        //                     {/* <div className="chat-text">
                                                    
                        //                         </div> */}
                        //                 </>
                        //             </div>
                        //             <div className="chat-time start">
                        //                 {moment(message.state.timestamp).format("H:mm")}
                        //             </div>
                        //             {/* </div> */}
                        //         </div>
                        //     </Fragment >
                        // );
                    } else {
                        mess = (
                            <Fragment key={message.state.sid}>
                                <div className="chat-messages">
                                    <div className="chat-avatar">
                                        <span className="twilio-avatar">
                                            <Avatar src={patientDp} />
                                        </span>
                                        <div className="chat-text">
                                            {message.state.body}
                                        </div>
                                    </div>
                                    <div className="chat-time start">
                                        {moment(message.state.timestamp).format("H:mm")}
                                    </div>
                                    {/* </div> */}
                                </div>
                            </Fragment>
                        );
                    }
                } else {
                    mess = (
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
                                            <Avatar src={patientDp} />
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
                                            <img className={index < otherUserLastConsumedMessageIndex ? `h14 mt4` : `h12 mt4`} src={index <= otherUserLastConsumedMessageIndex ? DoubleTick : SingleTick} />
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
                messagesToRender.push(mess);
            }
            return messagesToRender;
        } else {
            return "";
        }
    }

}

export default injectIntl(ChatMessageDetails);
