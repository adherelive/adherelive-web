import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Drawer, Input, Radio, Select } from "antd";
import Form from "antd/es/form";
import TextArea from "antd/es/input/TextArea";
// import { CONSULTATION_FEE_TYPE_TEXT } from "../../../constant";

// import messages from "./message";
import Footer from "../../../Drawer/footer";
import InputNumber from "antd/es/input-number";

const { Option } = Select;

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Item: FormItem } = Form;

class RecommendService extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceOfferingName: "",
      serviceFees: "",
      submitting: false,
      discount: 5,
      notes: "",
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

  setServiceOfferingName = (value) => {
    this.setState({
      serviceOfferingName: value,
      serviceFees: 200,
    });
  };

  onDiscountChange = (e) => {
    this.setState({
      discount: this.state.discount + parseInt(e.target.value),
    });
  };

  getServiceOfferingOption = () => {
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

  renderRecommendSubscription = () => {
    const { serviceOfferingName, serviceFees, discount, notes } = this.state;

    return (
      <div className="form-block-ap">
        <Form className="fw700 wp100 Form">
          <div className="form-headings flex align-center justify-start">
            <span>
              {/* {this.formatMessage(messages.defaultConsultationOptions)} */}
              Service offerings
            </span>
          </div>

          <Select
            className="form-inputs-ap drawer-select"
            placeholder="Select Consultation Type"
            value={serviceOfferingName}
            onChange={this.setServiceOfferingName}
            autoComplete="off"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {this.getServiceOfferingOption()}
          </Select>

          <div className="form-headings flex align-center justify-start">
            <span>
              {/* {this.formatMessage(messages.defaultConsultationOptions)} */}
              Service fees
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
                "I suggest let meet virtually and see how you are going. Call the reception or me"
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
          title={"Recommend services offerings"}
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

export default injectIntl(RecommendService);
