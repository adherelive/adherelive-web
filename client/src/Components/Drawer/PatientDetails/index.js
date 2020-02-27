import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Drawer, Icon } from "antd";
import ChatComponent from "../../../Containers/Chat";
import { GENDER, PATIENT_BOX_CONTENT } from "../../../constant";

import CloseIcon from "../../../Assets/images/close.svg";
import ChatIcon from "../../../Assets/images/chat.svg";
import ClipIcon from "../../../Assets/images/clip.svg";

class PatientDetailsDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getPatientDetailContent = () => {
    const { patients, id = "1" } = this.props;
    const { basic_info: { name, age, gender } = {} } = patients[id] || {};
    return (
      <div>
        <img src={CloseIcon} alt="close icon" />

        {/*header*/}

        <div className="wp100 flex justify-space-between align-center mt20">
          <div className="flex justify-space-around align-center">
            <div className="pr10 fs24 fw600">{name}</div>
            <div className="pr10 fs20 fw500">{`(${GENDER[gender]["view"]} ${age})`}</div>
            <Icon type="wechat" width={20} />
          </div>
          <img src={ClipIcon} alt="clip icon" className="pointer" />
        </div>

        {/*boxes*/}

        <div>
          {Object.keys(PATIENT_BOX_CONTENT).map(id => {
            return (
              <div
                style={{ float: "left" }}
                className={`mt10 ml4 w250 h100 br5 bg-${PATIENT_BOX_CONTENT[id]["background_color"]} br-${PATIENT_BOX_CONTENT[id]["border_color"]}`}
              ></div>
            );
          })}
        </div>
      </div>
    );
  };

  formatMessage = data => this.props.intl.formatMessage(data);

  render() {
    const { onClose, getPatientDetailContent } = this;
    return (
      <Fragment>
        <Drawer
          placement="right"
          closable={false}
          onClose={onClose}
          visible={true}
          width={550}
        >
          {getPatientDetailContent()}
        </Drawer>
        {/*<ChatComponent {...this.props}/>*/}
        {/*<div className="chat-container">*/}

        {/*</div>*/}
      </Fragment>
    );
  }
}

export default injectIntl(PatientDetailsDrawer);
