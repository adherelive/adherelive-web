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

class AddService extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  onSubmit = () => {
    alert("submit");
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  onClose = () => {};

  render() {
    const { visible, onCloseDrawer } = this.props;

    return (
      <Fragment>
        <Drawer
          title={"Add New Service Offering"}
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
          test
        </Drawer>
      </Fragment>
    );
  }
}

export default injectIntl(AddService);
