import React, { Component } from "react";
import { Modal, Form } from "antd";
import { injectIntl } from "react-intl";

import { getRelatedMembersURL } from "../../../../../Helper/urls/user";
import { doRequest } from "../../../../../Helper/network";
import { USER_CATEGORY } from "../../../../../constant";
import AddMedicationReminderForm from "./form";

import participants from "../../common/participants";

import messages from "../../message";

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

  render() {
    const { show } = this.props;
    const { handleCancel, FormWrapper, setFormRef, formatMessage } = this;
    const { members } = this.state;

    const modalProps = {
      visible: show,
      title: formatMessage(messages.addMedicationReminder),
      okButtonProps: {},
      onCancel: handleCancel,
      maskClosable: false,
      wrapClassName: "global-modal  events-modal full-height",
      destroyOnClose: true,
      width: "94%",
      footer: null
    };

    return (
      <Modal {...modalProps}>
        <FormWrapper
          wrappedComponentRef={setFormRef}
          {...this.props}
          members={members}
        />
      </Modal>
    );
  }
}

const AddMedicationReminderModal = injectIntl(AddMedicationReminder);

export default props => {
  const { show } = props;
  if (!show) {
    return null;
  } else return <AddMedicationReminderModal {...props} />;
};
