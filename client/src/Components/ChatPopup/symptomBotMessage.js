import React, { Component, Fragment } from "react";
import { USER_ADHERE_BOT, CHAT_MESSAGE_TYPE, PARTS, PART_LIST_BACK, PART_LIST_CODES, PART_LIST_FRONT, BODY,PARTS_GRAPH,BODY_VIEW,BODY_SIDE } from "../../constant";
import messages from './messages';
import { injectIntl } from "react-intl";
import { Form, Input, Button, Spin, Avatar, Upload, Modal } from "antd";
import moment from 'moment';

class symptomBotMessage extends Component{
    constructor(props){
        super(props);
        // this.state = {
        //   replyMessage : ''
        // }
    }

    componentDidMount(){
        
    }


    getEllipsis = () =>{
        return (
            <div className="wp100 tar fs20 pr20">
               
                <span onClick={ this.replyToMessage}
                    className="h-cursor-p"
                > &hellip;</span>
                
            </div>
        )
    }

    replyToMessage = (e) => {
        e.preventDefault();
        const {updateReplyMessadeId} = this.props;
        const parentNode = e.target.parentNode.parentNode;
        const id = parentNode.getAttribute("id");
        
        updateReplyMessadeId(id);
      
 
    }

  
    getText = (symptom_text,message,patientDp,side,parts) => {
        let text = '';
        text = (
            <Fragment key={`${message.state.sid}-text-msg`}  >
                    <div className="chat-messages">
                        <div className="chat-avatar">
                               {this.getPatientAvatar(patientDp)}
                           
                                <div className="bot-message-container" >
                                    <div id={`${message.state.sid}-text-msg`}  >
                                        {this.getEllipsis()}
                                    </div>
                                    <div>{this.getSymptomMessage(side,parts)}</div>
                                    <div className="text-msg-container " >
                                    <span>{symptom_text}</span>
                                    </div>
                                </div>
                           
                        </div>
                        {this.getMessageTime(message)}
                    </div>
            </Fragment>
        );
        return text;
    } 

    getImagesMedia = (image_document_ids,upload_documents,message,patientDp,side,parts) => {
        const imagesMediaArray = [];
        image_document_ids.map( image_doc_id => {
            let imageMessage = '';
            const {basic_info : {document : img_src= ''} = {} } = upload_documents[image_doc_id];
            imageMessage = (
                <Fragment key={`${message.state.sid}-image`} >
                    <div className="chat-messages">
                        <div className="chat-avatar">
                            {this.getPatientAvatar(patientDp)}
                            {this.getImage(img_src,side,parts,message)}
                        </div>
                        {this.getMessageTime(message)}
                    </div>
                </Fragment> 
            );
            imagesMediaArray.push(imageMessage);
        } );
        return imagesMediaArray;
    }


    getAudioMedia = (audio_document_ids,upload_documents,message,patientDp,side,parts) => {
        const audioMediaArray = [];
        audio_document_ids.map( audio_doc_id => {
            let audioMessage = '';
            const {basic_info : {document : audio_src = '',name : audio_name = ''} = {} } = upload_documents[audio_doc_id];
            // console.log("upload_documents",upload_documents);
            let audio_type="mp3";
            // audio_type = audio_name.split('.')[1];
            audio_name.split('.')[1] === '' ? audio_type = "mp3" : audio_type = audio_name.split('.')[1] ;
            audioMessage = (
                <Fragment key={`${message.state.sid}-audio`} >
                    <div className="chat-messages">
                        <div className="chat-avatar">
                            {this.getPatientAvatar(patientDp)}
                            {this.getAudio(audio_src,side,parts,audio_type,message)}
                        </div>
                        {this.getMessageTime(message)}
                        
                    </div>
                </Fragment> 
                
            )
            audioMediaArray.push(audioMessage);
        } );
        return audioMediaArray;
    }

    getVideoMedia = (video_document_ids,upload_documents,message,patientDp,side,parts) => {
        const videoMediaArray = [];
        video_document_ids.map( video_doc_id => {
            let videoMessage = '';
            const {basic_info : {document : video_src = '', name : video_name = ''} = {} } = upload_documents[video_doc_id];
           
            let video_type="mp4";
            // video_type = video_name.split('.')[1];
            video_name.split('.')[1] === '' ? video_type = "mp4" : video_type = video_name.split('.')[1] ;
            videoMessage = (
                <Fragment key={`${message.state.sid}-video`} >
                    <div className="chat-messages">
                        <div className="chat-avatar">
                            {this.getPatientAvatar(patientDp)}
                            {this.getVideo(video_src,side,parts,video_type,message)}
                        </div>
                        {this.getMessageTime(message)}
                    </div>
                </Fragment> 
                
            );

            videoMediaArray.push(videoMessage);
        } );
        return videoMediaArray;
    }

