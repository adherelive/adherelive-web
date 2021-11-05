import React, { Component } from "react";
import { injectIntl } from "react-intl";
import Form from "antd/es/form";
import Input from "antd/es/input";
import messages from "./message";
import Radio from "antd/es/radio";
import Tooltip from "antd/es/tooltip";
import Button from "antd/es/button";
import confirm from "antd/es/modal/confirm";

import prefixField from "../../Prefix";
import Customization from "../addProvider/customization";
import { SAVINGS, CURRENT, ACCOUNT_TYPES } from "../../../constant";

const { Item: FormItem } = Form;
const { TextArea } = Input;

const NAME = "name";
const EMAIL = "email";
const PREFIX = "prefix";
const MOBILE_NUMBER = "mobile_number";
const ADDRESS = "address";
const ACCOUNT_TYPE = "account_type";
const CUSTOMER_NAME = "customer_name";
const ACCOUNT_NUMBER = "account_number";
const IFCS_CODE = "ifsc_code";
const UPI_ID = "upi_id";
const RAZORPAY_ACCOUNT_ID = "razorpay_account_id";
const RAZORPAY_ACCOUNT_NAME = "razorpay_account_name";
const PRESCRIPTION_DETAILS = "prescription_details";

const FIELDS = [
  NAME,
  EMAIL,
  PREFIX,
  MOBILE_NUMBER,
  ADDRESS,
  ACCOUNT_TYPE,
  CUSTOMER_NAME,
  ACCOUNT_NUMBER,
  IFCS_CODE,
  UPI_ID,
  RAZORPAY_ACCOUNT_ID,
  RAZORPAY_ACCOUNT_NAME,
  PRESCRIPTION_DETAILS,
];

class UpdateProviderForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account_type_exists: false,
    };
  }

  componentDidMount() {
    const { form: { getFieldValue } = {} } = this.props;
    const account_type_obj = getFieldValue([ACCOUNT_TYPE]);
    let account_type_val = "";
    if (account_type_obj && Object.values(account_type_obj).length > 0) {
      account_type_val = Object.values(account_type_obj)[0];
    }

    if (account_type_val) {
      this.setState({ account_type_exists: true });
    }
  }

  getParentNode = (t) => t.parentNode;

  formatMessage = (data) => this.props.intl.formatMessage(data);

  setAccountType = (type) => (e) => {
    e.preventDefault();
    const {
      form: { setFieldsValue },
    } = this.props;

    setFieldsValue({ [ACCOUNT_TYPE]: type });
    this.setState({ account_type_exists: true });
  };

  resetAllAccount = () => {
    const { form: { resetFields, getFieldValue } = {} } = this.props;

    resetFields([CUSTOMER_NAME]);
    resetFields([ACCOUNT_NUMBER]);
    resetFields([IFCS_CODE]);
    resetFields([UPI_ID]);
    resetFields([ACCOUNT_TYPE]);
    resetFields([RAZORPAY_ACCOUNT_ID]);
    resetFields([RAZORPAY_ACCOUNT_NAME]);

    const account_type_obj = getFieldValue([ACCOUNT_TYPE]);
    let account_type_val = "";
    if (account_type_obj && Object.values(account_type_obj).length > 0) {
      account_type_val = Object.values(account_type_obj)[0];
    }

    if (account_type_val) {
      this.setState({ account_type_exists: true });
    } else {
      this.setState({ account_type_exists: false });
    }
  };

  warnNote = () => {
    return (
      <div className="pt16">
        <p className="red">
          <span className="fw600">{"Note"}</span>
          {` : ${this.formatMessage(messages.resetWarn)}`}
        </p>
      </div>
    );
  };

  handleCloseWarning = (e) => {
    e.preventDefault();
    const { warnNote } = this;

    const { account_type_exists } = this.state;

    if (!account_type_exists) {
      return;
    }

    confirm({
      title: `${this.formatMessage(messages.resetMessage)}`,
      content: <div>{warnNote()}</div>,
      onOk: async () => {
        this.resetAllAccount();
      },
      onCancel() {},
    });
  };

  render() {
    const {
      form: { getFieldDecorator, isFieldTouched, getFieldError, getFieldValue },
    } = this.props;
    const { formatMessage } = this;

    let fieldsError = {};
    FIELDS.forEach((value) => {
      const error = isFieldTouched(value) && getFieldError(value);
      fieldsError = { ...fieldsError, [value]: error };
    });

    const {
      providers = {},
      users = {},
      provider_id = null,
      account_details = {},
    } = this.props;

    const {
      basic_info: {
        address = "",
        city = "",
        name = "",
        state = "",
        user_id = null,
      } = {},
      details: { prescription_details: initial_prescription_details = "" } = {},
    } = providers[provider_id] || {};

    let accountData = {};

    for (let detail of Object.values(account_details)) {
      const { basic_info: { user_id: account_user_id = "" } = {} } = detail;
      const { basic_info = {} } = detail;
      if (parseInt(account_user_id) === parseInt(user_id)) {
        accountData = { basic_info };
        break;
      }
    }

    const { basic_info: account_basic_info = {} } = accountData;

    const {
      account_number = "",
      account_type = "",
      customer_name = "",
      ifsc_code = "",
      razorpay_account_id = null,
      razorpay_account_name = "",
      upi_id = null,
    } = account_basic_info || {};

    const {
      basic_info: {
        email = "",
        mobile_number = "",
        prefix = "",
        user_name = "",
      } = {},
    } = users[user_id] || {};

    const { account_type_exists = false } = this.state;
    const account_type_obj = getFieldValue([ACCOUNT_TYPE]);
    let account_type_val = "";
    if (account_type_obj && Object.values(account_type_obj).length > 0) {
      account_type_val = Object.values(account_type_obj)[0];
    }

    const prefixSelector = (
      <div>{prefixField.render({ ...this.props, prefix })}</div>
    );

    return (
      <Form className="fw700 wp100 pb30 Form">
        <FormItem
          validateStatus={fieldsError[EMAIL] ? "error" : ""}
          help={fieldsError[EMAIL] || ""}
          label={formatMessage(messages.email)}
          hasFeedback={true}
          className="mb0I"
        >
          {getFieldDecorator(EMAIL, {
            rules: [
              {
                type: "email",
                message: formatMessage(messages.valid_email_text),
              },
              {
                required: true,
                message: formatMessage(messages.email_required_text),
              },
            ],
            initialValue: email,
          })(<Input type="string" />)}
        </FormItem>

        <FormItem
          validateStatus={fieldsError[NAME] ? "error" : ""}
          help={fieldsError[NAME] || ""}
          label={formatMessage(messages.name)}
          className="mb0I"
        >
          {getFieldDecorator(NAME, {
            rules: [
              {
                required: true,
                message: formatMessage(messages.name_error),
              },
            ],
            initialValue: name,
          })(<Input type="string" />)}
        </FormItem>

        <FormItem
          className="provider-number"
          validateStatus={fieldsError[MOBILE_NUMBER] ? "error" : ""}
          help={fieldsError[MOBILE_NUMBER] || ""}
          label={formatMessage(messages.contactNumber)}
          className="mb0I"
        >
          {getFieldDecorator(MOBILE_NUMBER, {
            initialValue: mobile_number,
          })(
            <Input
              addonBefore={prefixSelector}
              minLength={6}
              maxLength={20}
              type="number"
              style={{ borderColor: "red" }}
            />
          )}
        </FormItem>

        <FormItem
          validateStatus={fieldsError[ADDRESS] ? "error" : ""}
          help={fieldsError[ADDRESS] || ""}
          label={formatMessage(messages.address)}
          className="mb0I"
        >
          {getFieldDecorator(ADDRESS, {
            initialValue: address,
          })(<Input type="string" />)}
        </FormItem>

        <Customization {...this.props} />

        {/* <---------------------------------- ACCOUNT DETAILS ------------------------------------> */}

        <div className="fwbolder fs18 mb20 mt20 flex align-center justify-space-between">
          <span>{formatMessage(messages.accountDetails)}</span>
          <Tooltip title={formatMessage(messages.resetAccountFields)}>
            <Button type="ghost" onClick={this.handleCloseWarning}>
              {formatMessage(messages.reset)}
            </Button>
          </Tooltip>
        </div>

        {/* account type */}
        <FormItem
          validateStatus={fieldsError[ACCOUNT_TYPE] ? "error" : ""}
          help={fieldsError[ACCOUNT_TYPE] || ""}
          label={formatMessage(messages.accountType)}
          className="mb0I"
        >
          {getFieldDecorator(ACCOUNT_TYPE, {
            initialValue: account_type,
          })(
            <div className="add-patient-radio wp100 flex">
              <Radio.Group
                buttonStyle="solid"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                value={account_type_val}
              >
                <Radio.Button
                  style={{
                    width: "50%",
                  }}
                  value={SAVINGS}
                  onClick={this.setAccountType(SAVINGS)}
                >
                  {ACCOUNT_TYPES[SAVINGS]}
                </Radio.Button>

                <Radio.Button
                  style={{
                    width: "50%",
                  }}
                  value={CURRENT}
                  onClick={this.setAccountType(CURRENT)}
                >
                  {ACCOUNT_TYPES[CURRENT]}
                </Radio.Button>
              </Radio.Group>
            </div>
          )}
        </FormItem>

        {/* customer name */}
        <FormItem
          validateStatus={fieldsError[CUSTOMER_NAME] ? "error" : ""}
          help={fieldsError[CUSTOMER_NAME] || ""}
          label={formatMessage(messages.beneficiaryName)}
          className="mb0I"
        >
          {getFieldDecorator(CUSTOMER_NAME, {
            rules: [
              {
                required: account_type_exists,
                message: formatMessage(messages.beneficiary_name_error),
              },
            ],
            initialValue: customer_name,
          })(<Input type="string" disabled={!account_type_exists} />)}
        </FormItem>

        {/* account num */}
        <FormItem
          validateStatus={fieldsError[ACCOUNT_NUMBER] ? "error" : ""}
          help={fieldsError[ACCOUNT_NUMBER] || ""}
          label={formatMessage(messages.accountNumber)}
          className="provider-number mb0I"
        >
          {getFieldDecorator(ACCOUNT_NUMBER, {
            rules: [
              {
                required: account_type_exists,
                message: formatMessage(messages.account_num_error),
              },
            ],
            initialValue: account_number,
          })(<Input type="number" disabled={!account_type_exists} />)}
        </FormItem>

        {/* ifsc */}
        <FormItem
          validateStatus={fieldsError[IFCS_CODE] ? "error" : ""}
          help={fieldsError[IFCS_CODE] || ""}
          label={formatMessage(messages.ifscCode)}
          className="mb0I"
        >
          {getFieldDecorator(IFCS_CODE, {
            rules: [
              {
                required: account_type_exists,
                message: formatMessage(messages.ifsc_error),
              },
            ],
            initialValue: ifsc_code,
          })(<Input type="string" disabled={!account_type_exists} />)}
        </FormItem>

        {/* upi id */}
        <FormItem
          validateStatus={fieldsError[UPI_ID] ? "error" : ""}
          help={fieldsError[UPI_ID] || ""}
          label={formatMessage(messages.upiId)}
          className="mb0I"
        >
          {getFieldDecorator(UPI_ID, {
            initialValue: upi_id,
          })(<Input type="string" disabled={!account_type_exists} />)}
        </FormItem>

        {/* razorpay acc id */}
        <FormItem
          validateStatus={fieldsError[RAZORPAY_ACCOUNT_ID] ? "error" : ""}
          help={fieldsError[RAZORPAY_ACCOUNT_ID] || ""}
          label={formatMessage(messages.razorpayAccId)}
          className="mb0I"
        >
          {getFieldDecorator(RAZORPAY_ACCOUNT_ID, {
            initialValue: razorpay_account_id,
          })(<Input type="string" disabled={!account_type_exists} />)}
        </FormItem>

        {/* razorpay acc name */}
        <FormItem
          validateStatus={fieldsError[RAZORPAY_ACCOUNT_NAME] ? "error" : ""}
          help={fieldsError[RAZORPAY_ACCOUNT_NAME] || ""}
          label={formatMessage(messages.razorpayAccName)}
          className="mb0I"
        >
          {getFieldDecorator(RAZORPAY_ACCOUNT_NAME, {
            initialValue: razorpay_account_name,
          })(<Input type="string" disabled={!account_type_exists} />)}
        </FormItem>

        {/* prescription details */}
        <FormItem
          validateStatus={fieldsError[PRESCRIPTION_DETAILS] ? "error" : ""}
          help={fieldsError[PRESCRIPTION_DETAILS] || ""}
          label={formatMessage(messages.prescriptionDetails)}
        >
          {getFieldDecorator(PRESCRIPTION_DETAILS, {
            initialValue: initial_prescription_details,
          })(<TextArea rows={3} className="mb40" maxLength={300} />)}
        </FormItem>
      </Form>
    );
  }
}

export default injectIntl(UpdateProviderForm);
