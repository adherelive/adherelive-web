import React, { Component } from "react";
import { injectIntl } from "react-intl";

import Form from "antd/es/form";
import Input from "antd/es/input";
import Radio from "antd/es/radio";
import Button from "antd/es/button";
import Tooltip from "antd/es/tooltip";
import confirm from "antd/es/modal/confirm";

import Customization from "./customization";
import messages from "./message";

import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import prefixField from "../../Prefix";
import { SAVINGS, CURRENT, ACCOUNT_TYPES } from "../../../constant";

const { Item: FormItem } = Form;
const { Password, TextArea } = Input;

const NAME = "name";
const EMAIL = "email";
const PASSWORD = "password";
const CONFIRM_PASSWORD = "confirm_password";
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
  PASSWORD,
  CONFIRM_PASSWORD,
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

class AddProviderForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account_type_exists: false,
    };
  }

  componentDidMount() {
    const { form: { validateFields } = {} } = this.props;
    validateFields();
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
    const { form: { resetFields, setFieldsValue } = {} } = this.props;
    resetFields([CUSTOMER_NAME]);
    resetFields([ACCOUNT_NUMBER]);
    resetFields([IFCS_CODE]);
    resetFields([UPI_ID]);
    resetFields([ACCOUNT_TYPE]);
    resetFields([RAZORPAY_ACCOUNT_ID]);
    resetFields([RAZORPAY_ACCOUNT_NAME]);

    this.setState({ account_type_exists: false });
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

    const { account_type_exists = false } = this.state;
    const account_type_obj = getFieldValue([ACCOUNT_TYPE]);
    let account_type_val = "";
    if (account_type_obj && Object.values(account_type_obj).length > 0) {
      account_type_val = Object.values(account_type_obj)[0];
    }

    let fieldsError = {};
    FIELDS.forEach((value) => {
      const error = isFieldTouched(value) && getFieldError(value);
      fieldsError = { ...fieldsError, [value]: error };
    });

    const prefixSelector = <div>{prefixField.render(this.props)}</div>;

    return (
      <Form className="wp100 pb30 Form" layout={"vertical"}>
        {/* email */}
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
          })(<Input type="string" />)}
        </FormItem>

        {/* password */}
        <FormItem
          validateStatus={fieldsError[PASSWORD] ? "error" : ""}
          help={fieldsError[PASSWORD] || ""}
          label={formatMessage(messages.password)}
          className="mb0I"
        >
          {getFieldDecorator(PASSWORD, {
            rules: [
              {
                required: true,
                message: formatMessage(messages.password_required_text),
              },
            ],
          })(
            <Password
              type="string"
              placeholder="Input password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          )}
        </FormItem>

        {/* confirm password */}
        <FormItem
          validateStatus={fieldsError[CONFIRM_PASSWORD] ? "error" : ""}
          help={fieldsError[CONFIRM_PASSWORD] || ""}
          label={formatMessage(messages.confirm_password)}
          className="mb0I"
        >
          {getFieldDecorator(CONFIRM_PASSWORD, {
            rules: [
              {
                required: true,
                message: formatMessage(messages.confirm_password_required_text),
              },
            ],
          })(
            <Password
              type="string"
              placeholder="Input Confirm password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          )}
        </FormItem>

        {/* name */}
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
          })(<Input type="string" />)}
        </FormItem>

        {/* mobile number */}
        <FormItem
          className="provider-number"
          validateStatus={fieldsError[MOBILE_NUMBER] ? "error" : ""}
          help={fieldsError[MOBILE_NUMBER] || ""}
          label={formatMessage(messages.contactNumber)}
          className="mb0I"
        >
          {getFieldDecorator(
            MOBILE_NUMBER,
            {}
          )(
            <Input
              addonBefore={prefixSelector}
              minLength={6}
              maxLength={20}
              type="number"
            />
          )}
        </FormItem>

        {/* address */}
        <FormItem
          validateStatus={fieldsError[ADDRESS] ? "error" : ""}
          help={fieldsError[ADDRESS] || ""}
          label={formatMessage(messages.address)}
          className="mb0I"
        >
          {getFieldDecorator(ADDRESS, {
            rules: [
              {
                required: true,
                message: formatMessage(messages.address_required_text),
              },
            ],
          })(<Input type="string" />)}
        </FormItem>

        <Customization {...this.props} />
        {/* <-------------------------- ACCOUNT DETAILS --------------------------------------->*/}

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
          {getFieldDecorator(
            ACCOUNT_TYPE,
            {}
          )(
            <div className="add-patient-radio wp100  flex">
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
          })(<Input type="string" disabled={!account_type_exists} />)}
        </FormItem>

        {/* upi id */}
        <FormItem
          validateStatus={fieldsError[UPI_ID] ? "error" : ""}
          help={fieldsError[UPI_ID] || ""}
          label={formatMessage(messages.upiId)}
          className="mb0I"
        >
          {getFieldDecorator(
            UPI_ID,
            {}
          )(<Input type="string" disabled={!account_type_exists} />)}
        </FormItem>

        {/* razorpay acc id */}
        <FormItem
          validateStatus={fieldsError[RAZORPAY_ACCOUNT_ID] ? "error" : ""}
          help={fieldsError[RAZORPAY_ACCOUNT_ID] || ""}
          label={formatMessage(messages.razorpayAccId)}
          className="mb0I"
        >
          {getFieldDecorator(
            RAZORPAY_ACCOUNT_ID,
            {}
          )(<Input type="string" disabled={!account_type_exists} />)}
        </FormItem>

        {/* razorpay acc name */}
        <FormItem
          validateStatus={fieldsError[RAZORPAY_ACCOUNT_NAME] ? "error" : ""}
          help={fieldsError[RAZORPAY_ACCOUNT_NAME] || ""}
          label={formatMessage(messages.razorpayAccName)}
          className="mb0I"
        >
          {getFieldDecorator(
            RAZORPAY_ACCOUNT_NAME,
            {}
          )(<Input type="string" disabled={!account_type_exists} />)}
        </FormItem>

        {/* prescription details */}
        <FormItem
          validateStatus={fieldsError[PRESCRIPTION_DETAILS] ? "error" : ""}
          help={fieldsError[PRESCRIPTION_DETAILS] || ""}
          label={formatMessage(messages.prescriptionDetails)}
        >
          {getFieldDecorator(
            PRESCRIPTION_DETAILS,
            {}
          )(<TextArea rows={3} className="mb40" maxLength={300} />)}
        </FormItem>
      </Form>
    );
  }
}

export default injectIntl(AddProviderForm);
