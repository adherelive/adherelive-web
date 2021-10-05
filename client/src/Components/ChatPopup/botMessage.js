import React, {Component, Fragment} from "react";
import {CHAT_MESSAGE_TYPE} from "../../constant";
import {injectIntl} from "react-intl";
import SymptomBotMessage from "./symptomBotMessage";
import VitalBotMessage from "./vitalBotMessages";
import moment from "moment";
import {isJSON} from "../../Helper/common";

class botMessage extends Component {
    constructor(props) {
        super(props);
    }

    getBotMessage = () => {
        const {body: this_body, message, patientDp, vital_repeat_intervals} = this.props;

        if (!isJSON(this_body)) {
            return null;
        }
        const body = JSON.parse(this_body);
        const {type} = body;
        if (type === CHAT_MESSAGE_TYPE.SYMPTOM) {

            return (
                <SymptomBotMessage  {...this.props} />
            )
        } else if (type === CHAT_MESSAGE_TYPE.VITAL) {
            return (
                <VitalBotMessage  {...this.props} />
            )
        } else {
            return (
                <Fragment key={message.state.sid}>
                    <div className="chat-avatar">
                        {/*<span className="twilio-avatar">*/}
                        {/*    <Avatar src={patientDp} />*/}
                        {/*</span>*/}
                        {message.type === "media" ? (
                            <div className="chat-text">
                                <div className="clickable white chat-media-message-text">
                                    <Fragment>
                                        {message}
                                    </Fragment>
                                </div>
                            </div>
                        ) : (
                            <div className="chat-text ">{message.state.body}</div>
                        )}

                        <div className="chat-time start">
                            {moment(message.state.timestamp).format("H:mm")}
                        </div>
                    </div>
                </Fragment>
            )
        }
    }

    render() {
        const mess = this.getBotMessage();
        return (
            <Fragment>
                <div>{mess}</div>
            </Fragment>
        );
    }
}

export default injectIntl(botMessage);