    getPatientAvatar = (patientDp) => {
        return (<span className="twilio-avatar">
                    <Avatar src={patientDp} />
                </span>)
    }

    getMessageTime = (message) => {
        return (<div className="chat-time start">
                    {moment(message.state.timestamp).format("H:mm")}
                </div>)
    }

    getImage =(img_src,side,parts,message) => {
        return ( <Fragment>
            <div className="bot-message-container" >
                <div id={`${message.state.sid}-image`} >{this.getEllipsis()}</div>
                <div>{this.getSymptomMessage(side,parts)}</div>
                <div className="media-container symptom-image-container" >
                    <img className="symptom-image" src={img_src} alt="Symptom Image" ></img>
                </div>
            </div>
        </Fragment>)
    }

    getAudio =(audio_src,side,parts,audio_type,message) => {
        return(<Fragment>
            <div className="bot-message-container" >
                <div id={`${message.state.sid}-audio`}  >{this.getEllipsis()}</div>
                <div>{this.getSymptomMessage(side,parts)}</div>
                <div className="media-container symptom-audio-container" >
                <audio controls className="symptom-audio" width="100%" height="100%" >
                    <source src={audio_src} alt="symptom audio" type={`audio/${audio_type}`}></source>
                    {/* <source src={audio_src} alt="symptom audio" type="audio/mpeg" ></source> */}
                    {this.props.intl.formatMessage(messages.audioNotSupported)}
                </audio>
                </div>
            </div>
        </Fragment>)
    }

    getVideo= (video_src,side,parts,video_type,message) => {
       
        return (
            <Fragment>
                <div className="bot-message-container" >
                    <div id={`${message.state.sid}-video`} >{this.getEllipsis()}</div>
                    <div >{this.getSymptomMessage(side,parts)}</div>
                    <div className="media-container symptom-video-container">
                    <video controls className="sympom-video" width="100%" height="100%" >
                        <source src={video_src} type={`video/${video_type}`}></source>
                        {/* <source src={video_src} type="video/ogg"></source> */}
                        {this.props.intl.formatMessage(messages.videoNotSupported)}
                    </video>
                    </div>
                </div>
            </Fragment>
        )
    }
    

    getSymptomMessage = (side,parts) => {
       
        if(side === '' || parts.length === 0){
            return null;
        }
        
        const part = PARTS_GRAPH[7].name;
        const body_side = BODY_SIDE[side] || '';
       
        return (
            <Fragment>
                <div className="bot-msg-detail-container" >
                    <span className="bot-m-h ">
                        Symptom
                    </span>
                    
                    <div className="bot-msg-details" >
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

    getAllMedia = () => {

        const { body_p :body ,message_p : message ,patientDp_p : patientDp} = this.props;
        // console.log("replyMessadeId ====> ",typeof(replyMessadeId));
        const symptom_id = body.symptom_id;
        const  imagesMedia = [] ,audioMedia = [],videoMedia = [];
        // const {imagesMedia = [] ,audioMedia = [],videoMedia = []} = this.state;
        const allMediaArray = [];
        if (symptom_id != undefined) {
        const {upload_documents = {} } = body;

        const { text : symptom_text = '' , audio_document_ids = [], image_document_ids=[] ,video_document_ids = [], config : {side = '1' , parts = [] , duration='' }} = {} = body.symptoms[symptom_id] || {};
        
        const textMessage= this.getText(symptom_text,message,patientDp,side,parts);
        const imagesMediaArray = this.getImagesMedia(image_document_ids,upload_documents,message,patientDp,side,parts);
        const audioMediaArray= this.getAudioMedia(audio_document_ids,upload_documents,message,patientDp,side,parts)  ;
        const videoMediaArray = this.getVideoMedia(video_document_ids,upload_documents,message,patientDp,side,parts);

        allMediaArray.push(textMessage);
        imagesMediaArray.map(each => {allMediaArray.push(each)});
        audioMediaArray.map(each => {allMediaArray.push(each)});
        videoMediaArray.map(each => {allMediaArray.push(each)});


        // const {replyMessage} = this.state;
        // if(replyMessage!== ''){
        //     allMediaArray.push(replyMessage);
        // }

            // this.setState({
            //     allMedia:allMediaArray
            // }
            
            // );
        
        }

        return allMediaArray;
    }
    
    render() {
        // const {allMedia} = this.state;
        const allMedia = this.getAllMedia();
       
        return allMedia;
       
    }
}

export default injectIntl(symptomBotMessage);
