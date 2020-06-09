import React, { Component } from "react";
import {Drawer, Form, message} from "antd";
import { injectIntl } from "react-intl";

import { getRelatedMembersURL } from "../../../../Helper/urls/user";
import { doRequest } from "../../../../Helper/network";
import { USER_CATEGORY } from "../../../../constant";
import AddMedicationReminderForm from "./form";

import participants from "../common/participants";

import messages from "../message";
import Footer from "../../footer";
import startTimeField from "../common/startTime";
import startDateField from "../common/startDate";
import endDateField from "../common/endDate";
import repeatDaysField from "../common/selectedDays";

class AddMedicationReminder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabledOk: true,
      members: []
    };
    this.FormWrapper = Form.create({})(AddMedicationReminderForm);
  }

  componentDidMount() {
    const { currentUser: { basicInfo: { category } = {} } = {} } = this.props;
    window.scrollTo(0, 0);
    if (category === USER_CATEGORY.CARE_COACH) {
      doRequest({
        url: getRelatedMembersURL()
      })
        .then(res => {
          const { members = [] } = res.payload.data;
          const patients = members.filter(member => {
            const { basicInfo: { category } = {} } = member;
            return category === USER_CATEGORY.PATIENT;
          });
          this.setState({ members: patients });
        })
        .catch(err => {});
    }
  }

  handleCancel = e => {
    if (e) {
      e.preventDefault();
    }
    const { close } = this.props;
    close();
  };

  formatMessage = data => this.props.intl.formatMessage(data);

  setFormRef = formRef => {
    this.formRef = formRef;
    if (formRef) {
      this.setState({ formRef: true });
    }
  };

  getOtherUser = () => {
    const { formRef } = this;
    let otherUser;
    if (formRef) {
      const {
        props: {
          form: { getFieldValue }
        }
      } = formRef;
      const { members = [] } = this.state;
      const otherUserId = getFieldValue(participants.field_name);
      const n = members.length;
      for (let i = 0; i < n; i++) {
        const member = members[i] || {};
        const {
          basicInfo: { _id }
        } = member;
        if (otherUserId === _id) {
          otherUser = member;
          break;
        }
      }
    }
    return otherUser;
  };

  onClose = () => {
    const { close } = this.props;
    close();
  };

  handleSubmit = async () => {
    const {
      // form: { validateFields },
      addMedicationReminder,
      payload: {patient_id = "2"} = {}
    } = this.props;

    const { formRef = {}, formatMessage } = this;
    const {
      props: {
        form: { validateFields }
      }
    } = formRef;

    validateFields(async (err, values) => {
      if (!err) {
        let data_to_submit = {};
        const startTime = values[startTimeField.field_name];
        const startDate = values[startDateField.field_name];
        const endDate = values[endDateField.field_name];
        const repeatDays = values[repeatDaysField.field_name];
        data_to_submit = {
          ...values,
          id: patient_id,

          repeat: "weekly",

          [startTimeField.field_name]:
              startTime && startTime !== null
                  ? startTime.startOf("minute").toISOString()
                  : startTime,
          [startDateField.field_name]:
              startDate && startDate !== null
                  ? startDate
                      .clone()
                      .startOf("day")
                      .toISOString()
                  : startDate,
          [endDateField.field_name]:
              endDate && endDate !== null
                  ? endDate
                      .clone()
                      .endOf("day")
                      .toISOString()
                  : endDate
        };

        if (repeatDays) {
          data_to_submit = {
            ...data_to_submit,
            [repeatDaysField.field_name]: repeatDays.split(",")
          };

        }
        try {
          const response = await addMedicationReminder(data_to_submit);
          const {status, payload: {message: msg} = {}} = response;
          if(status === true) {
            message.success(msg);
          } else {
            message.error(msg);
          }
        } catch (error) {
          console.log("add medication reminder ui error -----> ", error);
        }
      }
    });
  };

  render() {
    const {
      visible,
      loading = false,
      intl: { formatMessage }
    } = this.props;
    const { onClose, setFormRef, FormWrapper, handleSubmit } = this;
    const { disabledSubmit } = this.state;
    const submitButtonProps = {
      disabled: disabledSubmit,
      loading: loading
    };
    const { members } = this.state;

    console.log("12313 visible --> ", visible);

    return (
      <Drawer
        width={'35%'}
        onClose={onClose}
        visible={visible}
        destroyOnClose={true}
        className="ant-drawer"
        title={formatMessage(messages.title)}
      >
        <FormWrapper
          wrappedComponentRef={setFormRef}
          {...this.props}
          members={members}
        />
        <Footer
            onSubmit={handleSubmit}
            onClose={onClose}
            submitText={formatMessage(messages.add_button_text)}
            submitButtonProps={{}}
            cancelComponent={null}
        />
      </Drawer>
    );
  }
}

export default injectIntl(AddMedicationReminder);
