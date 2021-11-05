import React, { Component } from "react";
import { injectIntl } from "react-intl";

import Form from "antd/es/form";
import Select from "antd/es/select";
import Input from "antd/es/input";
import messages from "./message";
import message from "antd/es/message";

const { Item: FormItem } = Form;
const { Option, OptGroup } = Select;

const NAME = "name";
const PORTION_SIZE = "portion_size";
const PORTION_ID = "portion_id";
const FATS = "fats";
const CARBS = "carbs";
const PROTEINS = "proteins";
const FIBERS = "fibers";
const CALORIFIC_VALUE = "calorific_value";

const FIELDS = [
  NAME,
  PORTION_SIZE,
  PORTION_ID,
  FATS,
  CARBS,
  PROTEINS,
  FIBERS,
  CALORIFIC_VALUE,
];

class AddFoodItemForm extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { food_item_name = "" } = this.props;
    if (food_item_name.length) {
      const { form: { setFieldsValue } = {} } = this.props;

      setFieldsValue({ [NAME]: food_item_name });
    }
  }

  getPortionOptions = () => {
    const { portions = {} } = this.props;

    return Object.values(portions).map((each, index) => {
      const { basic_info: { id = null, name = "" } = {} } = each || {};
      return (
        <Option key={`${index}-${name}`} value={id}>
          {name}
        </Option>
      );
    });
  };

  handlePortionSelect = (value) => {
    const { form: { setFieldsValue } = {} } = this.props;

    setFieldsValue({ [PORTION_ID]: value });
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  render() {
    const {
      form: { getFieldDecorator, isFieldTouched, getFieldError },
    } = this.props;

    const { formatMessage } = this;

    let fieldsError = {};
    FIELDS.forEach((value) => {
      const error = isFieldTouched(value) && getFieldError(value);
      fieldsError = { ...fieldsError, [value]: error };
    });

    return (
      <Form className="fw700 wp100 pb30 Form">
        {/* food item name */}
        <FormItem
          label={formatMessage(messages.food_item_name)}
          className="flex-grow-1 mt-4"
        >
          {getFieldDecorator(NAME, {
            rules: [
              {
                required: true,
                message: formatMessage(messages.name_required_error),
              },
            ],
          })(<Input type="string" max="500" />)}
        </FormItem>

        <div className="flex align-center justify-space-between wp100">
          <div className="flex  wp40 ">
            {/* portion size */}
            <FormItem
              label={formatMessage(messages.portion_size)}
              className="mt-4 flex-grow-1"
            >
              {getFieldDecorator(PORTION_SIZE, {
                rules: [
                  {
                    required: true,
                    message: formatMessage(
                      messages.portion_size_required_error
                    ),
                  },
                ],
              })(<Input type="number" min="1" />)}
            </FormItem>
          </div>
          <div className="flex  wp40 ">
            {/* portion type */}
            <FormItem
              label={formatMessage(messages.portion_type)}
              className="mt-4 flex-grow-1"
            >
              {getFieldDecorator(PORTION_ID, {
                rules: [
                  {
                    required: true,
                    message: formatMessage(messages.portion_id_required_error),
                  },
                ],
              })(
                <Select
                  className="drawer-select"
                  onSelect={this.handlePortionSelect}
                >
                  {this.getPortionOptions()}
                </Select>
              )}
            </FormItem>
          </div>
        </div>

        <div className="wp100 flex algin-center justify-space-between">
          {/* proteins */}
          <FormItem
            label={formatMessage(messages.proteins)}
            className="mt-4 wp30 "
          >
            {getFieldDecorator(
              PROTEINS,
              {}
            )(<Input type="number" suffix={"gm"} />)}
          </FormItem>

          {/* carbs */}
          <FormItem label={formatMessage(messages.carbs)} className="mt-4 wp30">
            {getFieldDecorator(
              CARBS,
              {}
            )(<Input type="number" suffix={"gm"} />)}
          </FormItem>

          {/* fats */}
          <FormItem label={formatMessage(messages.fats)} className="mt-4 wp30">
            {getFieldDecorator(FATS, {})(<Input type="number" suffix={"gm"} />)}
          </FormItem>
        </div>

        {/* fibers */}
        <FormItem
          label={formatMessage(messages.fibers)}
          className="flex-grow-1 mt-4"
        >
          {getFieldDecorator(FIBERS, {})(<Input type="number" suffix={"gm"} />)}
        </FormItem>

        {/* calories */}
        <FormItem
          label={formatMessage(messages.calories)}
          className="flex-grow-1 mt-4 "
        >
          {getFieldDecorator(
            CALORIFIC_VALUE,
            {}
          )(<Input type="number" className="mb20" />)}
        </FormItem>
      </Form>
    );
  }
}

export default injectIntl(AddFoodItemForm);
