import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Button, Drawer } from "antd";
import messages from "./messages";
import SingleDayExerciseComponent from "../singleDayExerciseComponent/index";
import message from "antd/es/message";
import ExerciseFieldsForm from "./form";
import Form from "antd/es/form";
import Footer from "../footer";
import moment from "moment";

class AddExercise extends Component {
  constructor(props) {
    super(props);
    this.state = {
      completeData: [],
      total_calories: 0,
      submitting: false,
      days: [],
      time: "",
    };

    this.FormWrapper = Form.create({ onFieldsChange: this.onFormFieldChanges })(
      ExerciseFieldsForm
    );
  }

  async componentDidMount() {
    await this.getAllWorkoutDetails();
  }

  async componentDidUpdate(prevProps, prevState) {
    const { visible = false } = this.props;
    const { visible: prev_visible = false } = prevProps;

    if (visible && visible !== prev_visible) {
      await this.getAllWorkoutDetails();
    }
  }

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

  setTime = (time) => {
    this.setState({ time });
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

  validateExerciseData = () => {
    const { completeData: workout_exercise_groups = [] } = this.state;

    if (workout_exercise_groups.length === 0) {
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

    const validated = this.validateExerciseData();

    if (!validated) {
      return;
    }

    const { addWorkout, carePlanId: care_plan_id = null } = this.props;
    const {
      completeData: workout_exercise_groups = [],
      total_calories = 0,
      time = "",
    } = this.state;

    const fomattedTime = moment(time).toISOString();

    validateFields(async (err, values) => {
      if (!err) {
        let {
          name = "",
          start_date: moment_start_date,
          end_date: moment_end_date,
          what_not_to_do = "",
          repeat_days = [],
        } = values;

        if (name.length === 0 || repeat_days.length === 0 || !care_plan_id) {
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
          time: fomattedTime,
        };

        this.setState({ submitting: true });
        const response = await addWorkout(data);
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

  getWorkoutComponent = () => {
    const { setFinalDayData, setNewTotalCal, setTime } = this;
    const { completeData = {}, total_calories = 0, time = "" } = this.state;

    // console.log("82374723648273648723647832 ==========>>>>>> ",{total_calories});

    return (
      <div>
        <div className="fs14 fw700 wp100  mt20 flex justify-space-between">
          <div className=" ">{this.formatMessage(messages.workout_text)}</div>
          <div className=" tar">{`${
            total_calories >= 0 ? total_calories : "--"
          }${" "}Cal`}</div>
        </div>

        <SingleDayExerciseComponent
          setFinalDayData={setFinalDayData}
          setNewTotalCal={setNewTotalCal}
          completeData={completeData}
          total_calories={total_calories}
          {...this.props}
        />
      </div>
    );
  };

  render() {
    const {
      formatMessage,
      onClose,
      setFormRef,
      getWorkoutComponent,
      setTime,
      FormWrapper,
    } = this;
    const { visible = false } = this.props;
    const { submitting = false, days = [], time = "" } = this.state;

    return (
      <Fragment>
        <Drawer
          title={formatMessage(messages.addWorkout)}
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
          width={`30%`}
        >
          <FormWrapper
            wrappedComponentRef={setFormRef}
            days={days}
            setTime={setTime}
            time={time}
            getWorkoutComponent={getWorkoutComponent}
            {...this.props}
          />

          <Footer
            onSubmit={this.handleSubmit}
            onClose={onClose}
            submitText={formatMessage(messages.submit_text)}
            submitButtonProps={{}}
            cancelComponent={null}
            submitting={submitting}
          />
        </Drawer>
      </Fragment>
    );
  }
}

export default injectIntl(AddExercise);
