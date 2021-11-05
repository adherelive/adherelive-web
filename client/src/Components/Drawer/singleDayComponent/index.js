import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { WAKE_UP, MEAL_TIMINGS, PATIENT_MEAL_TIMINGS } from "../../../constant";

import AddFoodGroupDrawer from "../../../Containers/Drawer/addFoodGroup";
import EditFoodGroupDrawer from "../../../Containers/Drawer/editFoodGroup";
import PlusOutlined from "@ant-design/icons/PlusOutlined";
import messages from "./messages";
import edit_image from "../../../Assets/images/edit.svg";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import moment from "moment";

const ALL_TIMINGS = MEAL_TIMINGS;

class DayDiet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTime: WAKE_UP,
      addFoodGroupDrawerVisible: false,
      editFoodGroupDrawerVisible: false,
      editFoodGroupDetails: {},
      selectedFoodGroupIndex: null,
    };
  }

  formatMessage = (data) => this.props.intl.formatMessage(data);

  getServingWiseCalorificValue = ({ food_item_detail_id, serving: serv }) => {
    let calVal = 0;
    const serving = serv ? serv : 1;
    const { food_item_details = {} } = this.props;
    const { basic_info: { calorific_value = 0 } = {} } =
      food_item_details[food_item_detail_id] || {};
    calVal = calorific_value * serving;
    return calVal;
  };

  addFoodGroup = async (data) => {
    // Add Food Group onSubmit

    // updates diet's completeData for new entry
    const { selectedTime } = this.state;

    let {
      setFinalDayData,
      completeData,
      total_calories = 0,
      setNewTotalCal,
    } = this.props;

    const { food_item_detail_id = null, serving = 1 } = data;
    let newCompleteData = completeData;
    const timeData = completeData[selectedTime] || [];
    timeData.push(data);
    newCompleteData[selectedTime] = timeData;
    await setFinalDayData(newCompleteData);
    const calVal = this.getServingWiseCalorificValue({
      food_item_detail_id,
      serving,
    });
    const newTotalCalories = total_calories + calVal;
    setNewTotalCal(newTotalCalories);
  };

  handleEditFoodGroupSubmit = async (foodGroupDrawerData) => {
    // updates diet's completeData for updated entry

    const { similar_index = null } = foodGroupDrawerData;

    if (similar_index === null) {
      this.editFoodGroup(foodGroupDrawerData);
    } else {
      this.editSimilarFoodGroup(foodGroupDrawerData);
    }
  };

  editFoodGroup = async (foodGroupDrawerData) => {
    const { food_group_index, editedFoodGroupData } = foodGroupDrawerData;

    const { selectedTime } = this.state;
    let {
      setFinalDayData,
      completeData,
      total_calories = 0,
      setNewTotalCal,
    } = this.props;
    let newCompleteData = completeData;

    let timeData = completeData[selectedTime] || [];

    const { similar = [] } = timeData[food_group_index] || {};

    const {
      food_item_detail_id = null,
      serving = 1,
      prev_calorific_val = 0,
      prev_serving = 1,
    } = editedFoodGroupData || {};

    if (timeData.length && timeData[food_group_index]) {
      timeData[food_group_index] = {
        ...editedFoodGroupData,
        ...(similar.length && { similar: similar }),
      };
    }

    newCompleteData[selectedTime] = timeData;

    await setFinalDayData(newCompleteData);

    const calVal = this.getServingWiseCalorificValue({
      food_item_detail_id,
      serving,
    });

    const totalPrevCalVal = prev_calorific_val * prev_serving || 0;

    const newTotalCal = total_calories - totalPrevCalVal + calVal;
    setNewTotalCal(newTotalCal);
  };

  editSimilarFoodGroup = async (foodGroupDrawerData) => {
    const {
      food_group_index,
      editedFoodGroupData,
      similar_index = null,
    } = foodGroupDrawerData;

    const { selectedTime } = this.state;
    let {
      setFinalDayData,
      completeData,
      total_calories = 0,
      setNewTotalCal,
    } = this.props;
    let newCompleteData = completeData;

    let timeData = completeData[selectedTime] || [];

    let food_group = timeData[food_group_index] || {};
    const similarArr = food_group["similar"] || [];

    const {} = similarArr[similar_index] || {};

    const {
      food_item_detail_id = null,
      serving = 1,
      prev_calorific_val = 0,
      prev_serving = 1,
    } = editedFoodGroupData || {};

    if (similarArr.length && similarArr[similar_index]) {
      similarArr[similar_index] = { ...editedFoodGroupData };
    }

    food_group["similar"] = similarArr;
    timeData[food_group_index] = food_group;
    newCompleteData[selectedTime] = timeData;

    await setFinalDayData(newCompleteData);

    const calVal = this.getServingWiseCalorificValue({
      food_item_detail_id,
      serving,
    });

    const totalPrevCalVal = prev_calorific_val * prev_serving || 0;

    const newTotalCal = total_calories - totalPrevCalVal + calVal;
    setNewTotalCal(newTotalCal);
  };

  addSimilarFoodGroup =
    ({ food_group_index, time }) =>
    () => {
      this.setState({ selectedFoodGroupIndex: food_group_index });
      this.openAddFoodGroupDrawer(time);
    };

  closeAddSimilarFoodGroup = () => {
    this.setState({ selectedFoodGroupIndex: null });
    this.closeAddFoodGroupDrawer();
  };

  submitAddSimilarFoodGroup = async (data) => {
    const { selectedTime, selectedFoodGroupIndex } = this.state;

    let {
      setFinalDayData,
      completeData,
      total_calories = 0,
      setNewTotalCal,
    } = this.props;

    const { food_item_detail_id = null, serving = 1 } = data;
    let newCompleteData = completeData;
    let timeData = completeData[selectedTime] || [];
    let similarFoodGroup = timeData[selectedFoodGroupIndex] || {};
    const similarArr = similarFoodGroup["similar"] || [];
    similarArr.push(data);
    similarFoodGroup["similar"] = similarArr || [];
    timeData[selectedFoodGroupIndex] = similarFoodGroup;
    newCompleteData[selectedTime] = timeData;
    await setFinalDayData(newCompleteData);
    const calVal = this.getServingWiseCalorificValue({
      food_item_detail_id,
      serving,
    });
    const newTotalCalories = total_calories + calVal;
    setNewTotalCal(newTotalCalories);
  };

  getTimingOptions = () => {
    let options = [];
    let {
      completeData: singleDayData,
      timings = {},
      canOnlyView = false,
    } = this.props;

    if (Object.keys(timings).length === 0) {
      timings = PATIENT_MEAL_TIMINGS; // default
    }

    for (let each of ALL_TIMINGS) {
      const { text = "", time = "" } = timings[each] || {};
      const formattedTime = moment(time).format("hh:mm A");

      const singleTimeData = singleDayData[each] || [];
      let allFoodItems = [];

      if (singleTimeData.length) {
        for (let i = 0; i < singleTimeData.length; i++) {
          const {
            food_group_id = null,
            notes = "",
            food_item_detail_id = null,
            portion_id = null,
            serving = null,
            similar = [],
          } = singleTimeData[i] || {};

          const food_group_index = i;

          const foodGroupComponent = this.getFoodItemComponent({
            food_group_index,
            food_item_detail_id,
            portion_id,
            serving,
            notes,
            time: each,
            similar_index: null,
            food_group_id,
          });

          let allSimilarComponents = [];

          if (similar.length) {
            for (let j = 0; j < similar.length; j++) {
              const {
                notes: similar_notes = "",
                food_item_detail_id: similar_food_item_detail_id = null,
                portion_id: similar_portion_id = null,
                serving: similar_serving = null,
                food_group_id: similar_food_group_id,
              } = similar[j] || {};

              const similarComponent = this.getFoodItemComponent({
                food_group_index,
                food_item_detail_id: similar_food_item_detail_id,
                portion_id: similar_portion_id,
                serving: similar_serving,
                notes: similar_notes,
                time: each,
                similar_index: j,
                food_group_id: similar_food_group_id,
              });

              allSimilarComponents.push(similarComponent);
            }
          }

          const Comp = (
            <div className="flex align-center justify-center food-group-container  ">
              <div className="food-group">
                {foodGroupComponent}
                {allSimilarComponents}
                {!canOnlyView && (
                  <div className="flex direction-column algin-center justify-center or-before-line">
                    <div
                      className="or-button fs12 pointer flex drection-column align-center justify-center ml20"
                      onClick={this.addSimilarFoodGroup({
                        food_group_index,
                        time: each,
                      })}
                    >
                      {this.formatMessage(messages.orText).toUpperCase()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );

          allFoodItems.push(Comp);
        }
      }

      options.push(
        <div className="tal wp100 mt20 ">
          <div className="fs14 fw700 mb10">
            {" "}
            {this.props.intl.formatMessage(
              { ...messages.timeOptions },
              {
                text,
                formattedTime,
              }
            )}
          </div>
          <div className="b-light-grey wp100 mh40 flex direction-column align-center p10 br4 ">
            {!canOnlyView && (
              <div
                className=" pointer tab-color tal fw700 wp100 "
                onClick={this.handleTimingSelect(each)}
              >
                <PlusOutlined className="pointer tab-color" title="Add More" />
                <span className="ml10">
                  {this.formatMessage(messages.addFoodItem)}
                </span>
              </div>
            )}

            <div className=" wp100 flex flex-wrap max-w-100p ">
              {allFoodItems.length ? allFoodItems : null}
            </div>
          </div>
        </div>
      );
    }

    return options;
  };

  handleTimingSelect = (value) => (e) => {
    e.preventDefault();

    this.openAddFoodGroupDrawer(value);
  };

  openAddFoodGroupDrawer = (selectedTime) => {
    this.setState({
      selectedTime: selectedTime,
      addFoodGroupDrawerVisible: true, // open add food group drawer
    });
  };

  closeAddFoodGroupDrawer = () => {
    this.setState({ addFoodGroupDrawerVisible: false });
  };

  handleOpenEditFoodGroupDrawer = (data) => () => {
    const { time, food_group_id = null, ...rest } = data || {};
    let editData = { ...rest };

    if (food_group_id) {
      // else no food group id key
      editData["food_group_id"] = food_group_id;
    }
    this.setState({
      selectedTime: time,
      editFoodGroupDrawerVisible: true,
      editFoodGroupDetails: editData,
    });
  };

  closeEditFoodGroupDrawer = () => {
    this.setState({
      editFoodGroupDrawerVisible: false,
      editFoodGroupDetails: {},
    });
  };

  handleDeleteFoodGroup =
    ({ food_group_index, time }) =>
    async () => {
      const {
        completeData,
        setDeletedFoodGroupId,
        food_item_details,
        total_calories = 0,
        setNewTotalCal,
        setFinalDayData,
      } = this.props;

      let timeData = completeData[time] || [];
      const foodGroup = timeData[food_group_index] || {};

      let newCompleteData = completeData;

      const {
        food_item_detail_id = null,
        serving = 1,
        similar = [],
      } = foodGroup || {};

      const { basic_info: { calorific_value = 0 } = {} } =
        food_item_details[food_item_detail_id] || {};
      const newCalories = total_calories - calorific_value * serving;

      const { food_group_id = null } = foodGroup;

      if (food_group_id) {
        setDeletedFoodGroupId(food_group_id);
      }

      if (similar.length === 0) {
        if (Object.keys(foodGroup).length) {
          timeData.splice(food_group_index, 1);
        }

        newCompleteData[time] = timeData;
        await setFinalDayData(newCompleteData);
        setNewTotalCal(newCalories);
      } else {
        const similarArr = foodGroup["similar"] || [];
        const firstSimilar = similarArr[0] || {};
        const restSimilar = similarArr.slice(1);
        firstSimilar["similar"] = [...restSimilar];
        timeData[food_group_index] = firstSimilar;
        newCompleteData[time] = timeData;
        await setFinalDayData(newCompleteData);
        setNewTotalCal(newCalories);
      }
    };

  handleDeleteSimilarFoodGroup =
    ({ food_group_index, time, similar_index }) =>
    async () => {
      const {
        completeData,
        food_item_details,
        total_calories = 0,
        setNewTotalCal,
        setFinalDayData,
        setDeletedFoodGroupId,
      } = this.props;

      let timeData = completeData[time] || [];
      let foodGroup = timeData[food_group_index] || {};

      let newCompleteData = completeData;

      const { similar: similarArr = [] } = foodGroup || {};
      const similarFoodGroup = similarArr[similar_index] || {};

      const {
        food_item_detail_id = null,
        serving = 1,
        food_group_id = null,
      } = similarFoodGroup;

      if (food_group_id) {
        setDeletedFoodGroupId(food_group_id);
      }

      const { basic_info: { calorific_value = 0 } = {} } =
        food_item_details[food_item_detail_id] || {};
      const newCalories = total_calories - calorific_value * serving;

      if (Object.keys(similarFoodGroup).length) {
        similarArr.splice(similar_index, 1);
      }

      foodGroup["similar"] = similarArr || [];
      timeData[food_group_index] = foodGroup;
      newCompleteData[time] = timeData;
      await setFinalDayData(newCompleteData);
      setNewTotalCal(newCalories);
    };

  getFoodItemComponent = ({
    food_group_index,
    food_item_detail_id,
    portion_id,
    serving,
    notes,
    time,
    similar_index,
    food_group_id,
  }) => {
    const { handleOpenEditFoodGroupDrawer } = this;

    const {
      food_items,
      food_item_details,
      portions,
      canOnlyView = false,
    } = this.props;
    const { basic_info: { food_item_id = null, portion_size = null } = {} } =
      food_item_details[food_item_detail_id] || {};

    const { basic_info: { name: food_name = "" } = {} } =
      food_items[food_item_id] || {};

    const calVal = this.getServingWiseCalorificValue({
      food_item_detail_id,
      serving,
    });
    const { basic_info: { name: portion } = {} } = portions[portion_id] || {};

    return (
      <div
        className={` b-light-grey minw200 wauto p10 m10 br4 
              ${similar_index === null ? "null" : "similar-before-line"}
               `}
      >
        <div className="fs16 fwbolder flex wp100 justify-space-between mb10">
          {food_name}
          <div className="flex algin-center justify-center ">
            <div className="flex direction-column algin-center justify-center">
              {!canOnlyView && (
                <img
                  src={edit_image}
                  className="edit-patient-icon flex direction-column align-center justify-center pointer"
                  onClick={handleOpenEditFoodGroupDrawer({
                    food_group_index,
                    serving,
                    detail_id: food_item_detail_id,
                    food_item_id,
                    notes,
                    time,
                    similar_index,
                    food_group_id,
                  })}
                />
              )}
            </div>
            <div className="flex direction-column algin-center justify-center">
              {!canOnlyView && (
                <DeleteOutlined
                  className={"pointer align-self-end ml10 "}
                  onClick={
                    similar_index === null
                      ? this.handleDeleteFoodGroup({ food_group_index, time })
                      : this.handleDeleteSimilarFoodGroup({
                          food_group_index,
                          time,
                          similar_index,
                        })
                  }
                  style={{ fontSize: "18px", color: "#6d7278" }}
                />
              )}
            </div>
          </div>
        </div>
        <div className="fs14 fw700 flex">
          {`${serving}x${" "}${portion_size}${" "}${portion}`}
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
      addFoodGroupDrawerVisible = false,
      editFoodGroupDrawerVisible,
      editFoodGroupDetails,
      selectedFoodGroupIndex = null,
    } = this.state;

    const {
      closeAddFoodGroupDrawer,
      closeEditFoodGroupDrawer,
      closeAddSimilarFoodGroup,
      addFoodGroup,
      submitAddSimilarFoodGroup,
    } = this;

    return (
      <Fragment>
        <div className="wp100 flex direction-column align-center justify-center">
          {this.getTimingOptions()}
        </div>

        <AddFoodGroupDrawer
          visible={addFoodGroupDrawerVisible}
          closeFoodGroupDrawer={
            selectedFoodGroupIndex === null
              ? closeAddFoodGroupDrawer
              : closeAddSimilarFoodGroup
          }
          onSubmit={
            selectedFoodGroupIndex === null
              ? addFoodGroup
              : submitAddSimilarFoodGroup
          }
        />

        <EditFoodGroupDrawer
          visible={editFoodGroupDrawerVisible}
          editFoodGroupDetails={editFoodGroupDetails}
          closeFoodGroupDrawer={closeEditFoodGroupDrawer}
          onSubmit={this.handleEditFoodGroupSubmit}
        />
      </Fragment>
    );
  }
}

export default injectIntl(DayDiet);
