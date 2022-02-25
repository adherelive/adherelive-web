import React, { Component, Fragment } from "react";
// import { injectIntl, FormattedMessage } from "react-intl";
import { Button, Input, Form, message, Checkbox } from "antd";

import PPModal from "../../Containers/Modal/PPConfirm";
import { injectIntl } from "react-intl";
import messages from "./message";
import { PATH } from "../../constant";
import config from "../../config";

const { Item: FormItem } = Form;
const { Password } = Input;

const EMAIL = "email";
const PASSWORD = "password";

const FIELDS = [EMAIL, PASSWORD];

const TOS_PAGE_URL = `${config.WEB_URL}${PATH.TERMS_OF_SERVICE}`;
const PRIVACY_PAGE_URL = `${config.WEB_URL}${PATH.PRIVACY_POLICY}`;

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: true,
      readTermsOfService: false,
      openTOSModal: false,
    };
  }

  componentDidMount() {}

  formatMessage = (data) => this.props.intl.formatMessage(data);

  openTOSModalComp = (e) => {
    e.preventDefault();

    const { readTermsOfService } = this.state;
    if (!readTermsOfService) {
      this.setState({ openTOSModal: true });
      return;
    }
    this.handleSignUp();
  };

  handleSignUp = () => {
    // e.preventDefault();
    const { signUp } = this.props;
    const { readTermsOfService } = this.state;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        signUp({ ...values, readTermsOfService }).then((response) => {
          const { status } = response;
          if (status) {
            this.props.form.resetFields();
            message.success(this.formatMessage(messages.verifyEmail));
          } else {
            let {
              payload: { error = {}, message: responseMessage = "" } = {},
              statusCode = "",
            } = response;

            if (statusCode === 400 || statusCode === 422) {
              const { message: errorMessage = "" } = error;
              message.error(
                statusCode === 400 ? errorMessage : responseMessage
              );
            } else {
              message.error(this.formatMessage(messages.somethingWentWrong));
            }
          }
        });
      }
    });
  };

  closeTOSModal = (e) => {
    this.setState({ openTOSModal: false });
  };

  tosComponent = () => {
    const { readTermsOfService } = this.state;
    const { updateReadTermsOfService } = this;
    return (
      <div className="flex mb20">
        {/* <div classname='fs12 medium dark-sky-blue mt4 tar'>Forgot Password?</div> */}
        <Checkbox
          checked={readTermsOfService}
          onChange={updateReadTermsOfService}
        ></Checkbox>

        <div className="slate-grey mt-10 fs12 p10 medium">
          <span>{this.formatMessage(messages.agreeSignupPPText)}</span>{" "}
          {/* <a href={TOS_PAGE_URL} target={"_blank"}>
            {this.formatMessage(messages.termsOfService)}
          </a>{" "} */}
          {/* <span>{this.formatMessage(messages.andText)}</span>{" "} */}
          <a href={PRIVACY_PAGE_URL} target={"_blank"}>
            {this.formatMessage(messages.privacyPolicy)}
          </a>
        </div>
      </div>
    );
  };

  updateReadTermsOfService = (e) => {
    const { readTermsOfService, openTOSModal } = this.state;

    if (readTermsOfService) {
      // if true before
      this.setState({
        readTermsOfService: !readTermsOfService,
        openTOSModal: false,
      });
    } else {
      this.setState({
        // readTermsOfService: !readTermsOfService,
        openTOSModal: true,
      });
    }
  };

  modalAcceptTOS = (e) => {
    const { readTermsOfService, openTOSModal } = this.state;

    this.setState({
      readTermsOfService: !readTermsOfService,
      openTOSModal: false,
    });
  };

  render() {
    const {
      form: { getFieldDecorator, isFieldTouched, getFieldError },
    } = this.props;
    const { readTermsOfService, openTOSModal } = this.state;
    let fieldsError = {};
    FIELDS.forEach((value) => {
      const error = isFieldTouched(value) && getFieldError(value);
      fieldsError = { ...fieldsError, [value]: error };
    });
    const {
      handleSignUp,
      openTOSModalComp,
      modalAcceptTOS,
      closeTOSModal,
      tosComponent,
    } = this;
    return (
      <Fragment>
        <Form onSubmit={openTOSModalComp} className="login-form">
          <FormItem
            validateStatus={fieldsError[EMAIL] ? "error" : ""}
            help={fieldsError[EMAIL] || ""}
          >
            <div className="fs16 medium tal mt8">
              {this.formatMessage(messages.workEmail)}
            </div>
            {getFieldDecorator(EMAIL, {
              rules: [
                {
                  required: true,
                  message: this.formatMessage(messages.enterEmail),
                },
                {
                  type: "email",
                  message: this.formatMessage(messages.enterValidEmail),
                },
              ],
            })(<Input type="text" placeholder="Email" className="h40" />)}
          </FormItem>

          <FormItem
            validateStatus={fieldsError[PASSWORD] ? "error" : ""}
            help={fieldsError[PASSWORD] || ""}
          >
            <div className="fs16 medium tal">
              {this.formatMessage(messages.createPassword)}
            </div>
            {getFieldDecorator(PASSWORD, {
              rules: [
                {
                  required: true,
                  message: this.formatMessage(messages.enterPassword),
                },
              ],
            })(<Password placeholder="Password" className="h40" />)}
          </FormItem>

          {tosComponent()}

          <FormItem>
            <Button
              type="primary"
              className="wp100 h40"
              htmlType="submit"
              size={"large"}
              // loading={loading}
            >
              {this.formatMessage(messages.createAccount)}
            </Button>
            <div className="flex justify-space-between direction-column mt10 align-end"></div>
          </FormItem>
        </Form>
        {openTOSModal && (
          <PPModal
            checked={readTermsOfService}
            visible={openTOSModal}
            onAccept={modalAcceptTOS}
            onCancel={closeTOSModal}
          />
        )}
      </Fragment>
    );
  }
}

export default Form.create({ name: "signup_form" })(injectIntl(SignUp));
