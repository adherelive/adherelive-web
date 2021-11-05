import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { hasErrors } from "../../../Helper/validation";

import Drawer from "antd/es/drawer";
import Form from "antd/es/form";

import messages from "./messages";
import EditFoodGroupForm from "./form";
import Footer from "../footer";
import AddFoodItemDrawer from "../../../Containers/Drawer/addFoodItem";
import message from "antd/es/message";

class EditFoodGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      food_item_detail_id: null,
      visibleAddFoodDrawer: false,
      editable: false,
      food_item_name: "",
    };

    this.FormWrapper = Form.create({ onFieldsChange: this.onFormFieldChanges })(
      EditFoodGroupForm
    );
  }

  setEditable = (val) => {
    this.setState({ editable: val });
  };

  setFoodItemName = (name) => {
    this.setState({ food_item_name: name });
  };

  setFoodItemDetailId = (id) => {
    this.setState({ food_item_detail_id: id });
  };

  openAddFoodItemDrawer = () => {
    this.setState({ visibleAddFoodDrawer: true });
  };

  closeAddFoodItemDrawer = () => {
    this.setState({ visibleAddFoodDrawer: false });
  };

  onFormFieldChanges = (props) => {
    const {
      form: { getFieldsError, isFieldsTouched },
    } = props;
    const isError = hasErrors(getFieldsError());
    const { disabledSubmit } = this.state;
    if (disabledSubmit !== isError && isFieldsTouched()) {
      this.setState({ disabledSubmit: isError });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      onSubmit,
      storeFoodItemAndDetails,
      searched_food_items = {},
      searched_food_item_details = {},
      editFoodGroupDetails,
      updateFoodItem,
      food_item_details = {},
    } = this.props;
    const { formRef = {} } = this;

    const {
      food_item_detail_id = null,
      editable = false,
      food_item_name = "",
    } = this.state;

    const {
      detail_id: prev_detail_id = null,
      food_group_index = null,
      similar_index = null,
      food_group_id = null,
      serving: prev_serving = 1,
    } = editFoodGroupDetails || {};

    const {
      props: {
        form: { validateFields },
      },
    } = formRef;

    validateFields(async (err, values) => {
      if (!err) {
        let {
          name,
          proteins = null,
          carbs = null,
          fats = null,
          fibers = null,
          portion_size = 1,
          portion_id = null,
          calorific_value = null,
          serving = null,
          notes = "",
        } = values;

        const food_item_id = parseInt(name);

        const food_item_detail =
          searched_food_item_details[food_item_detail_id];
        const food_item = searched_food_items[food_item_id] || {};
        let prev_calorific_val = 0;
        const { basic_info: { calorific_value: prev_calVal = 0 } = {} } =
          food_item_details[prev_detail_id] || {};

        prev_calorific_val = prev_calVal;

        let editedFoodGroupData = {
          portion_id: portion_id ? parseInt(portion_id) : null,
          serving: serving ? parseFloat(serving) : 1,
          food_item_detail_id: food_item_detail_id
            ? parseInt(food_item_detail_id)
            : null,
          notes,
          prev_calorific_val,
          prev_serving,
          ...(food_group_id && { food_group_id: food_group_id }),
        };

        const updateData = {
          name: food_item_name,
          portion_id: portion_id ? parseInt(portion_id) : null,
          proteins: proteins ? parseFloat(proteins) : null,
          carbs: carbs ? parseFloat(carbs) : null,
          fats: fats ? parseFloat(fats) : null,
          fibers: fibers ? parseFloat(fibers) : null,
          portion_size: portion_size ? parseFloat(portion_size) : null,
          calorific_value: calorific_value ? parseFloat(calorific_value) : null,
        };

        try {
          let toStoreFoodItem = {},
            toStoreDetail = {};
          toStoreFoodItem[food_item_id] = food_item;
          toStoreDetail[food_item_detail_id] = food_item_detail || {};

          if (editable) {
            const responseOnUpdate = await updateFoodItem({
              food_item_id,
              data: updateData,
            });
            const {
              status,
              statusCode,
              payload: { data: resp_data = {}, message: resp_msg = "" } = {},
            } = responseOnUpdate;
            if (status) {
              const { food_item_details = {} } = resp_data || {};

              if (Object.keys(food_item_details).length) {
                const detail_id = Object.keys(food_item_details)[0];
                editedFoodGroupData[`food_item_detail_id`] = detail_id;
                onSubmit({
                  editedFoodGroupData,
                  food_group_index,
                  similar_index,
                });
                this.onClose();
              } else {
                message.warn(this.formatMessage(messages.somethingWentWrong));
              }
            } else {
              message.warn(resp_msg);
            }
          } else {
            onSubmit({ editedFoodGroupData, food_group_index, similar_index });

            storeFoodItemAndDetails({
              food_items: { ...toStoreFoodItem },
              food_item_details: { ...toStoreDetail },
            });

            this.onClose();
          }
        } catch (error) {
          this.setState({ submitting: false });
        }
      }
    });
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  onClose = () => {
    const { closeFoodGroupDrawer } = this.props;
    const { formRef } = this;
    const {
      props: {
        form: { resetFields },
      },
    } = formRef;

    this.setState({
      food_item_detail_id: null,
      visibleAddFoodDrawer: false,
      editable: false,
      food_item_name: "",
    });

    resetFields();
    closeFoodGroupDrawer();
  };

  setFormRef = (formRef) => {
    this.formRef = formRef;
    if (formRef) {
      this.setState({ formRef: true });
    }
  };

  render() {
    const { visible = true } = this.props;
    const {
      disabledSubmit,
      submitting = false,
      visibleAddFoodDrawer = false,
      food_item_detail_id = null,
      editable = false,
      food_item_name = "",
    } = this.state;

    const {
      onClose,
      formatMessage,
      setFormRef,
      handleSubmit,
      FormWrapper,
      setFoodItemDetailId,
      openAddFoodItemDrawer,
      closeAddFoodItemDrawer,
    } = this;

    const submitButtonProps = {
      disabled: disabledSubmit,
    };

    return (
      <Fragment>
        <Drawer
          placement="right"
          maskClosable={false}
          headerStyle={{
            position: "sticky",
            zIndex: "9999",
            top: "0px",
          }}
          destroyOnClose={true}
          onClose={onClose}
          visible={visible}
          width={"35%"}
          title={formatMessage(messages.add_food_group)}
        >
          <FormWrapper
            wrappedComponentRef={setFormRef}
            {...this.props}
            setFoodItemDetailId={setFoodItemDetailId}
            openAddFoodItemDrawer={openAddFoodItemDrawer}
            food_item_detail_id={food_item_detail_id}
            setEditable={this.setEditable}
            editable={editable}
            setFoodItemName={this.setFoodItemName}
            visibleAddFoodDrawer={visibleAddFoodDrawer}
          />

          <Footer
            onSubmit={handleSubmit}
            onClose={onClose}
            submitText={formatMessage(messages.submit_text)}
            submitButtonProps={submitButtonProps}
            cancelComponent={null}
            submitting={submitting}
          />

          <AddFoodItemDrawer
            visible={visibleAddFoodDrawer}
            closeAddFoodItemDrawer={closeAddFoodItemDrawer}
            food_item_name={food_item_name}
          />
        </Drawer>
      </Fragment>
    );
  }
}

export default injectIntl(EditFoodGroup);
