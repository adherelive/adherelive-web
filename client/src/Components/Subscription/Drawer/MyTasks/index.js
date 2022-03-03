import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import {
  Drawer,
  Icon,
  Select,
  Input,
  message,
  Button,
  Spin,
  Radio,
  DatePicker,
} from "antd";
// import { CONSULTATION_FEE_TYPE_TEXT } from "../../../constant";

import moment from "moment";
import throttle from "lodash-es/throttle";

// import messages from "./message";
import Footer from "../../../Drawer/footer";

const { Option } = Select;

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class MyTasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
    };
  }

  componentDidMount() {}

  onSubmit = () => {
    this.props.onCloseDrawer();
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  onClose = () => {};

  renderMyTasks = () => {
    return (
      <div className="wp100">
        <h3 style={{ fontWeight: "bold" }}>Health lite subscription plan</h3>
        <div
          className="p18 mb10"
          style={{ border: "1px solid lightgrey", height: "250px" }}
        >
          {" "}
          <h3 style={{ fontWeight: "bold" }}>Virtual consultation</h3>
          <h4>Sessions and Timings</h4>
          <ul style={{ listStyle: "auto" }}>
            <li>
              <p>
                11th Feb (2:45pm) - <span style={{ color: "aqua" }}>DONE</span>
              </p>
            </li>
            <li>
              <p>
                12th Feb (2:45pm) - <span style={{ color: "aqua" }}>DONE</span>
              </p>
            </li>
          </ul>
        </div>
        <div
          className="p18 mb10"
          style={{ border: "1px solid lightgrey", height: "250px" }}
        >
          {" "}
          <h3 style={{ fontWeight: "bold" }}>Remote Monitoring</h3>
          <h4>Sessions and Timings</h4>
          <ul style={{ listStyle: "auto" }}>
            <li>
              <p>
                11th Feb (2:45pm) - <span style={{ color: "aqua" }}>DONE</span>
              </p>
            </li>
            <li style={{ color: "red" }}>
              <p>
                Feb - <span>PENIDNG</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
    );
  };

  render() {
    const { visible, onCloseDrawer } = this.props;
    const { submitting } = this.state;
    return (
      <Fragment>
        <Drawer
          title={"My tasks"}
          placement="right"
          maskClosable={false}
          headerStyle={{
            position: "sticky",
            zIndex: "9999",
            top: "0px",
          }}
          destroyOnClose={true}
          onClose={onCloseDrawer}
          visible={visible} // todo: change as per state, -- WIP --
          width={400}
        >
          {this.renderMyTasks()}
          {/* <Footer
            onSubmit={this.onSubmit}
            onClose={this.onClose}
            // submitText={this.formatMessage(messages.submit)}
            submitText={"Submit"}
            submitButtonProps={{}}
            cancelComponent={null}
            submitting={submitting}
          /> */}
        </Drawer>
      </Fragment>
    );
  }
}

export default injectIntl(MyTasks);
