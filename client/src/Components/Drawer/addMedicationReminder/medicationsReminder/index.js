import React, { Component } from "react";
import { Drawer, Form } from "antd";
import { injectIntl } from "react-intl";

import { getRelatedMembersURL } from "../../../../Helper/urls/user";
import { doRequest } from "../../../../Helper/network";
import { USER_CATEGORY } from "../../../../constant";
import AddMedicationReminderForm from "./form";

import participants from "../common/participants";

import messages from "../message";

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

  render() {
    const {
      visible,
      loading = false,
      intl: { formatMessage }
    } = this.props;
    const { onClose, setFormRef, FormWrapper, onSubmit } = this;
    const { disabledSubmit } = this.state;
    const submitButtonProps = {
      disabled: disabledSubmit,
      loading: loading
    };
    const { members } = this.state;

    console.log("12313 visible --> ", visible);

    return (
      <Drawer
        width={'40%'}
        onClose={this.onClose}
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
      </Drawer>
    );
  }
}

export default injectIntl(AddMedicationReminder);
