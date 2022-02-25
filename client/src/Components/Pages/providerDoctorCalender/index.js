import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";

import { Calendar, message, Drawer, Icon } from "antd";
import moment from "moment";
import {
  APPOINTMENT_TYPE_TITLE,
  TABLE_DEFAULT_BLANK_FIELD,
  USER_CATEGORY,
} from "../../../constant";
import messages from "./messages";
import { InfoCircleOutlined } from "@ant-design/icons";
import Tooltip from "antd/es/tooltip";

const MODE = {
  MONTH: "m",
  DAY: "d",
};

const PANEL = {
  YEAR: "year",
  MONTH: "month",
};

class ProviderDoctorCalneder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: MODE.MONTH,
      currentDateSelected: "",
      isDateDataVisible: false,
      panelSelected: PANEL.MONTH,
      panelMonth: "",
    };
  }

  componentDidMount() {
    const { getCalenderDataCountForDay, getCalenderDataForDay } = this.props;
    let ISOdate = moment().toISOString();
    const { mode = MODE.MONTH } = this.state;
    const month = moment().format("M");
    this.setState({ panelMonth: month });
    this.handleGetDayData(ISOdate, mode);
  }

  handleGetDayData = (ISOdate, type = MODE.MONTH) => {
    try {
      const {
        getCalenderDataForDay,
        getDoctorsCalenderDataForDay,
        authenticated_category,
      } = this.props;
      // AKSHAY NEW CODE IMPLEMENTATION
      if (authenticated_category === USER_CATEGORY.PROVIDER) {
        getCalenderDataForDay(ISOdate, type).then((response) => {
          const { status, payload: { data, message } = {} } = response;
        });
      } else {
        getDoctorsCalenderDataForDay(ISOdate, type).then((response) => {
          const { status, payload: { data, message } = {} } = response;
        });
      }
    } catch (error) {
      console.log("err --->", error);
      message.warn("Something went wrong");
    }
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  getListData = (appointmentIds = []) => {
    const { appointments = {}, doctors = {}, patients = {} } = this.props;
    let listData = [];
    let count = 0;

    for (let id of appointmentIds) {
      const {
        basic_info: {
          details: {
            critical = false,
            reason = "",
            type = "1",
            type_description = "",
          } = {},
          start_date = "",
          start_time = "",
          end_date = "",
          end_time = "",
        } = {},
        participant_one: { id: p1_id = "", category: p1_category = "" } = {},
        participant_two: { id: p2_id = "", category: p2_category = "" },
      } = appointments[id] || {};

      let doctor_name = "";
      let patient_name = "";
      if (p1_category === "doctor") {
        let {
          basic_info: {
            first_name: doctor_first_name = "",
            middle_name: doctor_middle_name = "",
            last_name: doctor_last_name = "",
          } = {},
        } = doctors[p1_id] || {};
        let {
          basic_info: {
            first_name: patient_first_name = "",
            middle_name: patient_middle_name = "",
            last_name: patient_last_name = "",
          } = {},
        } = patients[p2_id] || {};
        doctor_name = doctor_first_name
          ? `${doctor_first_name} ${
              doctor_middle_name ? `${doctor_middle_name} ` : ""
            }${doctor_last_name ? `${doctor_last_name} ` : ""}`
          : "";
        patient_name = patient_first_name
          ? `${patient_first_name} ${
              patient_middle_name ? `${patient_middle_name} ` : ""
            }${patient_last_name ? `${patient_last_name} ` : ""}`
          : "";
      } else {
        let {
          basic_info: {
            first_name: doctor_first_name = "",
            middle_name: doctor_middle_name = "",
            last_name: doctor_last_name = "",
          } = {},
        } = doctors[p2_id] || {};
        let {
          basic_info: {
            first_name: patient_first_name = "",
            middle_name: patient_middle_name = "",
            last_name: patient_last_name = "",
          } = {},
        } = patients[p1_id] || {};
        doctor_name = doctor_first_name
          ? `${doctor_first_name} ${
              doctor_middle_name ? `${doctor_middle_name} ` : ""
            }${doctor_last_name ? `${doctor_last_name} ` : ""}`
          : "";
        patient_name = patient_first_name
          ? `${patient_first_name} ${
              patient_middle_name ? `${patient_middle_name} ` : ""
            }${patient_last_name ? `${patient_last_name} ` : ""}`
          : "";
      }
      let time = start_time ? moment(start_time).format("hh:mm A") : "--";

      if (count === 2) {
        listData.push(
          <div
            key={`${id}-record`}
            className="wp50  tal fs12 fw700  pt4 pb4 tab-color mt5"
          >
            <span>+ {appointmentIds.length - count}</span>{" "}
            <span>{this.formatMessage(messages.more)}</span>
          </div>
        );
        break;
      }

      count += 1;

      listData.push(
        <div
          key={`${id}-record`}
          className={`br15 tac fs12 fw700 bg-blue pt4 pb4 white ${
            count === 1 ? null : `mt5`
          }`}
        >
          <span>{time}</span>
          {" - "}
          <span>{patient_name}</span>
        </div>
      );
    }

    return listData;
  };

  dateCellRender = (value) => {
    const { date_wise_appointments = {} } = this.props;
    const currentDate = moment(value).utcOffset(0).startOf("day").toISOString();

    if (date_wise_appointments[currentDate]) {
      const appointmentIds = date_wise_appointments[currentDate] || [];
      const listData = this.getListData(appointmentIds);
      return listData;
    } else {
      return null;
    }
  };

  monthCellRender = (value) => {
    const { getCalenderDataForDay } = this.props;
    const ISOdate = moment(value).toISOString();
  };

  onPanelChange = (value, mode) => {
    const panelDate = moment(value).utcOffset(0).startOf("day").toISOString();

    if (mode === PANEL.MONTH) {
      const check = moment(value, "YYYY/MM/DD");
      const panelMonth = check.format("M");

      const type = MODE.MONTH;
      this.handleGetDayData(panelDate, type);
      this.setState({
        panelSelected: PANEL.MONTH,
        panelMonth,
      });
    } else {
      const check = moment(value, "YYYY/MM/DD");
      const panelMonth = check.format("M");
      this.setState({
        panelSelected: PANEL.YEAR,
        panelMonth,
      });
    }
  };

  onSelect = (value) => {
    const { panelSelected = PANEL.MONTH } = this.state;
    if (panelSelected === PANEL.MONTH) {
      const selectedDate = moment(value)
        .utcOffset(0)
        .startOf("day")
        .toISOString();

      this.setState({
        currentDateSelected: selectedDate,
        isDateDataVisible: true,
      });
    } else {
      this.setState({
        currentDateSelected: "",
        isDateDataVisible: false,
        panelSelected: PANEL.MONTH,
      });
    }
  };

  close = () => {
    this.setState({
      isDateDataVisible: false,
      currentDateSelected: "",
    });
  };

  // AKSHAY NEW CODE IMPLEMENTATION

  openPatientDetails = (patientId) => {
    const { history, authenticated_category } = this.props;
    if (authenticated_category === "doctor") {
      history.push(`/patients/${patientId}`);
    }
  };

  renderDateDetails = () => {
    const { currentDateSelected = "" } = this.state;

    let details = [];
    const {
      appointments = {},
      date_wise_appointments = {},
      doctors = {},
      patients = {},
      users = {},
      authenticated_category = {},
    } = this.props || {};

    const thisDaysAppointments =
      date_wise_appointments[currentDateSelected] || [];

    for (let each of thisDaysAppointments) {
      const {
        basic_info: {
          details: {
            critical = false,
            reason = "",
            type = "1",
            type_description = "",
          } = {},
          start_date = "",
          start_time = "",
          end_date = "",
          end_time = "",
        } = {},
        participant_one: { id: p1_id = "", category: p1_category = "" } = {},
        participant_two: { id: p2_id = "", category: p2_category = "" },
      } = appointments[each] || {};
      let doctor_name = "";
      let patient_name = "";
      if (p1_category === "doctor") {
        let {
          basic_info: {
            first_name: doctor_first_name = "",
            middle_name: doctor_middle_name = "",
            last_name: doctor_last_name = "",
          } = {},
        } = doctors[p1_id] || {};
        let {
          basic_info: {
            first_name: patient_first_name = "",
            middle_name: patient_middle_name = "",
            last_name: patient_last_name = "",
          } = {},
        } = patients[p2_id] || {};
        doctor_name = doctor_first_name
          ? `${doctor_first_name} ${
              doctor_middle_name ? `${doctor_middle_name} ` : ""
            }${doctor_last_name ? `${doctor_last_name} ` : ""}`
          : "";
        patient_name = patient_first_name
          ? `${patient_first_name} ${
              patient_middle_name ? `${patient_middle_name} ` : ""
            }${patient_last_name ? `${patient_last_name} ` : ""}`
          : "";
      } else {
        let {
          basic_info: {
            first_name: doctor_first_name = "",
            middle_name: doctor_middle_name = "",
            last_name: doctor_last_name = "",
          } = {},
        } = doctors[p2_id] || {};
        let {
          basic_info: {
            first_name: patient_first_name = "",
            middle_name: patient_middle_name = "",
            last_name: patient_last_name = "",
          } = {},
        } = patients[p1_id] || {};
        doctor_name = doctor_first_name
          ? `${doctor_first_name} ${
              doctor_middle_name ? `${doctor_middle_name} ` : ""
            }${doctor_last_name ? `${doctor_last_name} ` : ""}`
          : "";
        patient_name = patient_first_name
          ? `${patient_first_name} ${
              patient_middle_name ? `${patient_middle_name} ` : ""
            }${patient_last_name ? `${patient_last_name} ` : ""}`
          : "";
      }

      //   let time =start_time ? moment(start_time).format('hh:mm A'): '--';
      let time = `${
        start_time ? moment(start_time).format("LT") : TABLE_DEFAULT_BLANK_FIELD
      } - ${
        end_time ? moment(end_time).format("LT") : TABLE_DEFAULT_BLANK_FIELD
      }`;

      let date = start_date ? moment(start_date).format("Do MMM YYYY") : "--";

      const appointment_type = APPOINTMENT_TYPE_TITLE[type];
      const title = appointment_type["title"];

      details.push(
        <div
          key={`${each}-appointment`}
          onClick={() =>
            this.openPatientDetails(p1_category === "doctor" ? p2_id : p1_id)
          }
          className={
            authenticated_category === "doctor"
              ? "relative wp90 br5 bg-white flex-shrink-0 mt20 mb20 p10  ml10 mr10 chart-box-shadow doctor-hover-card flex direction-column"
              : "relative wp90 br5 bg-white flex-shrink-0 mt20 mb20 p10  ml10 mr10 chart-box-shadow flex direction-column"
          }
          title="Redirected to patient details page"
        >
          <div className="absolute r10">
            {critical ? (
              <Tooltip
                align={"top"}
                title={this.formatMessage(messages.critical)}
              >
                <InfoCircleOutlined className="pointer red fs18 " />
              </Tooltip>
            ) : null}
          </div>
          <div className="flex direction-row align-start justify-space-between mt10 mb10 ml10 mr20">
            <div className="fs14 fw700 brown-grey">
              {this.formatMessage(messages.doctor_name)}
            </div>
            <div className=" fs14 fw700 black-85 ml20 wp80 tal">{`Dr ${doctor_name}`}</div>
          </div>

          <div className="flex direction-row align-start justify-space-between mt10 mb10 ml10 mr20">
            <div className="fs14 fw700 brown-grey">
              {this.formatMessage(messages.patient_name)}
            </div>
            <div className=" fs14 fw700 black-85 ml20 wp80 tal">
              {patient_name}
            </div>
          </div>

          <div className="flex direction-row align-start justify-space-between mt10 mb10 ml10 mr20">
            <div className="fs14 fw700 brown-grey">
              {this.formatMessage(messages.appointment_desc)}
            </div>
            <div className="fs14 fw700 black-85 ml20 wp80 tal">
              {title} {`(${type_description})`}
            </div>
          </div>

          <div className="flex direction-row align-start justify-space-between mt10 mb10 ml10 mr20">
            <div className="fs14 fw700 brown-grey">
              {this.formatMessage(messages.reason)}
            </div>
            <div className="fs14 fw700 black-85 ml20 wp80 tal">{reason}</div>
          </div>

          <div className="flex direction-row align-start justify-space-between mt10 mb10 ml10 mr20">
            <div className="fs14 fw700 brown-grey">
              {this.formatMessage(messages.appointment_time)}
            </div>
            <div className="fs14 fw700 black-85 ml20 wp80 tal">{time}</div>
          </div>

          <div className="flex direction-row align-start  justify-space-between mt10 mb10 ml10 mr20">
            <div className="fs14 fw700 brown-grey">
              {this.formatMessage(messages.appointment_date)}
            </div>
            <div className="fs14 fw700 black-85 ml20 wp80 tal">{date}</div>
          </div>
        </div>
      );
    }

    return details;
  };

  render() {
    const {
      isDateDataVisible = false,
      //  mode = MODE.MONTH
      panelSelected = PANEL.YEAR,
      panelMonth,
    } = this.state;

    console.log("987432846723894023987487 RENDEr ------>", { panelMonth });
    return (
      <Fragment>
        <div className="p18 fs30 fw700 ">Schedules</div>
        <div className="wp100 flex direction-column">
          <Calendar
            dateCellRender={this.dateCellRender}
            monthCellRender={this.monthCellRender}
            onPanelChange={this.onPanelChange}
            onSelect={this.onSelect}
            mode={panelSelected}
            disabledDate={(current) => {
              const check = moment(current, "YYYY/MM/DD");
              const currentMonth = check.format("M");
              return (
                current &&
                currentMonth !== panelMonth &&
                panelSelected === PANEL.MONTH
              );
            }}
          />
        </div>
        <Drawer
          title={this.formatMessage(messages.appointment_header)}
          placement="right"
          maskClosable={true}
          headerStyle={{
            position: "sticky",
            zIndex: "9999",
            top: "0px",
          }}
          onClose={this.close}
          visible={isDateDataVisible}
          width={"35%"}
        >
          {this.renderDateDetails()}
        </Drawer>
      </Fragment>
    );
  }
}

export default injectIntl(ProviderDoctorCalneder);
