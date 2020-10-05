import React, { Component, Fragment } from "react";
import { USER_ADHERE_BOT, CHAT_MESSAGE_TYPE, PARTS, PART_LIST_BACK, PART_LIST_CODES, PART_LIST_FRONT, BODY,PARTS_GRAPH,BODY_VIEW,BODY_SIDE } from "../../constant";
import messages from './messages';
import { injectIntl } from "react-intl";
import { Form, Input, Button, Spin, Avatar, Upload, Modal } from "antd";
import moment from 'moment';

class vitalBotMessage extends Component{
    constructor(props){
        super(props);
        
    }

    componentDidMount(){
        

    }

    render(){
        const{message,patientDp} = this.props;
        console.log("this.body.props",this.props.body);
        const {vitals, vital_id, vital_templates, response} = this.props.body;
        const vitalsMessageArray = [];
        const {basic_info: {vital_template_id} = {}} = vitals[vital_id] || {};
        console.log("vital_templates[vital_template_id] =====> ",vital_templates[vital_template_id]);
        const {basic_info: {name} = {}, details: {template = [] } = {}} = vital_templates[vital_template_id] || {};

        // console.log("template",template);
        //while rendering bottom message for vitals
        template.map(eachTemplate => {
            let vitalMessage = '';
            const {id, label, placeholder} = eachTemplate || {};
            // console.log("EachTemplate",eachTemplate);
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

                
            )

            vitalsMessageArray.push(vitalMessage);
        });

        return vitalsMessageArray;
    }

}

export default injectIntl(vitalBotMessage);
