import React, { Component } from "react";
import { injectIntl } from "react-intl";
import Form from "antd/es/form";
import Input from "antd/es/input";
import messages from "./message";

import prefixField from "../../Prefix";

const { Item: FormItem } = Form;

const NAME = "name";
const EMAIL = "email";
const PREFIX = "prefix";
const MOBILE_NUMBER = "mobile_number";
const ADDRESS = "address";

const FIELDS = [
  NAME,
  EMAIL,
  PREFIX,
  MOBILE_NUMBER,
  ADDRESS
];

class UpdateProviderForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
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

    const {providers={},users={}} = this.props;
    const {provider_id=null} = this.props;
    const { basic_info :{
        address= '',
        city='',
        name= '',
        state= '',
        user_id=null} ={}
    } = providers[provider_id] || {};

    const {basic_info : {
    email= "",
    mobile_number= "",
    prefix= "",
    user_name= "",} = {}} = users[user_id] || {};

    const prefixSelector = (
        <div>

        {prefixField.render({...this.props,prefix})}

        </div>
      );

      

    return (
        <Form className="fw700 wp100 pb30 Form">
            <div className="form-headings flex align-center justify-start">
                {formatMessage(messages.email)}
                <div className="star-red">*</div>
            </div>

          
          <FormItem
          >
            {getFieldDecorator(EMAIL, {
                initialValue: email
            })
            (
                <Input
                className={"form-inputs-ap   "}
                type="string"
                />
            )}
          </FormItem>

            <div className="form-headings flex align-center justify-start mt-20">
                {this.formatMessage(messages.name)}
                <div className="star-red">*</div>
            </div>


            <FormItem
            >
                {getFieldDecorator(NAME, {
                    initialValue: name
                })
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
            {getFieldDecorator(MOBILE_NUMBER, {
                initialValue: mobile_number
            })
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
            // label={this.formatMessage(messages.address)}
        >
        {getFieldDecorator(ADDRESS, {
            initialValue: address
        })
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

export default injectIntl(UpdateProviderForm);
