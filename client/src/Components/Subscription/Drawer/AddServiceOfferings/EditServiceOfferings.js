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
import Form from "antd/es/form";
import InputNumber from "antd/es/input-number";

const { Option } = Select;

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Item: FormItem } = Form;

class EditServiceOfferings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      consultation: "",
      serviceFees: "",
      submitting: false,
      noOfTimesMonthly: 1,
    };
  }

  componentDidMount() {}

  onSubmit = () => {
    this.props.onCloseDrawer();
    // this.setState({
    //   consultation: "",
    //   serviceType: "Digital",
    //   serviceFees: "",
    //   submitting: false,
    //   currency: "INR",
    // });
    console.log(this.state);
  };

  setConsultation = (value) => {
    this.setState({
      consultation: value,
      serviceFees: 200,
    });
  };

  onRadioChange = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    this.setState({
      noOfTimesMonthly: this.state.noOfTimesMonthly + parseInt(e.target.value),
    });
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  onClose = () => {};

  getConsultationOption = () => {
    let serviceOfferingOptions = [
      { name: "Virtual consultation", id: 1 },
      { name: "Remote monitoring", id: 2 },
      { name: "At clinic physical consultation", id: 3 },
      { name: "At home physical consultation", id: 4 },
    ];
    let options = [];
    serviceOfferingOptions.forEach((service) => {
      options.push(
        <Option key={service.id} value={service.name}>
          {service.name}
        </Option>
      );
    });

    return options;
  };

  renderAddServiceOfferings = () => {
    const {
      consultation = "",
      serviceFees = "",
      noOfTimesMonthly = "",
    } = this.state;

    return (
      <div className="form-block-ap">
        <Form className="fw700 wp100 Form">
          <div
            className="form-headings
                //    flex align-center justify-start
                   tac"
          >
            <span className="fwbolder fs18 ">
              {/* {this.formatMessage(messages.defaultConsultationOptions)} */}
              Service offering options
            </span>
          </div>

          <Select
            className="form-inputs-ap drawer-select"
            placeholder="Select Consultation Type"
            value={consultation}
            onChange={this.setConsultation}
            autoComplete="off"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {this.getConsultationOption()}
          </Select>

          <div className="flex align-items-end justify-content-space-between">
            <div className="flex direction-row flex-grow-1">
              <label htmlFor="quantity" className="form-label" title="Quantity">
                {/* {formatMessage(messages.quantity)} */}
                No of times monthly
              </label>

              <div className="star-red">*</div>
            </div>
            {/* <div className="label-color fontsize12 mb8">
            
            </div> */}
            <div className="flex-grow-0">
              <RadioGroup size="small" className="flex justify-content-end">
                <RadioButton value={1.0} onClick={this.onRadioChange}>
                  +1.0
                </RadioButton>
              </RadioGroup>
            </div>
          </div>
          <FormItem
            className="flex-1 align-self-end"
            // validateStatus={error ? "error" : ""}
            // help={error ? error[0] : ""}
          >
            <InputNumber
              min={1}
              style={{ width: "100%" }}
              value={noOfTimesMonthly}
            />
          </FormItem>
          <div className="form-headings flex align-center justify-start">
            {/* {this.formatMessage(messages.consultationFee)} */}
            <span>Service Fees</span>
            <div className="star-red">*</div>
          </div>

          <Input
            className={"form-inputs-ap"}
            value={serviceFees}
            // onChange={this.setServiceFee}
            disabled={true}
          />
        </Form>
      </div>
    );
  };

  render() {
    const { visible, onCloseDrawer } = this.props;
    const { submitting } = this.state;
    return (
      <Fragment>
        <Drawer
          title={"Edit Services Offerings"}
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
          {this.renderAddServiceOfferings()}
          {/* {consultation !== "" ? ( */}
          <Footer
            onSubmit={this.onSubmit}
            onClose={this.onClose}
            // submitText={this.formatMessage(messages.submit)}
            submitText={"Submit"}
            submitButtonProps={{}}
            cancelComponent={null}
            submitting={submitting}
          />

          {/* : // <div className="add-patient-footer">
          //   <Button onClick={this.onClose} style={{ marginRight: 8 }}>
          //     {this.formatMessage(messages.cancel)}
          //   </Button>
          //   <Button onClick={this.onSubmit} type="primary">
          //     {this.formatMessage(messages.submit)}
          //   </Button>
          // </div>
          null} */}
        </Drawer>
      </Fragment>
    );
  }
}

export default injectIntl(EditServiceOfferings);
