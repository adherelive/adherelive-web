import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Button, Drawer } from "antd";
import messages from "./messages";
import SingleDayExerciseComponent from "../singleDayExerciseComponent/index";
import message from "antd/es/message";
import WorkoutFieldsForm from "./form";
import Form from "antd/es/form";
import Footer from "../footer";
import Loading from "../../Common/Loading";
import confirm from "antd/es/modal/confirm";
import moment from "moment";

class EditWorkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      completeData: [],
      total_calories: 0,
      submitting: false,
      days: [],
      time: "",
      deletedExerciseGroupIds: [],
      canOnlyView: false,
    };

    this.FormWrapper = Form.create({ onFieldsChange: this.onFormFieldChanges })(
      WorkoutFieldsForm
    );
  }

  async componentDidMount() {
    const { workoutData = {}, editTemplateWorkout = null } = this.props;

    await this.getAllWorkoutDetails();

    if (editTemplateWorkout !== null) {
      const {
        time: data_time = null,
        total_calories,
        details: { workout_exercise_groups = {} } = {},
      } = workoutData || {};

      const {
        all_workout_details: {
          days = [],
          start_time: { hours = "", minutes = "" } = {},
        } = {},
      } = this.props;
      const time = data_time
        ? data_time
        : moment(`${hours}:${minutes}`, "HH:mm A").toISOString();

      this.setState({
        completeData: [...workout_exercise_groups],
        initialFormData: {},
        total_calories,
        time,
      });
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    const {
      isWorkoutVisible = false,
      visible = false,
      workoutData = {},
    } = this.props;
    const {
      isWorkoutVisible: prev_isWorkoutVisible = false,
      visible: prev_visible = false,
    } = prevProps;

    if (visible && visible !== prev_visible) {
      await this.getWorkoutDetails();
    }

    if (isWorkoutVisible && isWorkoutVisible !== prev_isWorkoutVisible) {
      const {
        time: data_time = null,
        total_calories,
        details: { workout_exercise_groups = {} } = {},
      } = workoutData || {};

      const {
        all_workout_details: {
          days = [],
          start_time: { hours = "", minutes = "" } = {},
        } = {},
      } = this.props;
      const time = data_time
        ? data_time
        : moment(`${hours}:${minutes}`, "HH:mm A").toISOString();

      this.setState({
        completeData: [...workout_exercise_groups],
        initialFormData: {},
        total_calories,
        time,
      });
    }
  }

  setDeletedExerciseGroupId = (id) => {
    const { deletedExerciseGroupIds = [] } = this.state;
    deletedExerciseGroupIds.push(id);
    this.setState({ deletedExerciseGroupIds });
  };

  getWorkoutDetails = async () => {
    try {
      const {
        getSingleWorkoutDetails,
        payload = {},
        updateWorkoutTotalCalories,
      } = this.props;
      const {
        care_plan_id,
        workout_id = null,
        canViewDetails = false,
      } = payload || {};

      this.setState({ loading: true });

      const response = await getSingleWorkoutDetails(workout_id);
      const { status, payload: { data = {}, message: resp_msg = "" } = {} } =
        response || {};

      if (!status) {
        message.warn(resp_msg);
      } else {
        const {
          workouts = {},
          workout_exercise_groups = {},
          exercise_groups_total_calories = 0,
        } = data || {};

        const {
          basic_info: { name = "" } = {},
          details: { not_to_do = "" } = {},
          time = "",
          total_calories = "",
          start_date = "",
          end_date = "",
          expired_on = null,
        } = workouts[workout_id] || {};

        if (total_calories !== exercise_groups_total_calories) {
          const updateCaloriesResponse = await updateWorkoutTotalCalories({
            workout_id,
            total_calories: exercise_groups_total_calories,
          });
          const {
            status: updateCalories_status,
            payload: { message: updateCalories_resp_msg = "" } = {},
          } = updateCaloriesResponse || {};

          if (!updateCalories_status) {
            message.warn(updateCalories_resp_msg);
          }
        }

        const initialFormData = {
          name,
          start_date,
          end_date,
          not_to_do,
        };

        this.setState({
          completeData: [...workout_exercise_groups],
          initialFormData,
          care_plan_id,
          total_calories: exercise_groups_total_calories,
          time,
        });

        if (expired_on || canViewDetails) {
          this.setState({ canOnlyView: true });
        }
      }

      this.setState({ loading: false });
    } catch (error) {
      this.setState({ loading: false });
      console.log("error ===>", { error });
    }
  };

  getAllWorkoutDetails = async () => {
    try {
      const { getWorkoutDetails } = this.props;
      const response = await getWorkoutDetails();
      const { status, payload: { data = {}, message: resp_msg = "" } = {} } =
        response || {};

      if (!status) {
        message.error(resp_msg);
      } else {
        const {
          all_workout_details = {},
          all_workout_details: {
            days = [],
            start_time: { hours = "", minutes = "" } = {},
          } = {},
        } = this.props;
        const time = moment(`${hours}:${minutes}`, "HH:mm A").toISOString();

        this.setState({ days, time });
      }
    } catch (error) {
      message.error(error);
    }
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  setFinalDayData = (data) => {
    this.setState({ completeData: data });
  };

  onClose = () => {
    const { close } = this.props;
    const {
      props: {
        form: { resetFields },
      },
    } = this.formRef;

    this.setState({
      completeData: [],
      total_calories: 0,
      submitting: false,
      time: "",
      deletedExerciseGroupIds: [],
      canOnlyView: false,
    });

    resetFields();
    close();
  };

  setNewTotalCal = (newTotalCal) => {
    this.setState({ total_calories: newTotalCal });
  };

  setFormRef = (formRef) => {
    this.formRef = formRef;
    if (formRef) {
      this.setState({ formRef: true });
    }
  };

  validateWorkoutData = () => {
    const { completeData: workout_exercise_groups = {} } = this.state;

    if (Object.keys(workout_exercise_groups).length === 0) {
      message.warn(this.formatMessage(messages.addWorkoutDetails));
      return false;
    }

    return true;
  };

  handleSubmit = async () => {
    const {
      props: {
        form: { validateFields },
      },
    } = this.formRef;

    const {
      updateWorkout,
      carePlanId: care_plan_id = null,
      payload,
      addTemplateWorkout = null,
      editTemplateWorkout = null,
    } = this.props;
    const {
      time = "",
      completeData: workout_exercise_groups = {},
      total_calories = 0,
      deletedExerciseGroupIds = [],
    } = this.state;
    const { workout_id = null } = payload || {};
    const validated = this.validateWorkoutData();

    if (!validated) {
      return;
    }

    const fomattedTime = moment(time).toISOString();

    validateFields(async (err, values) => {
      if (!err) {
        let {
          name,
          start_date: moment_start_date,
          end_date: moment_end_date,
          what_not_to_do,
          repeat_days,
        } = values;

        if (
          name.length === 0 ||
          repeat_days.length === 0 ||
          (addTemplateWorkout === null &&
            editTemplateWorkout === null &&
            !care_plan_id)
        ) {
          message.warn(this.formatMessage(messages.fillAlldetails));
          return false;
        }

        const start_date = moment_start_date.toISOString();
        const end_date = moment_end_date ? moment_end_date.toISOString() : null;

        const data = {
          name,
          repeat_days,
          workout_exercise_groups,
          care_plan_id,
          total_calories,
          start_date,
          end_date,
          not_to_do: what_not_to_do,
          delete_exercise_group_ids: deletedExerciseGroupIds,
          time: fomattedTime,
        };

        this.setState({ submitting: true });

        if (addTemplateWorkout === null && editTemplateWorkout === null) {
          // normal edit workout
          const response = await updateWorkout(workout_id, data);
          const {
            status,
            statusCode,
            payload: { data: resp_data = {}, message: resp_msg = "" } = {},
          } = response || {};
          if (status) {
            message.success(resp_msg);
            this.onClose();
          } else {
            message.warn(resp_msg);
          }

          this.setState({ submitting: false });
        } else {
          // using template

          if (addTemplateWorkout) {
            addTemplateWorkout(data);
          } else if (editTemplateWorkout) {
            editTemplateWorkout(data);
          }
        }

        this.setState({ submitting: false });
      } else {
        let allErrors = "";
        for (let each in err) {
          const { errors = [] } = err[each] || {};
          for (let error of errors) {
            const { message = "" } = error;
            allErrors = allErrors + message + ".";
          }
        }
        message.warn(allErrors);
        this.setState({ submitting: false });
        return false;
      }
    });
  };

  setTime = (time) => {
    this.setState({ time });
  };

  getWorkoutComponent = () => {
    const { setFinalDayData, setNewTotalCal, setDeletedExerciseGroupId } = this;
    const {
      completeData = {},
      total_calories = 0,
      canOnlyView = false,
    } = this.state;

    return (
      <div>
        <div className="fs14 fw700 wp100  mt20 flex justify-space-between">
          <div className=" ">{this.formatMessage(messages.workout_text)}</div>
          <div className=" tar">{`${
            total_calories >= 0 ? total_calories : "--"
          }${" "}Cal`}</div>
        </div>

        <SingleDayExerciseComponent
          canOnlyView={canOnlyView}
          setFinalDayData={setFinalDayData}
          setNewTotalCal={setNewTotalCal}
          setDeletedExerciseGroupId={setDeletedExerciseGroupId}
          completeData={completeData}
          total_calories={total_calories}
          {...this.props}
        />
      </div>
    );
  };

  handleDelete = () => {
    const { warnNote } = this;
    const {
      payload: { workout_id = null, patient_id } = {},
      getPatientCarePlanDetails,
    } = this.props || {};

    confirm({
      title: `${this.formatMessage(messages.warnNote)}`,
      content: <div>{warnNote()}</div>,
      onOk: async () => {
        try {
          const { deleteWorkout } = this.props;
          const response = (await deleteWorkout(workout_id)) || {};
          const {
            status,
            statusCode,
            payload: { data: resp_data = {}, message: resp_msg = "" } = {},
          } = response || {};
          if (status) {
            message.success(resp_msg);
            await getPatientCarePlanDetails(patient_id);
            this.onClose();
          } else {
            message.warn(resp_msg);
          }
        } catch (err) {
          console.log("err ", err);
          message.warn(this.formatMessage(messages.somethingWentWrong));
        }
      },
      onCancel() {},
    });
  };

  warnNote = () => {
    return (
      <div className="pt16">
        <p>
          <span className="fw600">{"Note"}</span>
          {` :${this.formatMessage(messages.irreversibleWarn)} `}
        </p>
      </div>
    );
  };

  getDeleteButton = () => {
    const { handleDelete } = this;
    const {
      loading,
      deleteWorkoutOfTemplate,
      hideWorkout,
      addTemplateWorkout,
    } = this.props;

    if (addTemplateWorkout) {
      return (
        <Button onClick={hideWorkout} style={{ marginRight: 8 }}>
          Cancel
        </Button>
      );
    }

    return (
      <Button
        type={"danger"}
        ghost
        className="fs14 no-border style-delete"
        onClick={
          deleteWorkoutOfTemplate ? deleteWorkoutOfTemplate : handleDelete
        }
        loading={loading}
      >
        <div className="flex align-center delete-text">
          <div className="ml4">Delete</div>
        </div>
      </Button>
    );
  };

  render() {
    const {
      formatMessage,
      onClose,
      setFormRef,
      getWorkoutComponent,
      getDeleteButton,
      setTime,
      FormWrapper,
    } = this;
    const { visible = false } = this.props;
    const {
      workoutVisible = false,
      hideWorkout = null,
      addTemplateWorkout = null,
      editTemplateWorkout = null,
    } = this.props;
    const {
      submitting = false,
      initialFormData = {},
      loading = false,
      days = [],
      time = "",
      canOnlyView = false,
    } = this.state;

    return (
      <Fragment>
        <Drawer
          title={
            canOnlyView
              ? formatMessage(messages.viewDetails)
              : editTemplateWorkout === null && addTemplateWorkout === null
              ? formatMessage(messages.editWorkout)
              : addTemplateWorkout
              ? formatMessage(messages.addWorkoutText)
              : formatMessage(messages.editWorkout)
          }
          placement="right"
          maskClosable={false}
          headerStyle={{
            position: "sticky",
            zIndex: "9999",
            top: "0px",
          }}
          destroyOnClose={true}
          onClose={
            addTemplateWorkout || editTemplateWorkout ? hideWorkout : onClose
          }
          visible={
            addTemplateWorkout || editTemplateWorkout ? workoutVisible : visible
          }
          width={`30%`}
        >
          {loading ? (
            <div className="hp100 wp100 flex direction-column align-center justify-center z1">
              <Loading className={"wp100"} />
            </div>
          ) : (
            <div className="wp100">
              <FormWrapper
                canOnlyView={canOnlyView}
                wrappedComponentRef={setFormRef}
                days={days}
                setTime={setTime}
                time={time}
                getWorkoutComponent={getWorkoutComponent}
                initialFormData={initialFormData}
                {...this.props}
              />

              {!canOnlyView && (
                <Footer
                  className="flex justify-space-between"
                  onSubmit={this.handleSubmit}
                  onClose={onClose}
                  submitText={formatMessage(messages.submit_text)}
                  submitButtonProps={{}}
                  cancelComponent={getDeleteButton()}
                  submitting={submitting}
                />
              )}
            </div>
          )}
        </Drawer>
      </Fragment>
    );
  }
}

export default injectIntl(EditWorkout);
