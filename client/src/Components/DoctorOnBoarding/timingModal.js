import React, { Component } from "react";
import { injectIntl } from "react-intl";
// import messages from "./message";
// import {formatMessage} from "react-intl/src/format";
import moment from "moment";
import uuid from "react-uuid";
import { Button, Modal, TimePicker, Icon, message, Checkbox } from "antd";
import { FULL_DAYS } from "../../constant";
import messages from "./messages";
import { ClockCircleOutlined } from "@ant-design/icons";
import Dropdown from "antd/es/dropdown";
import TimeKeeper from "react-timekeeper";

// const Initial_State = {
//     daySelected: {
//         [FULL_DAYS.MON]: false,
//         [FULL_DAYS.TUE]: false,
//         [FULL_DAYS.WED]: false,
//         [FULL_DAYS.THU]: false,
//         [FULL_DAYS.FRI]: false,
//         [FULL_DAYS.SAT]: false,
//         [FULL_DAYS.SUN]: false,

//     },
//     dayTimings: {
//         [FULL_DAYS.MON]: {},
//         [FULL_DAYS.TUE]: {},
//         [FULL_DAYS.WED]: {},
//         [FULL_DAYS.THU]: {},
//         [FULL_DAYS.FRI]: {},
//         [FULL_DAYS.SAT]: {},
//         [FULL_DAYS.SUN]: {},
//     }
// };

const START_TIME = "start_time";
const END_TIME = "end_time";

class TimingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      daySelected: {
        [FULL_DAYS.MON]: false,
        [FULL_DAYS.TUE]: false,
        [FULL_DAYS.WED]: false,
        [FULL_DAYS.THU]: false,
        [FULL_DAYS.FRI]: false,
        [FULL_DAYS.SAT]: false,
        [FULL_DAYS.SUN]: false
      },
      dayTimings: {
        [FULL_DAYS.MON]: {},
        [FULL_DAYS.TUE]: {},
        [FULL_DAYS.WED]: {},
        [FULL_DAYS.THU]: {},
        [FULL_DAYS.FRI]: {},
        [FULL_DAYS.SAT]: {},
        [FULL_DAYS.SUN]: {}
      },
      oneDaySelected: false
    };
  }

  componentDidMount() {
    const { timings = {}, daySelected, oneDaySelected } = this.props;
    let newTimings = {};

    for (let day in timings) {
      let dayTiming = {};
      let dayTimingKeys = [];
      for (let timing of timings[day]) {
        let key = uuid();
        dayTimingKeys.push(key);
        dayTiming[key] = {
          startTime: timing.startTime ? timing.startTime : "",
          endTime: timing.endTime ? timing.endTime : ""
        };
      }
      newTimings[day] = {};
      newTimings[day].timings = dayTiming;
      newTimings[day].timingsKeys = dayTimingKeys;
    }
    this.setState({ dayTimings: newTimings, daySelected });
    if (this.checkAnyDaySelected(daySelected) > 0 && !oneDaySelected) {
      this.setState({ oneDaySelected: true });
    }
  }

  componentDidUpdate() {
    const { daySelected, oneDaySelected } = this.state;
    if (this.checkAnyDaySelected(daySelected) === 1 && !oneDaySelected) {
      this.setState({ oneDaySelected: true });
    }
  }

  isOneDaySelected = () => {
    const { daySelected = {} } = this.state;

    return Object.values(daySelected).filter(day => day === true).length === 1;
  };

  componentWillUnmount() {
    this.setState({});
  }

  formatMessage = data => this.props.intl.formatMessage(data);

  toggleDaySelected = day => () => {
    let { daySelected, dayTimings = {}, oneDaySelected } = this.state;

    const newDayTimings = { ...dayTimings };
    let newDaySelected = daySelected;
    let isDaySelected = newDaySelected[day];
    // if (isDaySelected) {
    //   newDaySelected[day] = !isDaySelected;
    //   let key = uuid();
    //   let dayTiming = {};
    //   dayTiming[key] = { startTime: "", endTime: "" };
    //   let dayTimingKeys = [key];
    //   dayTimings[day].timings = dayTiming;
    //   dayTimings[day].timingsKeys = dayTimingKeys;
    // } else {
    //   newDaySelected[day] = !isDaySelected;
    // }

    let initialDayTiming = {};
    let initalDayTimingKeys = [];

    if (oneDaySelected) {
      const otherSelectedDay =
        Object.keys(daySelected).filter(
          id => daySelected[id] === true && id !== day
        )[0] || null;

      if (otherSelectedDay !== null) {
        const { timings, timingsKeys } = dayTimings[otherSelectedDay] || {};

        for (let index = 0; index < timingsKeys.length; index++) {
          const key = timingsKeys[index];
          const { startTime, endTime } = timings[key];

          const newKey = uuid();
          initialDayTiming[newKey] = { startTime, endTime };
          initalDayTimingKeys.push(newKey);
        }
      }
    } else {
      const newKey = uuid();
      initialDayTiming[newKey] = { startTime: "", endTime: "" };
      initalDayTimingKeys.push(newKey);
    }

    newDayTimings[day].timings = initialDayTiming;
    newDayTimings[day].timingsKeys = initalDayTimingKeys;

    newDaySelected[day] = !isDaySelected;
    const flag = newDaySelected[day];
    if (!flag) {
      let removedDayTiming = {};
      let removedDayTimingKeys = [];
      const newKey = uuid();
      removedDayTiming[newKey] = { startTime: "", endTime: "" };
      removedDayTimingKeys.push(newKey);
      newDayTimings[day].timings = removedDayTiming;
      newDayTimings[day].timingsKeys = removedDayTimingKeys;
    }

    // let key = uuid();
    // let dayTiming = {};
    // dayTiming[key] = { startTime: "", endTime: "" };
    // let dayTimingKeys = [key];
    // dayTimings[day].timings = dayTiming;
    // dayTimings[day].timingsKeys = dayTimingKeys;
    // console.log("1987371823 toggleDaySelected", {
    //   daySelected: newDaySelected,
    //   dayTimings,
    // });
    if (this.checkAnyDaySelected(newDaySelected) === 0) {
      this.setState({ oneDaySelected: false });
    }

    this.setState({ daySelected: newDaySelected, dayTimings: newDayTimings });
  };

  checkAnyDaySelected = days => {
    return Object.values(days).filter(day => day === true).length;
  };

  addDayTimings = day => () => {
    let key1 = uuid();
    let { dayTimings = {} } = this.state;
    let newDayTimings = dayTimings;

    let newTimings = newDayTimings[day].timings;
    newDayTimings[day].timingsKeys.push(key1);

    if (newDayTimings[day].timingsKeys.length > 2) {
      newTimings[key1] = {
        startTime: moment().add(
          newDayTimings[day].timingsKeys.length - 1,
          "hours"
        ),
        endTime: moment().add(newDayTimings[day].timingsKeys.length, "hours")
      };
    } else {
      newTimings[key1] = {
        startTime: moment().add(1, "hours"),
        endTime: moment().add(2, "hours")
      };
    }
    newDayTimings[day].timings = newTimings;
    this.setState({ dayTimings: newDayTimings });
  };

  deleteDayTimings = (day, key) => () => {
    let { dayTimings = {} } = this.state;
    let newDayTimings = dayTimings;
    let newTimings = newDayTimings[day].timings;
    delete newTimings[key];
    newDayTimings[day].timings = newTimings;
    newDayTimings[day].timingsKeys.splice(
      newDayTimings[day].timingsKeys.indexOf(key),
      1
    );
    this.setState({ dayTimings: newDayTimings });
  };

  handleTimeSelect = ({ day, key, type }) => time => {
    const { dayTimings = {} } = this.state;
    let specificDayTiming = { ...dayTimings } || {};
    const { timings = {} } = dayTimings[day] || {};

    let { startTime = "", endTime = "" } = timings[key] || {};

    const { hour24, minute } = time || {};
    if (type === START_TIME) {
      startTime = moment()
        .hour(hour24)
        .minute(minute);
      endTime = moment()
        .hour(hour24)
        .minute(minute)
        .add(30, "minutes");
    } else {
      if (startTime) {
        const timeDifference = moment(startTime).diff(
          moment()
            .hour(hour24)
            .minute(minute),
          "minute"
        );
        if (timeDifference > 0) {
          message.warn("End time cannot be before start time of the clinic");
          endTime = null;
          // endTime = moment(startTime).add(30,"minutes");
        } else {
          endTime = moment()
            .hour(hour24)
            .minute(minute);
        }
      } else {
        endTime = moment()
          .hour(hour24)
          .minute(minute);
      }
    }

    const updatedTimings = {
      ...timings,
      [key]: {
        startTime,
        endTime
      }
    };
    specificDayTiming[day].timings = updatedTimings;
    this.setState({ dayTimings: specificDayTiming });
  };

  getTimePicker = ({ day, key, type }) => {
    const { dayTimings = {} } = this.state;
    const { handleTimeSelect } = this;

    const { timings } = dayTimings[day] || {};

    let timeValue = null;
    if (type === START_TIME) {
      timeValue = timings[key].startTime;
    } else {
      timeValue = timings[key].endTime;
    }
    return (
      <TimeKeeper
        time={
          timeValue ? timeValue.format("hh:mm A") : moment().format("hh:mm A")
        }
        switchToMinuteOnHourSelect={true}
        closeOnMinuteSelect={true}
        onChange={handleTimeSelect({ day, key, type })}
        // onDoneClick={doneBtn}
        doneButton={null}
        coarseMinutes={15}
      />
    );
  };

  getStartTime = ({ day, key }) => {
    const { dayTimings = {} } = this.state;
    const { timings = {} } = dayTimings[day] || {};

    const { startTime = null } = timings[key] || {};

    if (!startTime) {
      let { dayTimings = {} } = this.state;
      let newDayTimings = dayTimings;
      let newTimings = newDayTimings[day].timings;
      newTimings[key] = {
        startTime: moment(),
        endTime: moment().add(1, "hour")
      };
      newDayTimings[day].timings = newTimings;
      this.setState({ dayTimings: newDayTimings });
    }
    return startTime
      ? moment(startTime).format("hh:mm A")
      : moment().format("hh:mm A");
  };

  getEndTime = ({ day, key }) => {
    const { dayTimings = {} } = this.state;
    const { timings = {} } = dayTimings[day] || {};

    const { endTime, startTime } = timings[key] || {};
    if (endTime) {
      return moment(endTime).format("hh:mm A");
    }
  };

  renderTiming = () => {
    let { daySelected = {}, dayTimings = {} } = this.state;
    const { getTimePicker, getStartTime, getEndTime } = this;

    console.log("12873891273 daySelected", { daySelected });
    return (
      <div className="flex direction-column wp100">
        {Object.keys(daySelected).map(day => {
          const { timingsKeys = [], timings = {} } = dayTimings[day];

          return (
            <div className="flex direction-column wp100 pt8 pb8">
              <div className="flex justify-space-between wp100 mb8 mt4">
                <div className="flex">
                  <Checkbox
                    checked={daySelected[day]}
                    onChange={this.toggleDaySelected(day)}
                  />
                  <div className="ml10 fs16 fw700">{day}</div>
                </div>
                {daySelected[day] && (
                  <div
                    className="pointer fs14 medium theme-green"
                    onClick={this.addDayTimings(day)}
                  >
                    {this.formatMessage(messages.addMore)}
                  </div>
                )}
              </div>
              {daySelected[day] && (
                <div className="flex direction-column wp100">
                  {timingsKeys.map((tKey, index) => {
                    // let minutesToAdd = 30 - (moment().minutes()) % 30;

                    return (
                      <div key={tKey} className="flex mb10">
                        <div className="flex direction-column flex-grow-1 mr24">
                          <div className="fs14 mt8 mb8 ">
                            {this.formatMessage(messages.startTime)}
                          </div>
                          <Dropdown
                            overlay={getTimePicker({
                              day,
                              key: tKey,
                              type: START_TIME
                            })}
                          >
                            <div className="p10 br-brown-grey br5 wp100 h50 flex align-center justify-space-between pointer">
                              <div>{getStartTime({ day, key: tKey })}</div>
                              <ClockCircleOutlined />
                            </div>
                          </Dropdown>
                        </div>
                        <div className="flex direction-row align-center flex-grow-1">
                          <div className="flex direction-column wp100">
                            <div className="flex wp100 align-center justify-space-between fs14 mt8 mb8">
                              {this.formatMessage(messages.endTime)}{" "}
                              {index > 0 && (
                                <Icon
                                  className="ml10"
                                  type="minus-circle-o"
                                  onClick={this.deleteDayTimings(day, tKey)}
                                />
                              )}
                            </div>
                            <Dropdown
                              overlay={getTimePicker({
                                day,
                                key: tKey,
                                type: END_TIME
                              })}
                            >
                              <div className="p10 br-brown-grey br5 wp100 h50 flex align-center justify-space-between pointer">
                                <div>{getEndTime({ day, key: tKey })}</div>
                                <ClockCircleOutlined />
                              </div>
                            </Dropdown>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  setDayStartTime = (day, key) => time => {
    let { dayTimings = {} } = this.state;
    let newDayTimings = dayTimings;
    let { timings = {} } = newDayTimings[day];
    let wrongHours = false;

    if (time) {
      for (let tkey in timings) {
        if (tkey.localeCompare(key)) {
          let { startTime = "", endTime = "" } = timings[tkey];
          if (startTime && endTime) {
            let newEndTime = moment(time).add("minutes", 30);

            if (
              (time.isAfter(moment(startTime)) &&
                time.isBefore(moment(endTime))) ||
              (newEndTime.isAfter(moment(startTime)) &&
                newEndTime.isBefore(moment(endTime))) ||
              moment(time).isSame(moment(startTime)) ||
              moment(time).isSame(moment(endTime)) ||
              moment(newEndTime).isSame(moment(startTime)) ||
              moment(newEndTime).isSame(
                moment(endTime) ||
                  (time.isBefore(moment(startTime)) &&
                    newEndTime.isBefore(moment(endTime)) &&
                    newEndTime.isBefore(moment(startTime))) ||
                  (time.isAfter(moment(startTime)) &&
                    time.isBefore(moment(endTime)) &&
                    newEndTime.isAfter(moment(endTime)))
              )
            ) {
              wrongHours = true;
            }
          }
        }
      }
    }
    if (!wrongHours) {
      timings[key].startTime = time;
      timings[key].endTime = time ? moment(time).add("minutes", 30) : "";
      newDayTimings[day].timings = timings;
      this.setState({ clinics: newDayTimings });
    } else {
      message.error(this.formatMessage(messages.timeClashing));
    }
  };

  setDayEndTime = (day, key) => time => {
    let { dayTimings = {} } = this.state;
    let newDayTimings = dayTimings;
    let { timings = {} } = newDayTimings[day];
    let { startTime = "" } = timings[key];
    let validEndTime = true;

    let wrongHours = false;
    if (time) {
      validEndTime = moment(time).isAfter(startTime);
      for (let tkey in timings) {
        if (tkey.localeCompare(key)) {
          let { startTime = "", endTime = "" } = timings[tkey];
          if (startTime && endTime) {
            if (
              (time.isAfter(moment(startTime)) &&
                time.isBefore(moment(endTime))) ||
              moment(time).isSame(moment(startTime)) ||
              moment(time).isSame(moment(endTime)) ||
              (time.isBefore(moment(startTime)) &&
                time.isAfter(moment(endTime)))
            ) {
              wrongHours = true;
            }
          }
        }
      }
    }
    if (validEndTime && !wrongHours) {
      timings[key].endTime = time;
      newDayTimings[day].timings = timings;
      this.setState({ dayTimings: newDayTimings });
    } else {
      message.error(this.formatMessage(messages.timeClashing));
    }
  };

  handleSave = () => {
    let { dayTimings = {}, daySelected = {} } = this.state;

    for (let day of Object.keys(dayTimings)) {
      let { timings: newTimings = {} } = dayTimings[day];
      for (let time of Object.keys(newTimings)) {
        if (newTimings[time].startTime == null) {
          message.error(this.formatMessage(messages.startTimingEmpty));
          return;
        } else if (newTimings[time].endTime == null) {
          message.error(this.formatMessage(messages.endTimingEmpty));
          return;
        }
      }
      dayTimings[day] = Object.values(newTimings);
      delete dayTimings[day].timingsKeys;
    }
    let { handleOk } = this.props;
    handleOk(dayTimings, daySelected);
    // this.setState({ ...Initial_State });
  };

  handleChange = address => {
    this.setState({ address });
  };

  handleClose = () => {
    const { handleCancel } = this.props;

    handleCancel();
    // this.setState({ ...Initial_State });
  };

  handleChangeAddress = address => {
    this.setState({ address });
  };

  handleSelect = address => {
    this.setState({ address });
  };

  render() {
    const { visible } = this.props;
    return (
      <Modal
        visible={visible}
        title={this.formatMessage(messages.clinicTimings)}
        onCancel={this.handleClose}
        destroyOnClose={true}
        // onOk={this.handleSave}
        footer={[
          <Button key="back" onClick={this.handleClose}>
            {this.formatMessage(messages.return)}
          </Button>,
          <Button key="submit" type="primary" onClick={this.handleSave}>
            {this.formatMessage(messages.submit)}
          </Button>
        ]}
      >
        <div className="location-container">{this.renderTiming()}</div>
      </Modal>
    );
  }
}

export default injectIntl(TimingModal);
