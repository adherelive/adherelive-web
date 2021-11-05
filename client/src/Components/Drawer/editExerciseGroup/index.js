import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { hasErrors } from "../../../Helper/validation";

import Drawer from "antd/es/drawer";
import Form from "antd/es/form";

import messages from "./messages";
import EditExerciseGroupForm from "./form";
import Footer from "../footer";
import AddExerciseDrawer from "../../../Containers/Drawer/addExercise";
import message from "antd/es/message";
import { VIDEO_TYPES } from "../../../constant";

class EditExerciseGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exercise_detail_id: null,
      visibleAddExerciseDrawer: false,
      editable: false,
      exercise_name: "",
      uploadedVideoUrl: "",
      videoContentType: null,
    };

    this.FormWrapper = Form.create({ onFieldsChange: this.onFormFieldChanges })(
      EditExerciseGroupForm
    );
  }

  setUploadedVideoUrl = (url) => {
    this.setState({ uploadedVideoUrl: url });
  };

  setVideoContentType = (type) => {
    this.setState({ videoContentType: type });
  };

  setEditable = (val) => {
    this.setState({ editable: val });
  };

  setExerciseName = (name) => {
    this.setState({ exercise_name: name });
  };

  setExerciseDetailId = (id) => {
    this.setState({ exercise_detail_id: id });
  };

  openAddExerciseDrawer = () => {
    this.setState({ visibleAddExerciseDrawer: true });
  };

  closeAddExerciseDrawer = () => {
    this.setState({ visibleAddExerciseDrawer: false });
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
      storeExerciseAndDetails,
      searched_exercises = {},
      searched_exercise_details = {},
      editExerciseGroupDetails,
      updateExercise,
      exercise_details = {},
    } = this.props;
    const { formRef = {} } = this;

    const {
      exercise_detail_id = null,
      editable = false,
      exercise_name = "",
    } = this.state;
    const {
      uploadedVideoUrl = "",
      videoContentType: video_content_type = null,
    } = this.state;

    const {
      detail_id: prev_detail_id = null,
      exercise_group_index = null,
      similar_index = null,
      exercise_group_id = null,
      sets: prev_sets = 1,
    } = editExerciseGroupDetails || {};

    const {
      props: {
        form: { validateFields },
      },
    } = formRef;

    validateFields(async (err, values) => {
      if (!err) {
        let {
          name,
          repetition_id = null,
          repetition_value = null,
          calorific_value = null,
          sets = null,
          video_content = "",
          notes = "",
        } = values;

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

        const exercise_id = parseInt(name);

        const exercise_detail = searched_exercise_details[exercise_detail_id];
        const exercise = searched_exercises[exercise_id] || {};
        let prev_calorific_val = 0;
        const { calorific_value: prev_calVal = 0 } =
          exercise_details[prev_detail_id] || {};
        prev_calorific_val = prev_calVal;

        let editedExerciseGroupData = {
          repetition_id: repetition_id ? parseInt(repetition_id) : null,
          sets: sets ? parseInt(sets) : 1,
          exercise_detail_id: exercise_detail_id
            ? parseInt(exercise_detail_id)
            : null,
          notes,
          prev_calorific_val,
          prev_sets,
          ...(exercise_group_id && { exercise_group_id: exercise_group_id }),
        };

        const updateData = {
          name: exercise_name,
          repetition_id: repetition_id ? parseInt(repetition_id) : null,
          exercise_detail_id,
          repetition_value: repetition_value
            ? parseInt(repetition_value)
            : null,
          calorific_value: calorific_value ? parseInt(calorific_value) : null,
          video,
        };

        try {
          let toStoreExercise = {},
            toStoreDetail = {};
          toStoreExercise[exercise_id] = exercise;
          toStoreDetail[exercise_detail_id] = exercise_detail || {};

          // if(editable){
          const responseOnUpdate = await updateExercise({
            exercise_id,
            data: updateData,
          });
          const {
            status,
            statusCode,
            payload: { data: resp_data = {}, message: resp_msg = "" } = {},
          } = responseOnUpdate;
          if (status) {
            const { exercise_details = {}, exercise_detail_id = null } =
              resp_data || {};

            if (exercise_detail_id) {
              editedExerciseGroupData[`exercise_detail_id`] =
                parseInt(exercise_detail_id);
              onSubmit({ editedExerciseGroupData, exercise_group_index });
              this.onClose();
            } else {
              message.warn(this.formatMessage(messages.somethingWentWrong));
            }
          } else {
            message.warn(resp_msg);
          }

          // } else {
          //   onSubmit({editedExerciseGroupData,exercise_group_index,similar_index});

          //   storeExerciseAndDetails({
          //     exercises:{...toStoreExercise},
          //     exercise_details:{...toStoreDetail}
          //   });

          //   this.onClose();

          // }
        } catch (error) {
          this.setState({ submitting: false });
        }
      }
    });
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  onClose = () => {
    const { closeExerciseGroupDrawer } = this.props;
    const { formRef } = this;
    const {
      props: {
        form: { resetFields },
      },
    } = formRef;

    this.setState({
      exercise_detail_id: null,
      visibleAddExerciseDrawer: false,
      editable: false,
      exercise_name: "",
    });

    resetFields();
    closeExerciseGroupDrawer();
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
      visibleAddExerciseDrawer = false,
      exercise_detail_id = null,
      editable = false,
      exercise_name = "",
    } = this.state;

    const {
      onClose,
      formatMessage,
      setFormRef,
      handleSubmit,
      FormWrapper,
      setExerciseDetailId,
      openAddExerciseDrawer,
      closeAddExerciseDrawer,
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
          title={formatMessage(messages.add_exercise_group)}
        >
          <FormWrapper
            wrappedComponentRef={setFormRef}
            {...this.props}
            setExerciseDetailId={setExerciseDetailId}
            openAddExerciseDrawer={openAddExerciseDrawer}
            exercise_detail_id={exercise_detail_id}
            setEditable={this.setEditable}
            editable={editable}
            setExerciseName={this.setExerciseName}
            setUploadedVideoUrl={this.setUploadedVideoUrl}
            setVideoContentType={this.setVideoContentType}
            visibleAddExerciseDrawer={visibleAddExerciseDrawer}
          />

          <Footer
            onSubmit={handleSubmit}
            onClose={onClose}
            submitText={formatMessage(messages.submit_text)}
            submitButtonProps={submitButtonProps}
            cancelComponent={null}
            submitting={submitting}
          />

          <AddExerciseDrawer
            visible={visibleAddExerciseDrawer}
            closeAddExerciseDrawer={closeAddExerciseDrawer}
            exercise_name={exercise_name}
          />
        </Drawer>
      </Fragment>
    );
  }
}

export default injectIntl(EditExerciseGroup);
