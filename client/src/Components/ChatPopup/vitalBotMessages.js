import React, { Component, Fragment } from "react";
import { USER_ADHERE_BOT, CHAT_MESSAGE_TYPE, PARTS, PART_LIST_BACK, PART_LIST_CODES, PART_LIST_FRONT, BODY,PARTS_GRAPH,BODY_VIEW,BODY_SIDE } from "../../constant";
import messages from './messages';
import { injectIntl } from "react-intl";
import { Form, Input, Button, Spin, Avatar, Upload, Modal } from "antd";
import moment from 'moment';
<<<<<<< HEAD
import {REPEAT_INTERVAL_VITALS} from '../../constant';

=======
>>>>>>> 65740a42ca067af993edbaef357d30aed83ada06

class vitalBotMessage extends Component{
    constructor(props){
        super(props);
        
    }

    componentDidMount(){
        

    }

    render(){
        const{message,patientDp} = this.props;
<<<<<<< HEAD
        const {vitals, vital_id, vital_templates, response} = this.props.body;
        const vitalsMessageArray = [];
        const {basic_info: {vital_template_id} = {} ,details:{repeat_days = [] , repeat_interval_id =''}={}} = vitals[vital_id] || {};
=======
        console.log("this.body.props",this.props.body);
        const {vitals, vital_id, vital_templates, response} = this.props.body;
        const vitalsMessageArray = [];
        const {basic_info: {vital_template_id} = {}} = vitals[vital_id] || {};
        console.log("vital_templates[vital_template_id] =====> ",vital_templates[vital_template_id]);
>>>>>>> 65740a42ca067af993edbaef357d30aed83ada06
        const {basic_info: {name} = {}, details: {template = [] } = {}} = vital_templates[vital_template_id] || {};

        // console.log("template",template);
        //while rendering bottom message for vitals
        template.map(eachTemplate => {
            let vitalMessage = '';
            const {id, label, placeholder} = eachTemplate || {};
            // console.log("EachTemplate",eachTemplate);
<<<<<<< HEAD
            const occurence = REPEAT_INTERVAL_VITALS[repeat_interval_id]
            vitalMessage = (

                <Fragment key={`${message.state.sid}-vital-response`} >

                <div className="chat-messages">
                    <div className="chat-avatar">
                        <span className="twilio-avatar">
                            <Avatar src={patientDp} />
                        </span>
                        <Fragment>
                <div className="bot-message-container  relative " >
                    <div className="bot-msg-detail-container" >
                        <span className="bot-m-h ">
                            Vital
                        </span>
                        
                        <div className="bot-msg-details" >
                            <span className="fs14 fw500  ">
                                {name}
                            </span> 
                            <span className="dot" >&bull;</span>
                            <span className="side">
                                {occurence}
                            </span>
                        </div>
                        
                        <div className="add-medication-button" >
                        
                        </div>
                   
                    </div>
                    <Button  className="wp100 color-white bg-ocean-green position absolute h40 b0 fs20 " >
                    {/* <img src={} className="edit-medication-icon"/> */}
                     Add Medication/Pres
                    </Button>
                </div>
            </Fragment>
                    </div>
                    <div className="chat-time start">
                        {moment(message.state.timestamp).format("H:mm")}
                    </div>
                </div>
            </Fragment> 
=======
            console.log("{`${message.state.sid}-${id}`}",`${message.state.sid}-${id}`);
            vitalMessage = (


                <Fragment
                //  key={`${message.state.sid}-${id}`}
                  >
                    <div className="chat-messages">
                        <div className="chat-avatar">
                                <span className="twilio-avatar">
                                    <Avatar src={patientDp} />
                                </span>
                            <Fragment>
                                <div className="vital-container" >
                                   <div>
                                        <span className="v-label" >{label}</span> : <span>{response[id]}</span> <span>{placeholder}</span>
                                   </div>
                                 </div>
                            </Fragment>
                            </div>
                            <div className="chat-time start">
                                <span>{moment(message.state.timestamp).format("H:mm")}</span>
                            </div>
                        </div>
                </Fragment>
>>>>>>> 65740a42ca067af993edbaef357d30aed83ada06

                
            )

            vitalsMessageArray.push(vitalMessage);
        });

        return vitalsMessageArray;
    }

}

export default injectIntl(vitalBotMessage);
