import React, { Component } from "react";
import { injectIntl } from "react-intl";

import Form from "antd/es/form";
import Select from "antd/es/select";
import Input from "antd/es/input";
import TextArea from "antd/es/input/TextArea";
// import messages from "./messages";
import message from "antd/es/message";

const { Item: FormItem } = Form;
const { Option, OptGroup } = Select;

const NAME = "name";
const DESCRIPTION = "description";

const FIELDS = [NAME, DESCRIPTION];

class AddSubscriptionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.scrollToTop();
  }

  scrollToTop = () => {
    let antForm = document.getElementsByClassName("Form")[0];
    let antDrawerBody = antForm.parentNode;
    let antDrawerWrapperBody = antDrawerBody.parentNode;
    antDrawerBody.scrollIntoView(true);
    antDrawerWrapperBody.scrollTop -= 200;
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);
  render() {
    const {
      form: { getFieldDecorator, isFieldTouched, getFieldError, getFieldValue },
    } = this.props;
    const { input = "" } = this.props;
    return (
      <Form className="fw700 wp100 pb30 Form">
        <FormItem
          className="full-width ant-date-custom"
          //   label={formatMessage(messages.genericName)}
          label={"Name of subsacription plan"}
        >
          {getFieldDecorator(NAME, {
            rules: [
              {
                required: true,
                // message: formatMessage(messages.fillFieldsError),
                message: "Subscription name is required",
              },
            ],
            initialValue: input ? input : "",
          })(
            <Input
              autoFocus
              className="mt4"
              //   placeholder={formatMessage(messages.genericName)}
              placeholder={"Health lite"}
            />
          )}
        </FormItem>

        <FormItem
          // label={formatMessage(messages.description_text)}
          className="full-width ant-date-custom"
          label={"Plan description"}
        >
          {getFieldDecorator(DESCRIPTION)(
            <TextArea
              autoFocus
              className="mt4"
              maxLength={1000}
              //   placeholder={formatMessage(messages.description_text_placeholder)}
              placeholder={
                "This is recommended for patients with severe chronic illness"
              }
              rows={4}
            />
          )}
        </FormItem>
      </Form>
    );
  }
}

export default injectIntl(AddSubscriptionForm);
