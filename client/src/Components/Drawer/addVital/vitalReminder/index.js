import React, { Component, Fragment } from "react";
import { Drawer, Form, message } from "antd";
import { injectIntl } from "react-intl";

import moment from "moment";
import AddVitalsForm from "./form";
import messages from "../message";
import Footer from "../../footer";
import startDateField from "../common/startDate";
import repeatDaysField from "../common/selectedDays";
import endDateField from "../common/endDate";

import instructions from "../../addMedicationReminder/common/instructions";
import vitalName from "../common/vitalName";
import vitalOccurence from "../common/vitalOccurence";

class AddVitals extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disabledOk: true,
      fieldChanged: false,
      members: [],
      submitting: false,
    };
    this.FormWrapper = Form.create({ onFieldsChange: this.onFormFieldChanges })(
      AddVitalsForm
    );
  }

  componentDidMount() {}

  hasErrors = (fieldsError) => {
    return Object.keys(fieldsError).some((field) => fieldsError[field]);
  };

  onFormFieldChanges = (props, allvalues) => {
    const {
      form: { getFieldsError, isFieldsTouched },
    } = props;
    const isError = this.hasErrors(getFieldsError());
    const { disabledOk } = this.state;
    if (disabledOk !== isError && isFieldsTouched()) {
      this.setState({ disabledOk: isError, fieldChanged: true });
    }
  };

  handleCancel = (e) => {
    if (e) {
      e.preventDefault();
    }
    const { close } = this.props;
    close();
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  setFormRef = (formRef) => {
    this.formRef = formRef;
    if (formRef) {
      this.setState({ formRef: true });
    }
  };

  onClose = () => {
    const { close } = this.props;
    close();
  };

  handleSubmit = async () => {
    const { addVital, carePlanId, close } = this.props;

    const { formRef = {}, formatMessage } = this;
    const {
      props: {
        form: { validateFields },
      },
    } = formRef;

    validateFields(async (err, values) => {
      if (!err) {
        console.log("8326589623895723956832", values);
        let data_to_submit = {};
        const startDate = values[startDateField.field_name];
        const endDate = values[endDateField.field_name];
        const vital_template_id = values[vitalName.field_name];
        const repeat_interval_id = values[vitalOccurence.field_name];
        const repeatDays = values[repeatDaysField.field_name];
        const description = values[instructions.field_name];
        const care_plan_id = carePlanId;
        data_to_submit = {
          care_plan_id,
          vital_template_id,
          repeat_interval_id,
          [startDateField.field_name]:
            startDate && startDate !== null
              ? startDate.clone().format()
              : startDate,
          [endDateField.field_name]:
            endDate && endDate !== null ? endDate.clone().format() : endDate,
        };

        if (repeatDays) {
          data_to_submit = {
            ...data_to_submit,
            [repeatDaysField.field_name]: repeatDays,
          };
        }
        if (description) {
          data_to_submit = {
            ...data_to_submit,
            description,
          };
        }
        if (
          !startDate ||
          !repeat_interval_id ||
          !vital_template_id ||
          !repeatDays
        ) {
          message.error("Please fill all details.");
        }
        if (!care_plan_id) {
          message.error("Care Plan Id not present");
        } else if (endDate && moment(endDate).isBefore(moment(startDate))) {
          message.error("Please select valid dates for vital");
        } else {
          try {
            this.setState({ submitting: true });
            const response = await addVital(data_to_submit);
            const { status, payload: { message: msg } = {} } = response;
            if (status === true) {
              message.success(msg);
              close();
            } else {
              message.error(msg);
            }
            this.setState({ submitting: false });
          } catch (error) {
            console.log("add vital ui error -----> ", error);
            this.setState({ submitting: false });
          }
        }
      } else {
        message.warn("Please fill all the mandatory fields");
      }
    });
  };

  render() {
    const {
      visible,
      loading = false,
      intl: { formatMessage },
    } = this.props;
    const { onClose, setFormRef, FormWrapper, handleSubmit } = this;
    const { disabledSubmit, submitting = false } = this.state;
    // const submitButtonProps = {
    //   disabled: disabledSubmit,
    //   loading: loading
    // };
    const { members } = this.state;

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
          width={"35%"}
          onClose={onClose}
          visible={visible}
          // closeIcon={<img src={backArrow} />}

          destroyOnClose={true}
          className="ant-drawer"
          title={formatMessage(messages.title)}
        >
          <FormWrapper wrappedComponentRef={setFormRef} {...this.props} />
          <Footer
            onSubmit={handleSubmit}
            onClose={onClose}
            submitText={formatMessage(messages.add_button_text)}
            submitButtonProps={{}}
            cancelComponent={null}
            submitting={submitting}
          />
        </Drawer>
      </Fragment>
    );
  }
}

export default injectIntl(AddVitals);
