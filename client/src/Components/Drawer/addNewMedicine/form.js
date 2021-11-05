import React, { Component } from "react";
import { injectIntl } from "react-intl";

import Form from "antd/es/form";
import Select from "antd/es/select";
import Input from "antd/es/input";
import messages from "./messages";
import message from "antd/es/message";

const { Item: FormItem } = Form;
const { Option, OptGroup } = Select;

const NAME = "name";
const TYPE = "type";

const FIELDS = [NAME, TYPE];

class AddMedicineForm extends Component {
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

  getParentNode = (t) => t.parentNode;

  formatMessage = (data) => this.props.intl.formatMessage(data);

  getStringFormat = (str) => {
    return str
      ? `${str.charAt(0).toUpperCase()}${str.substring(1, str.length)}`
      : "";
  };

  getOptions = (items, category) => {
    const { getStringFormat } = this;

    return items.map((item) => {
      const { name, defaultUnit, id } = item || {};

      return (
        <Option
          key={`${category}:${defaultUnit}:${name}`}
          value={name}
          title={name}
        >
          {getStringFormat(name)}
        </Option>
      );
    });
  };

  getFormulationOptions = () => {
    const { medication_details: { medicine_type = {} } = {} } = this.props;
    const { getOptions, getStringFormat } = this;

    return Object.keys(medicine_type).map((id) => {
      const { items, name } = medicine_type[id] || {};

      return (
        <OptGroup label={getStringFormat(name)}>
          {getOptions(items, id)}
        </OptGroup>
      );
    });
  };

  handleSelect = (value) => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ [TYPE]: value });
  };

  render() {
    const {
      form: { getFieldDecorator, isFieldTouched, getFieldError, getFieldValue },
    } = this.props;
    // const disabledSubmit = (!name || !type);

    const { input = "" } = this.props;

    const { formatMessage } = this;

    let fieldsError = {};
    FIELDS.forEach((value) => {
      const error = isFieldTouched(value) && getFieldError(value);
      fieldsError = { ...fieldsError, [value]: error };
    });

    return (
      <Form className="fw700 wp100 pb30 Form">
        <FormItem
          className="full-width ant-date-custom"
          label={formatMessage(messages.genericName)}
        >
          {getFieldDecorator(NAME, {
            rules: [
              {
                required: true,
                message: formatMessage(messages.fillFieldsError),
              },
            ],
            initialValue: input ? input : "",
          })(
            <Input
              autoFocus
              className="mt4"
              placeholder={formatMessage(messages.genericName)}
            />
          )}
        </FormItem>

        <FormItem label={formatMessage(messages.formulation)}>
          {getFieldDecorator(TYPE, {
            rules: [
              {
                required: true,
                message: formatMessage(messages.fillFieldsError),
              },
            ],
          })(
            <Select
              className="full-width"
              placeholder=""
              showSearch
              autoComplete="off"
              optionFilterProp="children"
              suffixIcon={null}
              // filterOption={(input, option) =>
              //     option.props.children
              //         .toLowerCase()
              //         .indexOf(input.toLowerCase()) >= 0
              // }
              getPopupContainer={this.getParentNode}
              onSelect={this.handleSelect}
            >
              {this.getFormulationOptions()}
            </Select>
          )}
        </FormItem>
      </Form>
    );
  }
}

export default injectIntl(AddMedicineForm);
