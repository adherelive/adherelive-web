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
import Footer from "../footer";
import { durations } from "./durationList.json";

const { Option } = Select;

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class WidgetDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      consultation: "",
    };
  }

  componentDidMount() {}

  onSubmit = () => {
    const { consultation, serviceType, serviceFees, currency } = this.state;

    this.props.onCloseDrawer();
    this.setState({
      consultation: "",
    });
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  onClose = () => {};

  setConsultation = (value) => {
    this.setState({
      consultation: value,
    });
  };

  getDurationOptions = () => {
    let options = [];
    durations.forEach((service) => {
      options.push(
        <Option key={service.id} value={service.name}>
          {service.name}
        </Option>
      );
    });

    return options;
  };

  renderWidgetForm = () => {
    const { consultation = "" } = this.state;

    return (
      <div className="form-block-ap">
        <div
          className="form-headings
                //    flex align-center justify-start
                   tac"
        >
          <span className="fwbolder fs18 ">
            {/* {this.formatMessage(messages.defaultConsultationOptions)} */}
            Duration
          </span>
        </div>

        <Select
          showSearch
          placeholder="Select Duration"
          className="form-inputs-ap drawer-select"
          value={consultation}
          onChange={this.setConsultation}
          autoComplete="off"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.props.children
              .toLowerCase()
              .indexOf(input.trim().toLowerCase()) >= 0
          }
        >
          {this.getDurationOptions()}
        </Select>
      </div>
    );
  };

  render() {
    const { visible, onCloseDrawer } = this.props;
    const { consultation, submitting } = this.state;
    return (
      <Fragment>
        <Drawer
          title={"Widget Form"}
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
          {this.renderWidgetForm()}

          <Footer
            onSubmit={this.onSubmit}
            onClose={this.onClose}
            // submitText={this.formatMessage(messages.submit)}
            submitText={"Submit"}
            submitButtonProps={{}}
            cancelComponent={null}
            submitting={submitting}
          />
        </Drawer>
      </Fragment>
    );
  }
}

export default injectIntl(WidgetDrawer);
