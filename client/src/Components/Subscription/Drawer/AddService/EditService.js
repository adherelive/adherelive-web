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

class EditService extends Component {
  constructor(props) {
    super(props);
    this.state = {
      consultation: "",
      serviceType: "Digital",
      serviceFees: "",
      submitting: false,
      currency: "INR",
    };
  }

  componentDidMount() {}

  onSubmit = () => {
    const { consultation, serviceType, serviceFees, currency } = this.state;
    // this.setState({
    //   submitting: true,
    // });
    alert(
      `Consultation: ${JSON.stringify(
        consultation
      )},ServiceType: ${JSON.stringify(
        serviceType
      )},ServiceFees: ${JSON.stringify(serviceFees)},Currency: ${JSON.stringify(
        currency
      )}`
    );

    this.props.onCloseDrawer();
    this.setState({
      consultation: "",
      serviceType: "Digital",
      serviceFees: "",
      submitting: false,
      currency: "INR",
    });
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  onClose = () => {};

  setConsultation = (value) => {
    this.setState({
      consultation: value,
    });
  };

  setCurrency = (value) => {
    this.setState({
      currency: value,
    });
  };

  onCurrencySearch = (value) => {
    console.log(value);
  };

  setServiceFee = (e) => {
    const { value } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === "") {
      this.setState({ serviceFees: e.target.value });
    }
  };

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

  getCurrencyOption = () => {
    let currencyOptions = [
      { name: "INR", id: 1 },
      { name: "EUR", id: 2 },
      { name: "USD", id: 3 },
    ];
    let options = [];
    currencyOptions.forEach((currency) => {
      options.push(
        <Option key={currency.id} value={currency.name}>
          {currency.name}
        </Option>
      );
    });

    return options;
  };

  renderAddNewConsultationFee = () => {
    const {
      consultation = "",
      serviceType = "",
      serviceFees = "",
      currency,
    } = this.state;

    return (
      <div className="form-block-ap">
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
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        >
          {this.getConsultationOption()}
        </Select>

        <div>
          {consultation !== "" ? (
            <div>
              <div className="form-headings flex align-center justify-start">
                {/* {this.formatMessage(messages.consultationFeeType)} */}
                <span>Service Type</span>
                <div className="star-red">*</div>
              </div>

              <Input
                className={"form-inputs-ap"}
                value={serviceType}
                // onChange={this.setConsultationName}
              />

              <div className="form-headings flex align-center justify-start">
                {/* {this.formatMessage(messages.consultationFee)} */}
                <span>Service Fees</span>
                <div className="star-red">*</div>
              </div>

              <Input
                className={"form-inputs-ap"}
                value={serviceFees}
                onChange={this.setServiceFee}
                // disabled={provider_id}
              />

              <div className="form-headings flex align-center justify-start">
                {/* {this.formatMessage(messages.consultationFee)} */}
                <span>Currency</span>
                <div className="star-red">*</div>
              </div>

              <Select
                className="form-inputs-ap drawer-select"
                placeholder="Select Currency"
                showSearch
                onSearch={this.onCurrencySearch}
                value={currency}
                onChange={this.setCurrency}
                autoComplete="off"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {this.getCurrencyOption()}
              </Select>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  render() {
    const { visible, onCloseDrawer } = this.props;
    const { consultation, submitting } = this.state;
    return (
      <Fragment>
        <Drawer
          title={"Edit Service Offering"}
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
          {this.renderAddNewConsultationFee()}
          {consultation !== "" ? (
            <Footer
              onSubmit={this.onSubmit}
              onClose={this.onClose}
              // submitText={this.formatMessage(messages.submit)}
              submitText={"Submit"}
              submitButtonProps={{}}
              cancelComponent={null}
              submitting={submitting}
            />
          ) : // <div className="add-patient-footer">
          //   <Button onClick={this.onClose} style={{ marginRight: 8 }}>
          //     {this.formatMessage(messages.cancel)}
          //   </Button>
          //   <Button onClick={this.onSubmit} type="primary">
          //     {this.formatMessage(messages.submit)}
          //   </Button>
          // </div>
          null}
        </Drawer>
      </Fragment>
    );
  }
}

export default injectIntl(EditService);
