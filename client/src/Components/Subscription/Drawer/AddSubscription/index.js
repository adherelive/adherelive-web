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
import AddServiceOfferings from "../AddServiceOfferings";

const { Option } = Select;

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Item: FormItem } = Form;

class AddSubscription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subscriptionName: "",
      totalSubscriptionFees: "",
      planDescription: "",
      submitting: false,
      serviceOfferingsDrawer: false,
    };
  }

  componentDidMount() {}

  onSubmit = () => {
    alert("submit");
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  onClose = () => {};

  setSubscriptionName = (e) => {
    this.setState({ subscriptionName: e.target.value });
  };

  setServiceOfferingDrawer = () => {
    this.setState({
      serviceOfferingsDrawer: true,
    });
  };

  onCloseDrawer = () => {
    this.setState({
      serviceOfferingsDrawer: false,
    });
  };

  renderAddNewSubscription = () => {
    const { subscriptionName, totalSubscriptionFees, planDescription } =
      this.state;

    return (
      <div className="form-block-ap">
        <Form className="fw700 wp100 pb30 Form">
          <div className="form-headings flex align-center justify-start">
            <span>
              {/* {this.formatMessage(messages.defaultConsultationOptions)} */}
              Name of subscription plan
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
              placeholder={"Health lite"}
              value={subscriptionName}
            />
          </FormItem>

          <div className="wp100 flex align-center justify-space-between">
            <div className="form-headings flex align-center justify-start">
              <span>
                {/* {this.formatMessage(messages.defaultConsultationOptions)} */}
                Service offerings
              </span>
            </div>

            <div className="add-more" onClick={this.setServiceOfferingDrawer}>
              {/* {this.formatMessage(messages.addMore)} */}
              Add
            </div>

            {/* <div className="add-more" onClick={this.showAddVital}>
              {this.formatMessage(messages.add)}
            </div> */}
          </div>
          <div className="flex wp100 flex-grow-1 align-center">
            <div className="drawer-block">
              <div className="flex direction-row justify-space-between align-center">
                <div className="form-headings-ap">1 * Virtual consultation</div>
                <Icon
                  type="edit"
                  className="ml20"
                  style={{ color: "#4a90e2" }}
                  theme="filled"
                  // onClick={this.showInnerForm(EVENT_TYPE.APPOINTMENT, key)}
                />
              </div>
              <div className="drawer-block-description">Digital</div>
              <div className="drawer-block-description">{`Rs 200`}</div>
            </div>
          </div>

          <div className="form-headings flex align-center justify-start">
            <span>
              {/* {this.formatMessage(messages.defaultConsultationOptions)} */}
              Total subscription fees
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
              value={totalSubscriptionFees}
              disabled
            />
          </FormItem>
          <div className="form-headings flex align-center justify-start">
            {/* {this.formatMessage(messages.razorpayLink)} */}
            <span>Plan Description</span>
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
                "This is recommended for patients with severe chronic illness"
              }
              rows={4}
              value={planDescription}
            />
          </FormItem>
        </Form>
      </div>
    );
  };

  render() {
    const { visible, onCloseDrawer } = this.props;
    const { submitting, serviceOfferingsDrawer } = this.state;

    return (
      <Fragment>
        <Drawer
          title={"Add New Subscription Plan"}
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
          {this.renderAddNewSubscription()}
          {serviceOfferingsDrawer == true && (
            <AddServiceOfferings
              visible={serviceOfferingsDrawer}
              onCloseDrawer={this.onCloseDrawer}
            />
          )}
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

export default injectIntl(AddSubscription);
