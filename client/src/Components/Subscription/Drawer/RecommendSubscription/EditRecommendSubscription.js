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
import Form from "antd/es/form";
import TextArea from "antd/es/input/TextArea";
// import { CONSULTATION_FEE_TYPE_TEXT } from "../../../constant";

import moment from "moment";
import throttle from "lodash-es/throttle";

// import messages from "./message";
import Footer from "../../../Drawer/footer";
import InputNumber from "antd/es/input-number";

const { Option } = Select;

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Item: FormItem } = Form;

class EditRecommendSubscription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subscriptionName: "Health lite",
      serviceFees: "",
      netSubscriptionFees: "",
      submitting: false,
      duration: 1,
      discount: 5,
      notes: "",
      status: "ACTIVE",
    };
  }

  componentDidMount() {}

  onSubmit = () => {
    console.log("state", this.state);
    this.props.onCloseDrawer();
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  onClose = () => {};

  onChangeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  setStatus = (value) => {
    this.setState({
      status: value,
    });
  };

  onRadioChange = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    if (e.target.value == 100) {
      this.setState({
        duration: e.target.value,
      });
    } else {
      this.setState({
        duration:
          this.state.duration == 100
            ? 1
            : this.state.duration + parseInt(e.target.value),
      });
    }
  };

  onDiscountChange = (e) => {
    this.setState({
      discount: this.state.discount + parseInt(e.target.value),
    });
  };

  getStatusOption = () => {
    let statusOptions = [
      { name: "ACTIVE", id: 1 },
      { name: "IN-ACTIVE", id: 2 },
    ];
    let options = [];
    statusOptions.forEach((status) => {
      options.push(
        <Option key={status.id} value={status.name}>
          {status.name}
        </Option>
      );
    });

    return options;
  };

  renderRecommendSubscription = () => {
    const {
      subscriptionName,
      serviceFees,
      duration,
      discount,
      notes,
      netSubscriptionFees,
      status,
    } = this.state;

    return (
      <div className="form-block-ap">
        <Form className="fw700 wp100 Form">
          <div className="form-headings flex align-center justify-start">
            <span>
              {/* {this.formatMessage(messages.defaultConsultationOptions)} */}
              Subscription plan
            </span>
          </div>

          <FormItem
            className="full-width ant-date-custom"
            //   label={formatMessage(messages.genericName)}
            // label={"Name of subsacription plan"}
          >
            <Input
              autoFocus
              className="mt4"
              //   placeholder={formatMessage(messages.genericName)}
              placeholder={""}
              value={subscriptionName}
              disabled
            />
          </FormItem>
          <div className="form-headings flex align-center justify-start">
            <span>
              {/* {this.formatMessage(messages.defaultConsultationOptions)} */}
              Status
            </span>
          </div>

          <Select
            className="form-inputs-ap drawer-select"
            placeholder="Select Consultation Type"
            value={status}
            onChange={this.setStatus}
            autoComplete="off"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {this.getStatusOption()}
          </Select>

          <div className="flex align-items-end justify-content-space-between">
            <div className="flex direction-row flex-grow-1">
              <label htmlFor="quantity" className="form-label" title="Quantity">
                {/* {formatMessage(messages.quantity)} */}
                Duration
              </label>

              {/* <div className="star-red">*</div> */}
            </div>
            {/* <div className="label-color fontsize12 mb8">
            
            </div> */}
            <div className="flex-grow-0">
              <RadioGroup size="small" className="flex justify-content-end">
                <RadioButton value={1} onClick={this.onRadioChange}>
                  +1 month
                </RadioButton>
                <RadioButton value={100} onClick={this.onRadioChange}>
                  ongoing
                </RadioButton>
              </RadioGroup>
            </div>
          </div>
          <FormItem
            className="flex-1 align-self-end"
            // validateStatus={error ? "error" : ""}
            // help={error ? error[0] : ""}
          >
            {duration == 100 ? (
              <Input
                autoFocus
                className="mt4"
                //   placeholder={formatMessage(messages.genericName)}
                placeholder={"Rs. 600"}
                value={"Ongoing"}
                disabled
              />
            ) : (
              <InputNumber min={1} style={{ width: "100%" }} value={duration} />
            )}
          </FormItem>

          <div className="form-headings flex align-center justify-start">
            <span>
              {/* {this.formatMessage(messages.defaultConsultationOptions)} */}
              Subscription fees
            </span>
          </div>

          <FormItem
            className="full-width ant-date-custom"
            //   label={formatMessage(messages.genericName)}
            // label={"Name of subsacription plan"}
          >
            <Input
              autoFocus
              className="mt4"
              //   placeholder={formatMessage(messages.genericName)}
              placeholder={"Rs. 600"}
              value={serviceFees}
              disabled
            />
          </FormItem>

          <div className="flex align-items-end justify-content-space-between">
            <div className="flex direction-row flex-grow-1">
              <label htmlFor="quantity" className="form-label" title="Quantity">
                {/* {formatMessage(messages.quantity)} */}
                Do you want to offer discount ?
              </label>

              {/* <div className="star-red">*</div> */}
            </div>
            {/* <div className="label-color fontsize12 mb8">
            
            </div> */}
            <div className="flex-grow-0">
              <RadioGroup size="small" className="flex justify-content-end">
                <RadioButton value={5} onClick={this.onDiscountChange}>
                  +5%
                </RadioButton>
              </RadioGroup>
            </div>
          </div>

          <FormItem
            className="flex-1 align-self-end"
            // validateStatus={error ? "error" : ""}
            // help={error ? error[0] : ""}
          >
            <InputNumber min={1} style={{ width: "100%" }} value={discount} />
          </FormItem>
          <div className="form-headings flex align-center justify-start">
            <span>
              {/* {this.formatMessage(messages.defaultConsultationOptions)} */}
              Net subscription fees after discount
            </span>
          </div>

          <FormItem
            className="full-width ant-date-custom"
            //   label={formatMessage(messages.genericName)}
            // label={"Name of subsacription plan"}
          >
            <Input
              autoFocus
              className="mt4"
              //   placeholder={formatMessage(messages.genericName)}
              placeholder={"Rs. 600"}
              value={netSubscriptionFees}
              disabled
            />
          </FormItem>
          <div className="form-headings flex align-center justify-start">
            {/* {this.formatMessage(messages.razorpayLink)} */}
            <span>Notes</span>
          </div>

          <FormItem
            // label={formatMessage(messages.description_text)}
            className="full-width ant-date-custom"
            // label={"Plan description"}
          >
            <TextArea
              autoFocus
              className="mt4"
              maxLength={1000}
              //   placeholder={formatMessage(messages.description_text_placeholder)}
              placeholder={
                "I suggest you take four month subscription until we drop some of your elevated vitals for LFT'S, CSR, etc..."
              }
              rows={4}
              name="notes"
              value={notes}
              onChange={this.onChangeHandler}
            />
          </FormItem>
        </Form>
      </div>
    );
  };

  render() {
    const { visible, onCloseDrawer } = this.props;
    const {
      submitting,
      serviceOfferingsDrawer,
      createSubscriptionWarn,
      editServiceOfferingDrawer,
    } = this.state;

    return (
      <Fragment>
        <Drawer
          title={"Edit Recommend Subscription Plan"}
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
          {this.renderRecommendSubscription()}

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
        {/* <CreateSubscriptionWarn
          isModalVisible={createSubscriptionWarn}
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
        /> */}
      </Fragment>
    );
  }
}

export default injectIntl(EditRecommendSubscription);
