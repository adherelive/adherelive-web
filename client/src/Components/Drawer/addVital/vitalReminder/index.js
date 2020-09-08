import React, { Component } from "react";
import { Drawer, Form, message } from "antd";
import { injectIntl } from "react-intl";

import moment from "moment";
import { getRelatedMembersURL } from "../../../../Helper/urls/user";
import { doRequest } from "../../../../Helper/network";
import { USER_CATEGORY, MEDICATION_TIMING, MEDICINE_UNITS } from "../../../../constant";
import AddVitalsForm from "./form";
import messages from "../message";
import Footer from "../../footer";
import { getInitialData } from "../../../../Helper/urls/auth";

class AddVitals extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disabledOk: true,
      fieldChanged: false,
      members: []
    };
    this.FormWrapper = Form.create({ onFieldsChange: this.onFormFieldChanges })(AddVitalsForm);
  }

  componentDidMount() {

  }

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  onFormFieldChanges = (props, allvalues) => {
    const {
      form: { getFieldsError, isFieldsTouched }
    } = props;
    const isError = this.hasErrors(getFieldsError());
    const { disabledOk } = this.state;
    if (disabledOk !== isError && isFieldsTouched()) {
      this.setState({ disabledOk: isError, fieldChanged: true });
    }
  };

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


  onClose = () => {
    const { close } = this.props;
    close();
  };

  handleSubmit = async () => {
    const {
      // form: { validateFields },
      carePlanId,
      payload: { patient_id } = {}
    } = this.props;

    const { formRef = {}, formatMessage } = this;
    const {
      props: {
        form: { validateFields }
      }
    } = formRef;
  };

  render() {
    const {
      visible,
      loading = false,
      intl: { formatMessage }
    } = this.props;
    const { onClose, setFormRef, FormWrapper, handleSubmit } = this;
    const { disabledSubmit } = this.state;
    // const submitButtonProps = {
    //   disabled: disabledSubmit,
    //   loading: loading
    // };
    const { members } = this.state;

    
    return (
      <Drawer
        width={'35%'}
        onClose={onClose}
        visible={visible}

        // closeIcon={<img src={backArrow} />}
        headerStyle={{
          position: "sticky",
          zIndex: "9999",
          top: "0px"
        }}
        headerStyle={{
          position: "sticky",
          zIndex: "9999",
          top: "0px"
        }}
        maskClosable={false}
        destroyOnClose={true}
        className="ant-drawer"
        title={formatMessage(messages.title)}
      >
        <FormWrapper
          wrappedComponentRef={setFormRef}
          {...this.props}
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

export default injectIntl(AddVitals);
