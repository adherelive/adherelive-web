import React, { Component, Fragment } from "react";
import {
  USER_ADHERE_BOT,
  CHAT_MESSAGE_TYPE,
  PARTS,
  PART_LIST_BACK,
  PART_LIST_CODES,
  PART_LIST_FRONT,
  BODY,
  PARTS_GRAPH,
  BODY_VIEW,
  BODY_SIDE,
} from "../../constant";
import messages from "./messages";
import { injectIntl } from "react-intl";
import { Form, Input, Button, Spin, Avatar, Upload, Modal } from "antd";
import moment from "moment";
import { REPEAT_INTERVAL_VITALS } from "../../constant";

class vitalBotMessage extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  getEllipsis = (message) => {
    return (
      <div className="wp100 tar fs20 pr20">
        <span
          onClick={this.replyToMessage}
          className="h-cursor-p "
          meta-id={`${message.state.sid}-vital`}
        >
          {" "}
          &hellip;
        </span>
      </div>
    );
  };

  replyToMessage = (e) => {
    e.preventDefault();
    const { updateReplyMessageId } = this.props;
    if (typeof updateReplyMessageId === "function") {
      const node = e.target;

      const id = node.getAttribute("meta-id");
      updateReplyMessageId(id);
    }
  };

  getVitalsMessageArray = () => {
    const {
      body: this_body,
      message,
      patientDp,
      vital_repeat_intervals = {},
    } = this.props;
    const body = JSON.parse(this_body);
    const { vitals, vital_id, vital_templates, response } = body;

    const vitalsMessageArray = [];
    const {
      basic_info: { vital_template_id } = {},
      details: { repeat_days = [], repeat_interval_id = "" } = {},
    } = vitals[vital_id] || {};
    const { basic_info: { name } = {}, details: { template = [] } = {} } =
      vital_templates[vital_template_id] || {};

    // console.log("template",template);
    //while rendering bottom message for vitals

    template.map((eachTemplate) => {
      let vitalMessage = "";
      const { id, label, placeholder } = eachTemplate || {};

      let obj = vital_repeat_intervals[repeat_interval_id];

      if (typeof obj !== "undefined") {
        const { text: occurence = "" } = obj;

        vitalMessage = (
          <Fragment key={`${message.state.sid}-vital-key`}>
            <div className="chat-messages">
              <div className="chat-avatar">
                <span className="twilio-avatar">
                  <Avatar src={patientDp} />
                </span>
                <Fragment>
                  <div className="bot-message-container  relative ">
                    {this.getEllipsis(message)}

                    <div
                      className="bot-msg-detail-container"
                      id={`${message.state.sid}-vital`}
                    >
                      <span className="bot-m-h ">Vital</span>

                      <div className="bot-msg-details">
                        <span className="fs14 fw500  ">{name}</span>
                        <span className="dot">&bull;</span>
                        <span className="side">{occurence}</span>
                      </div>

                      <div className="add-medication-button"></div>
                    </div>
                    <Button className="wp100 color-white bg-ocean-green position absolute h40 b0 fs-1rem ">
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
        );
      }

      vitalsMessageArray.push(vitalMessage);
    });

    return vitalsMessageArray;
  };

  render() {
    const vitalsMessageArray = this.getVitalsMessageArray();

    return vitalsMessageArray;
  }
}

export default injectIntl(vitalBotMessage);
