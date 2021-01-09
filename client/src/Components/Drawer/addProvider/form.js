import React, { Component } from "react";
import { injectIntl } from "react-intl";

import Form from "antd/es/form";
import Input from "antd/es/input";
import messages from "./message";
import {
    EyeTwoTone,
    EyeInvisibleOutlined
  } from "@ant-design/icons";
import prefixField from "../../Prefix";


const { Item: FormItem } = Form;
const { Password } = Input;

const NAME = "name";
const EMAIL = "email";
const PASSWORD = "password";
const CONFIRM_PASSWORD = "confirm_password";
const PREFIX = "prefix";
const MOBILE_NUMBER = "mobile_number";
const ADDRESS = "address";

const FIELDS = [
  NAME,
  EMAIL,
  PASSWORD,
  CONFIRM_PASSWORD,
  PREFIX,
  MOBILE_NUMBER,
  ADDRESS
];

class AddProviderForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

    componentDidMount() {
        const { form: { validateFields } = {} } = this.props;
        validateFields();
    }

  getParentNode = t => t.parentNode;

  formatMessage = data => this.props.intl.formatMessage(data);



  render() {
    const {
      form: { getFieldDecorator, isFieldTouched, getFieldError, getFieldValue }
    } = this.props;
    const {
      formatMessage,
    } = this;

    let fieldsError = {};
    FIELDS.forEach(value => {
      const error = isFieldTouched(value) && getFieldError(value);
      fieldsError = { ...fieldsError, [value]: error };
    });

    const prefixSelector = (
        <div>
        {prefixField.render(this.props)}

        </div>
      );

    return (
        <Form className="wp100 pb30 Form" layout={"vertical"}>
            {/*<div className="form-headings flex align-center justify-start">*/}
            {/*    {formatMessage(messages.email)}*/}
            {/*    <div className="star-red">*</div>*/}
            {/*</div>*/}

          
          <FormItem
              validateStatus={fieldsError[EMAIL] ? "error" : ""}
              help={fieldsError[EMAIL] || ""}
              label={formatMessage(messages.email)}
              // className={"mb20"}
              hasFeedback={true}
          >
            {getFieldDecorator(EMAIL, {
                rules: [
                    {
                        type: "email",
                        message: formatMessage(messages.valid_email_text)
                    },
                    {
                        required: true,
                        message: formatMessage(messages.email_required_text)
                    }
                ]
            })
            (
                <Input
                // className={"form-inputs-ap   "}
                type="string"
                />
            )}
          </FormItem>



          {/*<div className="form-headings flex align-center justify-start">*/}
          {/*  {this.formatMessage(messages.password)}*/}
          {/*  <div className="star-red">*</div>*/}
          {/*</div>*/}

          <FormItem
              validateStatus={fieldsError[PASSWORD] ? "error" : ""}
              help={fieldsError[PASSWORD] || ""}
              label={formatMessage(messages.password)}
          >
            {getFieldDecorator(PASSWORD, {
                rules: [
                    {
                        required: true,
                        message: formatMessage(messages.password_required_text)
                    }
                ]
            })
            (
            <Password
            // className={"form-inputs-ap "}
            type="string"
            placeholder="Input password"
            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
            )}
          </FormItem>
        

          <div className="form-headings flex align-center justify-start">
            {this.formatMessage(messages.confirm_password)}
            <div className="star-red">*</div>
          </div>

          <FormItem
          >
            {getFieldDecorator(CONFIRM_PASSWORD, {})
            (
                  
            <Password
            className={"form-inputs-ap "}
            type="string"
            placeholder="Input Confirm password"
            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
            )}
          </FormItem>

            <div className="form-headings flex align-center justify-start mt-20">
                {this.formatMessage(messages.name)}
                <div className="star-red">*</div>
            </div>


            <FormItem
            >
                {getFieldDecorator(NAME, {})
                (

                    <Input
                        className={"form-inputs-ap "}
                        type="string"
                    />
                )}
            </FormItem>
       


         <div className="form-headings flex align-center justify-start mt-20">
            {this.formatMessage(messages.contactNumber)}
           
          </div>

            <FormItem
              className="provider-number"

            >
            {getFieldDecorator(MOBILE_NUMBER, {})
            (
                  
                <Input
                addonBefore={prefixSelector}
                className={"form-inputs-ap "}
                minLength={6}
                maxLength={20}
                type="number"
                style={{borderColor:"red"}}
    
              />
            )}
          </FormItem>

        <div className="form-headings flex align-center justify-start mt-20">
        {this.formatMessage(messages.address)}
        {/*<div className="star-red">*</div>*/}
        </div>

        <FormItem
        >
        {getFieldDecorator(ADDRESS, {})
        (
            <Input
            className={"form-inputs-ap "}
            type="string"
            />
        )}
        </FormItem>

        </Form>
    );
  }
}

export default injectIntl(AddProviderForm);
