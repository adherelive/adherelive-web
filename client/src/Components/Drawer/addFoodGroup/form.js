import React, { Component } from "react";
import { injectIntl } from "react-intl";

import Form from "antd/es/form";
import Select from "antd/es/select";
import Input from "antd/es/input";
import messages from "./messages";
import message from "antd/es/message";
import TextArea from "antd/es/input/TextArea";
import Button from "antd/es/button";
import debounce from "lodash-es/debounce";

const { Item: FormItem } = Form;
const { Option } = Select;

const NAME = "name"; // -----> storing food item id
const PORTION_SIZE = "portion_size";
const PORTION_ID = "portion_id";
const FATS = "fats";
const CARBS = "carbs";
const PROTEINS = "proteins";
const FIBERS = "fibers";
const CALORIFIC_VALUE = "calorific_value";
const SERVING = "serving";
const NOTES = "notes";

const FIELDS = [
  NAME,
  PORTION_SIZE,
  PORTION_ID,
  FATS,
  CARBS,
  PROTEINS,
  FIBERS,
  CALORIFIC_VALUE,
  SERVING,
  NOTES,
];

class AddFoodGroupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      food_item_id: null,
      searchingFood: "",
      doctor_id: null,
    };

    this.handleFoodSearch = debounce(this.handleFoodSearch.bind(this), 200);
  }

  componentDidMount() {
    const { doctors = {}, authenticated_user } = this.props;
    this.handleFoodSearch("");

    for (let each in doctors) {
      const { basic_info: { user_id = null } = {} } = doctors[each];
      if (user_id.toString() === authenticated_user.toString()) {
        this.setState({ doctor_id: each });
        break;
      }
    }
  }

  async componentDidUpdate(prevProps) {
    const {
      form: { getFieldValue, setFieldsValue } = {},
      food_item_detail_id = null,
      clearLatestCreatedFoodItem,
      visibleAddFoodDrawer,
      searched_food_item_details = {},
      searched_food_items = {},
      setFoodItemName,
    } = this.props;

    const { food_item_detail_id: prev_food_item_detail_id = null } = prevProps;
    const { visibleAddFoodDrawer: prev_visibleAddFoodDrawer = false } =
      prevProps;

    const { basic_info: { food_item_id: previous_item_id = null } = {} } =
      searched_food_item_details[food_item_detail_id] || {};
    const { basic_info: { name = "" } = {} } =
      searched_food_items[previous_item_id] || {};
    // if ( food_item_detail_id !== prev_food_item_detail_id){
    //   setFieldsValue({ [SERVING] : 1 });
    // } // to set serving  back to 1 on any food changes

    const { latest_created_food: { created = false } = {} } = this.props;

    if (
      !visibleAddFoodDrawer &&
      prev_visibleAddFoodDrawer !== visibleAddFoodDrawer
    ) {
      if (created) {
        // fill new created food's details
        await this.fillAllNewCreatedFoodDetails();
        await clearLatestCreatedFoodItem();
      } else {
        setFieldsValue({ [NAME]: previous_item_id }); // opening new food drawer removes name field's val and food name
        setFoodItemName(name);
      }
    }
  }

  fillAllNewCreatedFoodDetails = () => {
    const {
      latest_created_food: { food_items = {}, food_item_details = {} } = {},
    } = this.props;
    const { setFoodItemName, setEditable, setFoodItemDetailId } = this.props;
    let food_item_id = null,
      detail_id = null;

    const { form: { setFieldsValue } = {} } = this.props;

    if (Object.keys(food_items).length) {
      food_item_id = Object.keys(food_items)[0];
    }

    if (Object.keys(food_item_details).length) {
      detail_id = Object.keys(food_item_details)[0];
    }

    setFoodItemDetailId(detail_id);

    const {
      basic_info: {
        calorific_value = null,
        carbs = null,
        proteins = null,
        fats = null,
        fibers = null,
        portion_size = 1,
        portion_id = null,
      } = {},
    } = food_item_details[detail_id] || {};

    const { basic_info: { name = "" } = {} } = food_items[food_item_id] || {};

    setFoodItemName(name);
    const intFoodItemId = parseInt(food_item_id);
    this.setState({ food_item_id: intFoodItemId });
    const canEdit = true;
    setEditable(canEdit);

    // setFieldsValue({ [SERVING]:1 });

    setFieldsValue({ [NAME]: intFoodItemId });
    setFieldsValue({ [CALORIFIC_VALUE]: calorific_value });
    setFieldsValue({ [CARBS]: carbs });
    setFieldsValue({ [PROTEINS]: proteins });
    setFieldsValue({ [FATS]: fats });
    setFieldsValue({ [FIBERS]: fibers });
    setFieldsValue({ [PORTION_SIZE]: portion_size });
    setFieldsValue({ [PORTION_ID]: portion_id });
  };

  getPortionOptions = () => {
    const { food_item_id: state_food_item_id = null, doctor_id = null } =
      this.state;
    const {
      searched_food_item_details,
      portions = {},
      authenticated_category,
    } = this.props;
    let options = [],
      portion_ids = [],
      canEdit = true;

    for (let each in searched_food_item_details) {
      const detail = searched_food_item_details[each] || {};
      const {
        basic_info: {
          id: detail_id,
          food_item_id,
          portion_id,
          creator_id = null,
          creator_type = null,
        } = {},
      } = detail;

      if (
        creator_type === authenticated_category &&
        creator_id &&
        doctor_id &&
        creator_id.toString() === doctor_id.toString()
      ) {
        canEdit = true;
      } else {
        canEdit = false;
      }

      if (state_food_item_id == food_item_id) {
        // matching portions

        portion_ids.push(portion_id);

        const { basic_info: { name = "" } = {} } = portions[portion_id] || {};
        options.push(
          <Option
            key={`${each}-${name}`}
            value={portion_id}
            onClick={this.handleExistingPortionSelect({
              detail_id,
              editable: canEdit,
            })}
          >
            {name}
          </Option>
        );
      }
    }

    for (let each in portions) {
      const { basic_info: { id = null, name } = {} } = portions[each] || {};

      if (!portion_ids.includes(id)) {
        canEdit = true;

        options.push(
          <Option
            key={`${each}-${name}`}
            value={id}
            onClick={this.handleDifferentPortionSelect({ editable: canEdit })}
          >
            {name}
          </Option>
        );
      }
    }

    return options;
  };

  handleExistingPortionSelect =
    ({ detail_id: value, editable }) =>
    () => {
      const {
        form: { setFieldsValue } = {},
        searched_food_item_details,
        setFoodItemDetailId,
        setEditable,
      } = this.props;

      const {
        basic_info: {
          id: detail_id,
          calorific_value,
          carbs,
          proteins,
          fats,
          fibers,
          portion_id,
          portion_size = 1,
        } = {},
      } = searched_food_item_details[value] || {};

      setFieldsValue({ [PORTION_ID]: portion_id });
      setFieldsValue({ [CALORIFIC_VALUE]: calorific_value });
      setFieldsValue({ [CARBS]: carbs });
      setFieldsValue({ [PROTEINS]: proteins });
      setFieldsValue({ [FATS]: fats });
      setFieldsValue({ [FIBERS]: fibers });
      setFieldsValue({ [PORTION_SIZE]: portion_size });
      setFoodItemDetailId(detail_id);
      setEditable(editable);
    };

  handleDifferentPortionSelect =
    ({ editable }) =>
    () => {
      // non-existing details for item

      const {
        form: { setFieldsValue } = {},
        setFoodItemDetailId,
        setEditable,
      } = this.props;

      setFieldsValue({ [PORTION_ID]: null });
      setFieldsValue({ [PORTION_SIZE]: 1 });
      setFieldsValue({ [CALORIFIC_VALUE]: null });
      setFieldsValue({ [CARBS]: null });
      setFieldsValue({ [PROTEINS]: null });
      setFieldsValue({ [FATS]: null });
      setFieldsValue({ [FIBERS]: null });

      setFoodItemDetailId(null);
      setEditable(editable);
    };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  handleOpenAddDrawer = async (e) => {
    const { openAddFoodItemDrawer } = this.props;
    const { form: { setFieldsValue } = {} } = this.props;
    e.preventDefault();
    e.stopPropagation();
    setFieldsValue({ [NAME]: "" });
    this.setState({ searchingFood: "" });
    openAddFoodItemDrawer();
  };

  getFoodOptions = () => {
    let options = [];
    const { searched_food_items: searched_foods = {} } = this.props;
    const { searchingFood = "" } = this.state;

    for (let each in searched_foods) {
      const food = searched_foods[each] || {};
      const { basic_info: { name: food_name, id: food_item_id } = {} } =
        food || {};

      options.push(
        <Option key={`${each}-${food_name}`} value={food_item_id}>
          {food_name}
        </Option>
      );
    }

    {
      searchingFood.length &&
        options.length === 0 &&
        options.push(
          <div
            key={"new-food-div"}
            className="flex align-center justify-center"
            className="add-new-medicine-button-div"
          >
            <Button
              type={"ghost"}
              size="small"
              key={"no-match-food"}
              className="add-new-medicine-button"
              onClick={this.handleOpenAddDrawer}
            >
              {this.formatMessage(messages.add_new_food_details)}
              <span className="fw800 ml10">{`"${searchingFood}"`}</span>
            </Button>
          </div>
        );
    }

    return options;
  };

  handleFoodSearch = async (value) => {
    try {
      const { searchFood, setFoodItemName } = this.props;
      const response = await searchFood(value);
      const { status, payload: { message: resp_msg = "" } = {} } =
        response || {};

      if (!status) {
        message.error(resp_msg);
      }

      if (value.length) {
        setFoodItemName(value); // being used for food item add prefill and name for display food grp
      }

      this.setState({ searchingFood: value });
    } catch (error) {
      console.log("error ==>", { error });
    }
  };

  setFoodItemId = (value) => {
    const {
      searched_food_items = {},
      setFoodItemName,
      searched_food_item_details = {},
      setFoodItemDetailId,
      setEditable,
      form: { setFieldsValue } = {},
      authenticated_category,
    } = this.props;

    const { doctor_id = null, food_item_id: prev_food_item_id = null } =
      this.state;

    let first = null;
    const { basic_info: { name = "" } = {} } = searched_food_items[value] || {};

    setFoodItemName(name);
    this.setState({ food_item_id: value });

    // --- select first portion for the food item selected and if is editable
    if (
      prev_food_item_id !== value &&
      Object.keys(searched_food_item_details).length
    ) {
      let editable = false;

      for (let each in searched_food_item_details) {
        const {
          basic_info: {
            food_item_id,
            creator_id = null,
            creator_type = null,
          } = {},
        } = searched_food_item_details[each] || {};
        if (value.toString() === food_item_id.toString()) {
          if (
            creator_type === authenticated_category &&
            creator_id &&
            doctor_id &&
            creator_id.toString() === doctor_id.toString()
          ) {
            editable = true;
          }

          first = each;
          break;
        }
      }

      const {
        basic_info: {
          id: detail_id,
          calorific_value,
          carbs,
          proteins,
          fats,
          fibers,
          portion_id,
          portion_size = 1,
        } = {},
      } = searched_food_item_details[first] || {};

      setFieldsValue({ [PORTION_ID]: portion_id });
      setFieldsValue({ [PORTION_SIZE]: portion_size });
      setFieldsValue({ [CALORIFIC_VALUE]: calorific_value });
      setFieldsValue({ [CARBS]: carbs });
      setFieldsValue({ [PROTEINS]: proteins });
      setFieldsValue({ [FATS]: fats });
      setFieldsValue({ [FIBERS]: fibers });

      setFoodItemDetailId(detail_id);
      setEditable(editable);
    }
  };

  getServingOptions = () => {
    let options = [];
    for (let i = 1; i <= 20; i++) {
      options.push(
        <Option key={`serving-${i}`} value={i}>
          {i}
        </Option>
      );
    }

    return options;
  };

  onBlur = (props) => {
    const value = parseInt(props);
    const isNotANumber = isNaN(value);

    const { form: { setFieldsValue, getFieldValue } = {} } = this.props;
    if (isNotANumber) {
      setFieldsValue({ [NAME]: null });
    }
  };

  render() {
    const {
      form: { getFieldDecorator, isFieldTouched, getFieldError },
      editable = false,
    } = this.props;
    const {
      formatMessage,
      setFoodItemId,
      handleFoodSearch,
      getFoodOptions,
      onBlur,
    } = this;

    const { food_item_id = null } = this.state;

    let fieldsError = {};
    FIELDS.forEach((value) => {
      const error = isFieldTouched(value) && getFieldError(value);
      fieldsError = { ...fieldsError, [value]: error };
    });

    return (
      <Form className="fw700 wp100 pb30 Form">
        {/* food item */}
        <FormItem
          label={formatMessage(messages.food_item)}
          className="flex-grow-1 mt-4"
        >
          {getFieldDecorator(NAME, {
            rules: [
              {
                required: true,
                message: formatMessage(messages.food_required_error),
              },
            ],
          })(
            <Select
              placeholder={this.formatMessage(messages.search_food)}
              onSearch={handleFoodSearch}
              showSearch
              onBlur={onBlur}
              notFoundContent={null}
              onSelect={setFoodItemId}
              optionFilterProp="children"
              filterOption={(input, option) => {
                const children = option.props.children;

                if (typeof children === "string") {
                  return (
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  );
                } else {
                  return option;
                }
              }}
            >
              {getFoodOptions()}
            </Select>
          )}
        </FormItem>

        <div className="flex align-center justify-space-between wp100">
          <div className="flex wp20">
            {/* serving */}

            <FormItem
              label={formatMessage(messages.serving)}
              className="flex-grow-1 mt-4 multiply"
            >
              {getFieldDecorator(SERVING, {
                initialValue: 1,
                rules: [
                  {
                    required: true,
                    message: formatMessage(messages.food_required_error),
                  },
                ],
              })(<Input type="number" min="1" />)}
            </FormItem>
          </div>

          <div className="flex wp60 align-center justify-space-between">
            <div className="wp50 flex direction-column align-center justify-center">
              {/* portion size */}

              <FormItem
                label={formatMessage(messages.portion_size)}
                className="flex-grow-1 mt-4 wp90"
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
                })(<Input type="number" min="1" disabled={!editable} />)}
              </FormItem>
            </div>

            <div className="wp50 flex direction-column align-center justify-center">
              {/* portion type */}

              <FormItem
                label={formatMessage(messages.portion_type)}
                className="flex-grow-1 mt-4 wp90"
              >
                {getFieldDecorator(PORTION_ID, {
                  rules: [
                    {
                      required: true,
                      message: formatMessage(
                        messages.portion_id_required_error
                      ),
                    },
                  ],
                })(
                  <Select
                    className="drawer-select"
                    disabled={!food_item_id}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.getPortionOptions()}
                  </Select>
                )}
              </FormItem>
            </div>
          </div>
        </div>

        <div className="wp100 flex algin-center justify-space-between">
          {/* proteins */}
          <FormItem
            label={formatMessage(messages.proteins)}
            className=" mt-4 wp30"
          >
            {getFieldDecorator(
              PROTEINS,
              {}
            )(<Input type="number" suffix={"gm"} disabled={!editable} />)}
          </FormItem>

          {/* carbs */}

          <FormItem
            label={formatMessage(messages.carbs)}
            className=" mt-4 wp30"
          >
            {getFieldDecorator(
              CARBS,
              {}
            )(<Input type="number" suffix={"gm"} disabled={!editable} />)}
          </FormItem>

          {/* fats */}

          <FormItem label={formatMessage(messages.fats)} className=" mt-4 wp30">
            {getFieldDecorator(
              FATS,
              {}
            )(<Input type="number" suffix={"gm"} disabled={!editable} />)}
          </FormItem>
        </div>

        {/* fibers */}

        <FormItem
          label={formatMessage(messages.fibers)}
          className="flex-grow-1 mt-4"
        >
          {getFieldDecorator(
            FIBERS,
            {}
          )(<Input type="number" suffix={"gm"} disabled={!editable} />)}
        </FormItem>

        {/* calories */}

        <FormItem
          label={formatMessage(messages.calories)}
          className="flex-grow-1 mt-4 "
        >
          {getFieldDecorator(
            CALORIFIC_VALUE,
            {}
          )(<Input type="number" className="mb20" disabled={!editable} />)}
        </FormItem>

        {/* note */}

        <FormItem
          label={formatMessage(messages.note)}
          className="flex-grow-1 mt-4 "
        >
          {getFieldDecorator(NOTES, {})(<TextArea className="mb20" />)}
        </FormItem>
      </Form>
    );
  }
}

export default injectIntl(AddFoodGroupForm);
