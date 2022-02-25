import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import moment from "moment";
import AddExerciseGroupDrawer from "../../../Containers/Drawer/addExerciseGroup";
import EditExerciseGroupDrawer from "../../../Containers/Drawer/editExerciseGroup";
import PlusOutlined from "@ant-design/icons/PlusOutlined";
import messages from "./messages";
import edit_image from "../../../Assets/images/edit.svg";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";

class DayWorkout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addExerciseGroupDrawerVisible: false,
      editExerciseGroupDrawerVisible: false,
      editExerciseGroupDetails: {},
      selectedExerciseGroupIndex: null,
    };
  }

  formatMessage = (data) => this.props.intl.formatMessage(data);

  getSetWiseCalorificValue = ({ exercise_detail_id, sets: setVal }) => {
    let calVal = 0;
    const setNum = setVal ? setVal : 1;
    const { exercise_details = {} } = this.props;
    const { calorific_value = 0 } = exercise_details[exercise_detail_id] || {};
    calVal = calorific_value * setNum;
    return calVal;
  };

  addExerciseGroup = async (data) => {
    // Add Exercise Group onSubmit

    // updates workout's completeData for new entry
    let {
      setFinalDayData,
      completeData,
      total_calories = 0,
      setNewTotalCal,
    } = this.props;

    const { exercise_detail_id = null, sets = 1 } = data;
    // console.log("61278312546125461254612 ====>>> ADD ",{data,exercise_detail_id});
    let timeData = completeData || [];
    timeData.push(data);
    await setFinalDayData(timeData);
    const calVal = this.getSetWiseCalorificValue({ exercise_detail_id, sets });
    const newTotalCalories = total_calories + calVal;
    setNewTotalCal(newTotalCalories);
  };

  handleEditExerciseGroupSubmit = async (exerciseGroupDrawerData) => {
    // updates workout's completeData for updated entry
    this.editExerciseGroup(exerciseGroupDrawerData);
  };

  editExerciseGroup = async (exerciseGroupDrawerData) => {
    const { exercise_group_index, editedExerciseGroupData } =
      exerciseGroupDrawerData;
    let {
      setFinalDayData,
      completeData,
      total_calories = 0,
      setNewTotalCal,
    } = this.props;
    let timeData = completeData || [];

    const {
      exercise_detail_id = null,
      sets = 1,
      prev_calorific_val = 0,
      prev_sets = 1,
    } = editedExerciseGroupData || {};

    console.log("61278312546125461254612", { exerciseGroupDrawerData });

    if (timeData.length && timeData[exercise_group_index]) {
      timeData[exercise_group_index] = {
        ...editedExerciseGroupData,
      };
    }

    await setFinalDayData(timeData);

    const calVal = this.getSetWiseCalorificValue({
      exercise_detail_id,
      sets,
    });

    const totalPrevCalVal = prev_calorific_val * prev_sets || 0;

    const newTotalCal = total_calories - totalPrevCalVal + calVal;
    setNewTotalCal(newTotalCal);
  };

  getTimingOptions = () => {
    let options = [],
      allExerciseItems = [];
    const {
      completeData = [],
      time = moment(),
      exercise_details = {},
      canOnlyView = false,
    } = this.props;

    for (let i = 0; i < completeData.length; i++) {
      const {
        exercise_group_id = null,
        sets,
        exercise_detail_id,
        notes,
      } = completeData[i] || {};

      const { basic_info: { repetition_id = null } = {} } =
        exercise_details[exercise_detail_id] || {};

      const exercise_group_index = i;

      const exerciseGroupComponent = this.getExerciseItemComponent({
        exercise_group_index,
        exercise_detail_id,
        repetition_id,
        sets,
        notes,
        exercise_group_id,
      });

      const Comp = (
        <div className="flex align-center justify-center exercise-group-container  ">
          <div className="exercise-group">{exerciseGroupComponent}</div>
        </div>
      );

      allExerciseItems.push(Comp);
    }

    options.push(
      <div className="tal wp100 mt10 mb10 ">
        <div className="b-light-grey wp100 mh40 flex direction-column align-center p10 br4 ">
          {!canOnlyView && (
            <div
              className=" pointer tab-color tal fw700 wp100 flex justify-space-between"
              onClick={this.openAddExerciseGroupDrawer}
            >
              <div>
                <PlusOutlined className="pointer tab-color" title="Add More" />
                <span className="ml10">
                  {this.formatMessage(messages.addExercise)}
                </span>
              </div>
            </div>
          )}

          <div className=" wp100 flex flex-wrap max-w-100p ">
            {allExerciseItems.length ? allExerciseItems : null}
          </div>
        </div>
      </div>
    );

    //  }

    return options;
  };

  openAddExerciseGroupDrawer = () => {
    this.setState({
      addExerciseGroupDrawerVisible: true, // open add exercise group drawer
    });
  };

  closeAddExerciseGroupDrawer = () => {
    this.setState({ addExerciseGroupDrawerVisible: false });
  };

  handleOpenEditExerciseGroupDrawer = (data) => () => {
    const { exercise_group_id = null, ...rest } = data || {};
    let editData = { ...rest };

    if (exercise_group_id) {
      // else no exercise group id key
      editData["exercise_group_id"] = exercise_group_id;
    }
    this.setState({
      editExerciseGroupDrawerVisible: true,
      editExerciseGroupDetails: editData,
    });
  };

  closeEditExerciseGroupDrawer = () => {
    this.setState({
      editExerciseGroupDrawerVisible: false,
      editExerciseGroupDetails: {},
    });
  };

  handleDeleteExerciseGroup =
    ({ exercise_group_index }) =>
    async () => {
      const {
        completeData,
        setDeletedExerciseGroupId,
        exercise_details,
        total_calories = 0,
        setNewTotalCal,
        setFinalDayData,
      } = this.props;

      let timeData = completeData || [];
      const exerciseGroup = timeData[exercise_group_index] || {};

      let newCompleteData = completeData;

      const { exercise_detail_id = null, sets = 1 } = exerciseGroup || {};

      const { calorific_value = 0 } =
        exercise_details[exercise_detail_id] || {};
      const newCalories = total_calories - calorific_value * sets;

      const { exercise_group_id = null } = exerciseGroup;

      if (exercise_group_id) {
        setDeletedExerciseGroupId(exercise_group_id);
      }

      if (Object.keys(exerciseGroup).length) {
        timeData.splice(exercise_group_index, 1);
      }

      newCompleteData = timeData;
      await setFinalDayData(newCompleteData);
      setNewTotalCal(newCalories);
    };

  getExerciseItemComponent = ({
    exercise_group_index,
    exercise_detail_id,
    repetition_id,
    sets,
    notes,
    exercise_group_id,
  }) => {
    const { handleOpenEditExerciseGroupDrawer } = this;

    const {
      exercises,
      exercise_details,
      repetitions,
      canOnlyView = false,
    } = this.props;

    const { basic_info: { exercise_id = null, repetition_value = null } = {} } =
      exercise_details[exercise_detail_id] || {};

    const { basic_info: { name: exercise_name = "" } = {} } =
      exercises[exercise_id] || {};

    const calVal = this.getSetWiseCalorificValue({ exercise_detail_id, sets });
    const { type: repetition } = repetitions[repetition_id] || {};

    return (
      <div className={` b-light-grey minw200 wauto p10 m10 br4 `}>
        <div className="fs16 fwbolder flex wp100 justify-space-between mb10">
          {exercise_name}
          <div className="flex algin-center justify-center ">
            <div className="flex direction-column algin-center justify-center">
              {!canOnlyView && (
                <img
                  src={edit_image}
                  className="edit-patient-icon flex direction-column align-center justify-center pointer"
                  onClick={handleOpenEditExerciseGroupDrawer({
                    exercise_group_index,
                    sets,
                    detail_id: exercise_detail_id,
                    exercise_id,
                    notes,
                    exercise_group_id,
                  })}
                />
              )}
            </div>
            <div className="flex direction-column algin-center justify-center">
              {!canOnlyView && (
                <DeleteOutlined
                  className={"pointer align-self-end ml10 "}
                  onClick={this.handleDeleteExerciseGroup({
                    exercise_group_index,
                  })}
                  style={{ fontSize: "18px", color: "#6d7278" }}
                />
              )}
            </div>
          </div>
        </div>
        <div className="fs14 fw700 flex">
          {`${sets}x${" "}${repetition_value}${" "}${repetition}`}
          <span className="grey-dot">&bull;</span>
          {`${calVal ? calVal : "--"} Cal`}
        </div>
        {notes && (
          <div className="fs12 ellipsis wp100 max-h-50">
            {`${this.formatMessage(messages.note)}: `}
            {notes}
          </div>
        )}
      </div>
    );
  };

  render() {
    const {
      addExerciseGroupDrawerVisible = false,
      editExerciseGroupDrawerVisible,
      editExerciseGroupDetails,
      selectedExerciseGroupIndex = null,
    } = this.state;

    const {
      closeAddExerciseGroupDrawer,
      closeEditExerciseGroupDrawer,
      addExerciseGroup,
    } = this;

    return (
      <Fragment>
        <div className="wp100 flex direction-column align-center justify-center">
          {this.getTimingOptions()}
        </div>

        <AddExerciseGroupDrawer
          visible={addExerciseGroupDrawerVisible}
          closeExerciseGroupDrawer={closeAddExerciseGroupDrawer}
          onSubmit={addExerciseGroup}
        />

        <EditExerciseGroupDrawer
          visible={editExerciseGroupDrawerVisible}
          editExerciseGroupDetails={editExerciseGroupDetails}
          closeExerciseGroupDrawer={closeEditExerciseGroupDrawer}
          onSubmit={this.handleEditExerciseGroupSubmit}
        />
      </Fragment>
    );
  }
}

export default injectIntl(DayWorkout);
