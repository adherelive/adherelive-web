import React, { Component, Fragment } from "react";
import { USER_ADHERE_BOT, CHAT_MESSAGE_TYPE, PARTS, PART_LIST_BACK, PART_LIST_CODES, PART_LIST_FRONT, BODY,PARTS_GRAPH,BODY_VIEW,BODY_SIDE } from "../../constant";
import messages from './messages';
import { injectIntl } from "react-intl";
import SymptomBotMessage from './symptomBotMessage';
import VitalBotMessage from './vitalBotMessages';
import { Form, Input, Button, Spin, Avatar, Upload, Modal } from "antd";
import moment from 'moment';

class botMessage extends Component{
    constructor(props){
        super(props);
<<<<<<< HEAD
        // this.state = {
        //     mess:'',
        //     updated:false
        // }
    }

    componentDidMount(){
        
=======
        this.state = {
            mess:'',
            updated:false
        }
    }

    componentDidMount(){
        const { body : this_body ,message,patientDp} = this.props;
        const { updated } = this.state;
        const body = JSON.parse(this_body);
        // console.log("body",body);
        const tempType = this_body.split(':')[0];
        const type = tempType.slice(2,tempType.length-1);
        console.log("type",type);
        const newBotMessage = this.getBotMessageByType(type,body,message,patientDp);
        this.setState({
            mess:newBotMessage
        });

>>>>>>> 65740a42ca067af993edbaef357d30aed83ada06
    }

    getBotMessageByType(type,body,message,patientDp){
        if(type == CHAT_MESSAGE_TYPE.SYMPTOM){
            return (
                <SymptomBotMessage body={body} message={message} patientDp={patientDp} />
            )
        }
        else if (type == CHAT_MESSAGE_TYPE.VITAL){
              return (
                <VitalBotMessage body={body} message={message} patientDp={patientDp} />
              )
        }
        else{
            return (
                <Fragment key={message.state.sid}  >
                       <div className="chat-avatar">
                                        <span className="twilio-avatar">
                                            <Avatar src={patientDp} />
                                        </span>
                                        {message.type === "media" ? (
                                            <div className="chat-text">
                                                <div className="clickable white chat-media-message-text">
                                                    <Fragment>
                                                        {message}
                                                    </Fragment> 
                                                </div>
                                            </div>
                                        ) : (
                                                <div className="chat-text " >{message.state.body}</div>
                                            )}
                                    
                                    <div className="chat-time start">
                                        {moment(message.state.timestamp).format("H:mm")}
                                    </div>
                        </div>
                </Fragment>
            )
        }
    }

<<<<<<< HEAD
    getBotMessage = () => {
        const { body : this_body ,message,patientDp} = this.props;
        const body = JSON.parse(this_body);
        // console.log("body",body);
        const tempType = this_body.split(':')[0];
        const type = tempType.slice(2,tempType.length-1);
        // console.log("type",type);
        const newBotMessage = this.getBotMessageByType(type,body,message,patientDp);
        return newBotMessage;

    }

    render(){
        const mess = this.getBotMessage();
        // const {mess} = this.state;
=======
    render(){
        const {mess} = this.state;
>>>>>>> 65740a42ca067af993edbaef357d30aed83ada06
        return(
            <Fragment>
                <div>
                   {mess}
                </div>
            </Fragment>
        )
    }
}

export default injectIntl(botMessage);
