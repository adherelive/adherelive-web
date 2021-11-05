import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { hasErrors } from "../../../Helper/validation";
import Drawer from "antd/es/drawer";
import Form from "antd/es/form";
import message from "antd/es/message";
import messages from "./messages";
import AddExerciseForm from "./form";
import Footer from "../footer";
import { VIDEO_TYPES } from "../../../constant";

class AddExercise extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      disabledSubmit: true,
      submitting: false,
      uploadedVideoUrl: "",
      videoContentType: null,
    };

    this.FormWrapper = Form.create({ onFieldsChange: this.onFormFieldChanges })(
      AddExerciseForm
    );
  }

  setUploadedVideoUrl = (url) => {
    this.setState({ uploadedVideoUrl: url });
  };

  setVideoContentType = (type) => {
    this.setState({ videoContentType: type });
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
    const { addExercise } = this.props;
    const { formRef = {}, formatMessage } = this;
    const {
      uploadedVideoUrl = "",
      videoContentType: video_content_type = null,
    } = this.state;

    const {
      props: {
        form: { validateFields, resetFields },
      },
    } = formRef;

    validateFields(async (err, values) => {
      if (!err) {
        let {
          name: initail_name,
          repetition_id = null,
          repetition_value = 1,
          calorific_value = null,
          video_content = "",
        } = values;

        const name = initail_name.trim();
        let video = {};

        if (video_content.length) {
          if (video_content_type === VIDEO_TYPES.UPLOAD) {
            video_content = uploadedVideoUrl;
          }
          video = {
            content_type: video_content_type,
            content: video_content,
          };
        }

        const data = {
          name,
          repetition_id: repetition_id ? parseInt(repetition_id) : null,
          repetition_value: repetition_value
            ? parseInt(repetition_value)
            : null,
          calorific_value: calorific_value ? parseFloat(calorific_value) : null,
          video,
        };

        try {
          this.setState({ submitting: true });
          const response = await addExercise(data);
          const {
            status,
            statusCode: code,
            payload: {
              message: errorMessage = "",
              error: { error_type = "" } = {},
            },
          } = response || {};

          if (!status) {
            message.error(errorMessage);
          } else {
            message.success(errorMessage);
          }
          this.setState({ submitting: false });

          if (status) {
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
    const { closeAddExerciseDrawer } = this.props;

    const { formRef } = this;
    const {
      props: {
        form: { resetFields },
      },
    } = formRef;
    this.setState({
      visible: true,
      disabledSubmit: true,
      submitting: false,
    });
    resetFields();
    closeAddExerciseDrawer();
  };

  setFormRef = (formRef) => {
    this.formRef = formRef;
    if (formRef) {
      this.setState({ formRef: true });
    }
  };

  render() {
    const { visible } = this.props;
    const { disabledSubmit, submitting = false } = this.state;

    const { onClose, formatMessage, setFormRef, handleSubmit, FormWrapper } =
      this;

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
          title={formatMessage(messages.add_exercise)}
        >
          <FormWrapper
            wrappedComponentRef={setFormRef}
            setUploadedVideoUrl={this.setUploadedVideoUrl}
            setVideoContentType={this.setVideoContentType}
            {...this.props}
          />

          <Footer
            onSubmit={handleSubmit}
            onClose={onClose}
            submitText={formatMessage(messages.submit_text)}
            submitButtonProps={submitButtonProps}
            cancelComponent={null}
            submitting={submitting}
          />
        </Drawer>
      </Fragment>
    );
  }
}

export default injectIntl(AddExercise);
