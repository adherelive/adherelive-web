import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Drawer, Icon, Input, Radio, Select } from "antd";
import Form from "antd/es/form";
import TextArea from "antd/es/input/TextArea";
// import { CONSULTATION_FEE_TYPE_TEXT } from "../../../constant";

// import messages from "./message";
import Footer from "../../../Drawer/footer";
import AddServiceOfferings from "../AddServiceOfferings";
import EditServiceOfferings from "../AddServiceOfferings/EditServiceOfferings";
import CreateSubscriptionWarn from "./../../Modal/CreateSubscriptionWarn";

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
      createSubscriptionWarn: false,
      editServiceOfferingDrawer: false,
    };
  }

  componentDidMount() {}

  onSubmit = () => {
    console.log(this.state);
    this.setState({
      createSubscriptionWarn: true,
    });
  };

  handleOk = () => {
    this.setState({
      createSubscriptionWarn: false,
    });
    this.props.onCloseDrawer();
  };

  handleCancel = () => {
    this.setState({
      createSubscriptionWarn: false,
    });
    this.props.onCloseDrawer();
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  onClose = () => {};

  onChangeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  setServiceOfferingDrawer = () => {
    this.setState({
      serviceOfferingsDrawer: true,
    });
  };

  onCloseDrawer = () => {
    this.setState({
      serviceOfferingsDrawer: false,
      editServiceOfferingDrawer: false,
    });
  };

  editServiceOfferingHandler = () => {
    this.setState({
      editServiceOfferingDrawer: true,
    });
  };

  renderAddNewSubscription = () => {
    const { subscriptionName, totalSubscriptionFees, planDescription } =
      this.state;

    return (
      <div className="form-block-ap">
        <Form className="fw700 wp100 Form">
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
              name="subscriptionName"
              value={subscriptionName}
              onChange={this.onChangeHandler}
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
                  onClick={this.editServiceOfferingHandler}
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
              name="planDescription"
              value={planDescription}
              onChange={this.onChangeHandler}
            />
          </FormItem>
          <h3>
            Subscription period is always monthly please refer to T&C for
            details
          </h3>
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
          {serviceOfferingsDrawer === true && (
            <AddServiceOfferings
              visible={serviceOfferingsDrawer}
              onCloseDrawer={this.onCloseDrawer}
            />
          )}
          {editServiceOfferingDrawer === true && (
            <EditServiceOfferings
              visible={editServiceOfferingDrawer}
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
        <CreateSubscriptionWarn
          isModalVisible={createSubscriptionWarn}
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
        />
      </Fragment>
    );
  }
}

export default injectIntl(AddSubscription);
