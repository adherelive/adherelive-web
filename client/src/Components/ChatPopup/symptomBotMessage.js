import React, { Component, Fragment } from "react";
import { USER_ADHERE_BOT, CHAT_MESSAGE_TYPE, PARTS, PART_LIST_BACK, PART_LIST_CODES, PART_LIST_FRONT, BODY,PARTS_GRAPH,BODY_VIEW,BODY_SIDE } from "../../constant";
import messages from './messages';
import { injectIntl } from "react-intl";
import { Form, Input, Button, Spin, Avatar, Upload, Modal } from "antd";
import moment from 'moment';

class symptomBotMessage extends Component{
    constructor(props){
        super(props);
<<<<<<< HEAD
        // this.state = {
        //    allMedia : []
        // }
    }

    componentDidMount(){
        
=======
        this.state = {
           allMedia : []
        }
    }

    componentDidMount(){
        const {body,message,patientDp} = this.props;

        const symptom_id = body.symptom_id;
        const {imagesMedia = [] ,audioMedia = [],videoMedia = []} = this.state;
        // let textMessage = '';
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
        // console.log("allMediaArray.length",allMediaArray.length);

            this.setState({
                allMedia:allMediaArray
            }
            // , () => {console.log("THIS.STATE",this.state)}
            );
        
        }
>>>>>>> 65740a42ca067af993edbaef357d30aed83ada06
    }

    getText = (symptom_text,message,patientDp,side,parts) => {
        let text = '';
        text = (
            <Fragment key={`${message.state.sid}-text-msg`} >
                    <div className="chat-messages">
                        <div className="chat-avatar">
<<<<<<< HEAD
                               {this.getPatientAvatar(patientDp)}
                            <Fragment>
                                <div className="bot-message-container" >
=======
                                <span className="twilio-avatar">
                                    <Avatar src={patientDp} />
                                </span>
                            <Fragment>
                                <div className="symptom-message-container" >
>>>>>>> 65740a42ca067af993edbaef357d30aed83ada06
                                    <Fragment>{this.getSymptomMessage(side,parts)}</Fragment>
                                    <div className="text-msg-container" >
                                    <span>{symptom_text}</span>
                                    </div>
                                </div>
                            </Fragment>
                        </div>
<<<<<<< HEAD
                        {this.getMessageTime}
=======
                        <div className="chat-time start">
                            {moment(message.state.timestamp).format("H:mm")}
                        </div>
>>>>>>> 65740a42ca067af993edbaef357d30aed83ada06
                    </div>
            </Fragment>
        );
        return text;
    } 

    getImagesMedia = (image_document_ids,upload_documents,message,patientDp,side,parts) => {
        const imagesMediaArray = [];
        image_document_ids.map( image_doc_id => {
            let imageMessage = '';
<<<<<<< HEAD
            const {basic_info : {document : img_src= ''} = {} } = upload_documents[image_doc_id];
            imageMessage = (
                <Fragment key={`${message.state.sid}-image`} >
                    <div className="chat-messages">
                        <div className="chat-avatar">
                            {this.getPatientAvatar(patientDp)}
                            {this.getImage(img_src,side,parts)}
                        </div>
                        {this.getMessageTime(message)}
                    </div>
                </Fragment> 
            );
=======
            
            const {basic_info : {document : img_src= ''} = {} } = upload_documents[image_doc_id];
            imageMessage = (

                <Fragment key={`${message.state.sid}-image`} >

                    <div className="chat-messages">
                        <div className="chat-avatar">
                            <span className="twilio-avatar">
                                <Avatar src={patientDp} />
                            </span>
                            <Fragment>
                                <div className="symptom-message-container" >
                                    <Fragment>{this.getSymptomMessage(side,parts)}</Fragment>
                                    <div className="symptom-image-container" >
                                        <img className="symptom-image" src={img_src} alt="Symptom Image" ></img>
                                    </div>
                                </div>
                            </Fragment>
                        </div>
                        <div className="chat-time start">
                            {moment(message.state.timestamp).format("H:mm")}
                        </div>
                    </div>
                </Fragment> 
            );

           
>>>>>>> 65740a42ca067af993edbaef357d30aed83ada06
            imagesMediaArray.push(imageMessage);
        } );
        return imagesMediaArray;
    }


    getAudioMedia = (audio_document_ids,upload_documents,message,patientDp,side,parts) => {
        const audioMediaArray = [];
        audio_document_ids.map( audio_doc_id => {
            let audioMessage = '';
            const {basic_info : {document : audio_src = ''} = {} } = upload_documents[audio_doc_id];
            audioMessage = (
<<<<<<< HEAD
                <Fragment key={`${message.state.sid}-audio`} >
                    <div className="chat-messages">
                        <div className="chat-avatar">
                            {this.getPatientAvatar(patientDp)}
                            {this.getAudio(audio_src,side,parts)}
                        </div>
                        {this.getMessageTime(message)}
                        
=======


                <Fragment key={`${message.state.sid}-audio`} >

                    <div className="chat-messages">
                        <div className="chat-avatar">
                            <span className="twilio-avatar">
                                <Avatar src={patientDp} />
                            </span>
                            <Fragment>
                                <div className="symptom-message-container" >
                                    <Fragment>{this.getSymptomMessage(side,parts)}</Fragment>
                                    <div className="symptom-audio-container" >
                                    <audio controls className="symptom-audio" >
                                        <source src={audio_src} alt="symptom audio" type="audio/ogg"></source>
                                        <source src={audio_src} alt="symptom audio" type="audio/mpeg" ></source>
                                        Your browser does not support the audio element.
                                    </audio>
                                    </div>
                                </div>
                            </Fragment>
                        </div>
                        <div className="chat-time start">
                            {moment(message.state.timestamp).format("H:mm")}
                        </div>
>>>>>>> 65740a42ca067af993edbaef357d30aed83ada06
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
<<<<<<< HEAD
            const {basic_info : {document : video_src = ''} = {} } = upload_documents[video_doc_id];
            videoMessage = (
                <Fragment key={`${message.state.sid}-video`} >
                    <div className="chat-messages">
                        <div className="chat-avatar">
                            {this.getPatientAvatar(patientDp)}
                            {this.getVideo(video_src,side,parts)}
                        </div>
                        {this.getMessageTime(message)}
=======
            
            const {basic_info : {document : video_src = ''} = {} } = upload_documents[video_doc_id];
            videoMessage = (
                <Fragment key={`${message.state.sid}-video`} >

                    <div className="chat-messages">
                        <div className="chat-avatar">
                            <span className="twilio-avatar">
                                <Avatar src={patientDp} />
                            </span>
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
                        </div>
                        <div className="chat-time start">
                            {moment(message.state.timestamp).format("H:mm")}
                        </div>
>>>>>>> 65740a42ca067af993edbaef357d30aed83ada06
                    </div>
                </Fragment> 
                
            );

            videoMediaArray.push(videoMessage);
        } );
        return videoMediaArray;
    }

<<<<<<< HEAD
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

    getImage =(img_src,side,parts) => {
        return ( <Fragment>
            <div className="bot-message-container" >
                <Fragment>{this.getSymptomMessage(side,parts)}</Fragment>
                <div className="media-container symptom-image-container" >
                    <img className="symptom-image" src={img_src} alt="Symptom Image" ></img>
                </div>
            </div>
        </Fragment>)
    }

    getAudio =(audio_src,side,parts) => {
        return(<Fragment>
            <div className="bot-message-container" >
                <Fragment>{this.getSymptomMessage(side,parts)}</Fragment>
                <div className="media-container symptom-audio-container" >
                <audio controls className="symptom-audio" >
                    <source src={audio_src} alt="symptom audio" type="audio/ogg"></source>
                    <source src={audio_src} alt="symptom audio" type="audio/mpeg" ></source>
                    Your browser does not support the audio element.
                </audio>
                </div>
            </div>
        </Fragment>)
    }

    getVideo= (video_src,side,parts) => {
        return (
            <Fragment>
                <div className="bot-message-container" >
                    <Fragment>{this.getSymptomMessage(side,parts)}</Fragment>
                    <div className="media-container symptom-video-container">
                    <video controls className="sympom-video" width="100%" height="100%" >
                        <source src={video_src} type="video/mp4"></source>
                        <source src={video_src} type="video/ogg"></source>
                        Your browser does not support the video element.
                    </video>
                    </div>
                </div>
            </Fragment>
        )
    }
    

=======
>>>>>>> 65740a42ca067af993edbaef357d30aed83ada06
    getSymptomMessage = (side,parts) => {
       
        if(side == '' || parts.length == 0){
            return null;
        }
        
        const part = PARTS_GRAPH[7].name;
        const body_side = BODY_SIDE[side] || '';
       
        return (
            <Fragment>
<<<<<<< HEAD
                <div className="bot-msg-detail-container" >
                    <span className="bot-m-h ">
                        Symptom
                    </span>
                    
                    <div className="bot-msg-details" >
=======
                <div className="symptom-detail-container" >
                    <span className="symptom-h ">
                        Symptom
                    </span>
                    
                    <div className="symptom-details" >
>>>>>>> 65740a42ca067af993edbaef357d30aed83ada06
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
<<<<<<< HEAD

    getAllMedia = () => {
        const {body,message,patientDp} = this.props;

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
=======
    
    render() {
        const {allMedia} = this.state;
>>>>>>> 65740a42ca067af993edbaef357d30aed83ada06
       
        return allMedia;
       
    }
}

export default injectIntl(symptomBotMessage);
