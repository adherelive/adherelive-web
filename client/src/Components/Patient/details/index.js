import React, { Component } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import message from "./message";
import edit_image from "../../../Assets/images/edit.svg";
import chat_image from "../../../Assets/images/chat.svg";
import { SEVERITY_STATUS, MEDICINE_TYPE } from "../../../constant";
import { Tabs, Table, Divider, Tag, Button, Menu, Dropdown, Spin } from "antd";

import {MailOutlined, PhoneOutlined} from "@ant-design/icons";
import moment from "moment";
import AddMedicationReminder from "../../../Containers/Drawer/addMedicationReminder";
import AddAppointmentDrawer from "../../../Containers/Drawer/addAppointment";
import userDp from "../../../Assets/images/ico-placeholder-userdp.svg";

import TabletIcon from "../../../Assets/images/tabletIcon3x.png";
import InjectionIcon from "../../../Assets/images/injectionIcon3x.png";

const { TabPane } = Tabs;

const APPOINTMENT = "appointment";

function callback(key) {
  console.log(key);
}

// const menu = (
//   <Menu>
//     <Menu.Item>
//       <a target="_blank" rel="noopener noreferrer" href="http://www.google.com/">
//         Medication
//       </a>
//     </Menu.Item>
//     <Menu.Item>
//       <a target="_blank" rel="noopener noreferrer" href="http://www.google.com/">
//         Appointments
//       </a>
//     </Menu.Item>
//     <Menu.Item>
//       <a target="_blank" rel="noopener noreferrer" href="http://www.google.com/">
//         Actions
//       </a>
//     </Menu.Item>
//   </Menu>
// );

const columns_symptoms = [
  {
    title: "Medicine",
    dataIndex: "medicine",
    key: "medicine",
  },
  {
    title: "In take",
    dataIndex: "in_take",
    key: "in_take",
  },
  {
    title: "Duration",
    dataIndex: "duration",
    key: "duration",
  },
];

const columns_medication = [
  {
    title: "Medicine",
    dataIndex: "medicine",
    key: "medicine",
  },
  {
    title: "In take",
    dataIndex: "in_take",
    key: "in_take",
  },
  {
    title: "Duration",
    dataIndex: "duration",
    key: "duration",
  },
  {
    title: "",
    dataIndex: "edit",
    key: "edit",
    render: () => (
      <div className="edit-medication">
        <img src={edit_image} className="edit-medication-icon" />
      </div>
    ),
  },
];

const columns_appointments = [
  {
    title: "Organizer",
    dataIndex: "organizer",
    key: "organizer",
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Timing",
    dataIndex: "time",
    key: "time",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "",
    dataIndex: "edit",
    key: "edit",
    render: () => (
      <div className="edit-medication">
        <img src={edit_image} className="edit-medication-icon" />
      </div>
    ),
  },
];

const data_symptoms = [
  {
    key: "1",
    medicine: "Amoxil 2mg",
    in_take: "Twice, Daily",
    duration: "Till 3rd March",
  },
  {
    key: "2",
    medicine: "Insulin",
    in_take: "Mon at 10am, Wed at 2pm",
    duration: "till 2nd March",
  },
];

const data_medication = [
  {
    key: "1",
    medicine: "Amoxil 2mg",
    in_take: "Twice, Daily",
    duration: "Till 3rd March",
    edit: { edit_image },
  },
  {
    key: "2",
    medicine: "Insulin",
    in_take: "Mon at 10am, Wed at 2pm",
    duration: "till 2nd March",
    edit: { edit_image },
  },
];

const PatientProfileHeader = ({ formatMessage, getMenu }) => {
  return (
    <div className="flex pt20 pr24 pb20 pl24">
      <div className="patient-profile-header flex-grow-0">
        <h3>{formatMessage(message.patient_profile_header)}</h3>
      </div>
      <div className="flex-grow-1 tar">
        <Dropdown
          overlay={getMenu()}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button type="primary">Add</Button>
        </Dropdown>
      </div>
    </div>
  );
};

const PatientCard = ({
  patient_display_picture = userDp,
  patient_first_name = "Patient one",
  patient_middle_name,
  patient_last_name,
  gender = "M",
  patient_age = "--",
  patient_id = "123456",
  patient_phone_number,
  patient_email_id,
  formatMessage,
}) => {
  return (
    <div className="patient-card tac">
      <img
        alt=""
        className="patient-dp mt20 mr0 mb0 ml0"
        src={patient_display_picture}
      />
      <div className="patient-name mt8 mr0 mb0 ml0">
        {patient_first_name} {patient_middle_name} {patient_last_name} ({gender}{" "}
        {patient_age})
      </div>
      <div className="patient-id mt6 mr0 mb0 ml0 ">PID: {patient_id}</div>
      <div className="patient-contact-number mt16 mr0 mb0 ml0 flex direction-row justify-center align-center">
        <PhoneOutlined className="dark-sky-blue mr8"/>
        <div>{patient_phone_number}</div>
      </div>
      <div className="patient-email-id mt8 mr0 mb0 ml0 flex direction-row justify-center align-center">
        <MailOutlined className="dark-sky-blue mr8"/>
        <div>{patient_email_id}</div>
      </div>
      <div className="action-buttons flex">
        <div className="edit-button p10">
          <img className="mr5" src={edit_image} />
          <span>{formatMessage(message.profile_edit)}</span>
        </div>
        <div className="chat-button p10">
          <img className="mr5" src={chat_image} />
          <span>{formatMessage(message.profile_chat)}</span>
        </div>
      </div>
    </div>
  );
};

const PatientTreatmentCard = ({
  formatMessage,
  treatment_name,
  treatment_condition,
  treatment_doctor,
  treatment_start_date,
  treatment_provider,
  treatment_severity_status = "1",
}) => {
  return (
    <div className="treatment mt20">
      <h3>{formatMessage(message.treatment_details)}</h3>
      <div className="treatment-details pl16 pr16">
        <div className="treatment-name flex mt10">
          <div className="w40">{formatMessage(message.treatment_header)}</div>
          <div className="w120 wba tdh">{treatment_name}</div>
        </div>
        <div className="treatment-severity flex mt10">
          <div className="w40">{formatMessage(message.treatment_severity)}</div>
          <div className="w120 wba tdh">
            <div
              className={`severity-label mr4 bg-${SEVERITY_STATUS[treatment_severity_status].color}`}
            ></div>
            {SEVERITY_STATUS[treatment_severity_status].text}
          </div>
        </div>
        <div className="treatment-condition flex mt10">
          <div className="w40">
            {formatMessage(message.treatment_condition)}
          </div>
          <div className="w120 wba tdh">{treatment_condition}</div>
        </div>
        <div className="treatment-doctor flex mt10">
          <div className="w40">{formatMessage(message.treatment_doctor)}</div>
          <div className="w120 wba tdh">{treatment_doctor}</div>
        </div>
        <div className="treatment-start-date flex mt10">
          <div className="w40">
            {formatMessage(message.treatment_start_date)}
          </div>
          <div className="w120 wba">{treatment_start_date}</div>
        </div>
        <div className="treatment-provider flex mt10">
          <div className="w40">{formatMessage(message.treatment_provider)}</div>
          <div className="w120 wba">{treatment_provider}</div>
        </div>
      </div>
    </div>
  );
};

const PatientAlertCard = ({
  formatMessage,
  count,
  new_symptoms_string,
  missed_appointment,
}) => {
  console.log("9838123 ", count, new_symptoms_string, missed_appointment);
  return (
    <div className="patient-alerts pl16 pr16">
      <h3>
        {formatMessage(message.alerts_last_visit)}
        <span className="alerts-count"> ({count})</span>
      </h3>
      <div className="new-symptoms flex mt10">
        <div className="new-symptoms-header w40">
          <div className="symptoms-side mb4"></div>
          {formatMessage(message.new_symptoms_header)}
        </div>
        <div className="new-symptoms-text w60 tdh">{new_symptoms_string}</div>
      </div>
      <div className="missed-appointment flex mt10">
        <div className="missed-appointment-header w40">
          <div className="missed-appointment-side mb4"></div>
          {formatMessage(message.missed_appointment_header)}
        </div>
        <div className="missed-appointment-text w60 tdh">
          {missed_appointment}
        </div>
      </div>
    </div>
  );
};

class PatientDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    const {
      getMedications,
      getAppointments,
      searchMedicine,
      patient_id,
    } = this.props;
    this.getData();
    getMedications(patient_id);
    getAppointments(patient_id);
    searchMedicine("");
  }

  getAppointmentsData = () => {
    const {
      appointments,
      users = {},
      doctors = {},
      patients = {},
    } = this.props;
    return Object.keys(appointments).map((id) => {
      // todo: changes based on care-plan || appointment-repeat-type,  etc.,
      const {
        basic_info: {
          organizer_type = "doctor",
          start_date,
          description,
          start_time,
          end_time,
        } = {},
        organizer: { id: organizer_id } = {},
      } = appointments[id] || {};
      const { basic_info: { user_name = "--" } = {} } =
        users[organizer_id] || {};
      return {
        // organizer: organizer_type === "doctor" ? doctors[organizer_id] : patients[organizer_id].
        key: id,
        organizer: user_name,
        date: `${moment(start_date).format("DD MM YYYY")}`,
        time: `${moment(start_time).format("LT")} - ${moment(end_time)
          .add(1, "hour")
          .format("LT")}`,
        description: description ? description : "--",
      };
    });
  };

  getMedicationData = () => {
    const {
      medications = {},
      users = {},
      doctors = {},
      patients = {},
      medicines = {},
    } = this.props;
    console.log("92834792 ", medications);
    const medicationRows = Object.keys(medications).map((id) => {
      // todo: changes based on care-plan || appointment-repeat-type,  etc.,
      const {
        basic_info: {
          organizer_id,
          organizer_type = "doctor",
          end_date,
          details: { medicine_id, repeat_days, start_time } = {},
        } = {},
      } = medications[id] || {};
      const { basic_info: { user_name = "--" } = {} } =
        users[organizer_id] || {};

      const { basic_info: { name, type } = {} } = medicines[medicine_id] || {};
      return {
        // organizer: organizer_type === "doctor" ? doctors[organizer_id] : patients[organizer_id].
        key: id,
        medicine: (
          <div className="flex direction-row justify-space-around align-center">
            <img
              className="w20 mr10"
              src={type === MEDICINE_TYPE.TABLET ? TabletIcon : InjectionIcon}
              alt="medicine icon"
            />
            <p className="mb0">{name ? `${name}` : "--"}</p>
          </div>
        ),
        in_take: `${repeat_days.join(", ")}`,
        duration: end_date ? `Till ${moment(end_date).format("DD MMMM")}` : "--",
      };
    });

    return medicationRows;
  };

  handleItemSelect = ({ selectedKeys }) => {
    const { history, logout, openAppointmentDrawer } = this.props;
    console.log("12312 handleItemSelect --> ");
    console.log(selectedKeys);
    switch (selectedKeys[0]) {
      case APPOINTMENT:
        console.log("12312 here component");
        openAppointmentDrawer();
      default:
        openAppointmentDrawer();
        break;
    }
    this.setState({ selectedKeys: selectedKeys[0] });
  };

  async getData() {
    setTimeout(() => this.setState({ loading: false }), 2000);
  }

  formatMessage = (data) => this.props.intl.formatMessage(data);

  getMenu = () => {
    const { handleAppointment, handleMedicationReminder } = this;
    console.log("12312 getMenu");
    return (
      <Menu>
        <Menu.Item onClick={handleMedicationReminder}>
          <div>Medication</div>
        </Menu.Item>
        <Menu.Item onClick={handleAppointment}>
          <div>Appointments</div>
        </Menu.Item>
        <Menu.Item>
          <div>Actions</div>
        </Menu.Item>
      </Menu>
    );
  };

  handleAppointment = (e) => {
    // e.preventDefault();
    const { openAppointmentDrawer, patient_id } = this.props;
    openAppointmentDrawer({
      patients: {
        id: patient_id,
        first_name: "test",
        last_name: "patient",
      },
    });
  };

  handleMedicationReminder = (e) => {
    const { openMReminderDrawer, patient_id } = this.props;
    openMReminderDrawer({
      patient_id,
    });
  };

  render() {
    const { patients, patient_id, users, care_plans, doctors } = this.props;
    const { loading } = this.state;
    const {
      formatMessage,
      getMenu,
      getAppointmentsData,
      getMedicationData,
    } = this;

    if (loading) {
      return (
        <div className="page-loader hp100 wp100 flex align-center justify-center ">
          <Spin size="large"></Spin>
        </div>
      );
    }

    // todo: dumm careplan 
    const {basic_info: {name: treatment_name, doctor_id} = {}, activated_on: treatment_start_date} = care_plans[1] || {};

    console.log("192387123762 ", patients, patient_id);

    const {basic_info: {first_name : doctor_first_name, middle_name: doctor_middle_name, last_name: doctor_last_name} = {}} = doctors[doctor_id] || {};


    const {
      basic_info: { first_name, middle_name, last_name, user_id, age },
    } = patients[patient_id] || {};

    const {basic_info: {mobile_number} = {}} = users[user_id] || {};
    const {
      user_details: {
        gender,
        age: patient_age,
        phone_number: patient_phone_number = "--",
        email_id: patient_email_id = "test-patient@mail.com",
        profile_picture: patient_display_picture,
      } = {},
    } = this.props;

    const {
      treatment_details: {
        treatment_severity: treatment_severity_status = "1",
        treatment_provider,
        treatment_condition,
      } = {},
    } = this.props.user_details;

    console.log("2323 ", this.props.user_details);

    const {
      alerts: { count = "1", new_symptoms = [], missed_appointment = "" } = {},
    } = this.props.user_details || {};

    const new_symptoms_string =
      new_symptoms.length > 0 ? new_symptoms.map((e) => e).join(", ") : "";

    console.log("user", count);

    // const patientName="John Doe";

    // const { id = 0 } = this.props;

    console.log("formatMessage", formatMessage);
    return (
      <div className="pt10 pr10 pb10 pl10">
        <PatientProfileHeader formatMessage={formatMessage} getMenu={getMenu} />
        <div className="flex">
          <div className="patient-details flex-grow-0 pt20 pr24 pb20 pl24">
            <PatientCard
              patient_display_picture={patient_display_picture}
              patient_first_name={first_name}
              patient_middle_name={middle_name}
              patient_last_name={last_name}
              gender={gender}
              patient_age={age}
              patient_phone_number={mobile_number}
              patient_email_id={patient_email_id}
              formatMessage={formatMessage}
            />
            <PatientTreatmentCard
              formatMessage={formatMessage}
              treatment_name={treatment_name ? treatment_name : "--"}
              treatment_condition={
                treatment_condition ? treatment_condition : "--"
              }
              treatment_doctor={doctor_first_name ? `${doctor_first_name} ${doctor_middle_name ? `${doctor_middle_name} ` : ""}${doctor_last_name}` : "--"}
              treatment_start_date={
                treatment_start_date ? moment(treatment_start_date).format("Do MMM YYYY") : "--"
              }
              treatment_provider={
                treatment_provider ? treatment_provider : "--"
              }
              treatment_severity_status={
                treatment_severity_status ? treatment_severity_status : "1"
              }
            />
          </div>
          <div className="flex-grow-1 pt20 pr24 pb20 pl24">
            <PatientAlertCard
              formatMessage={formatMessage}
              count={count}
              new_symptoms_string={new_symptoms_string}
              missed_appointment={missed_appointment}
            />
            <div className="patient-tab mt20">
              <Tabs defaultActiveKey="1" onChange={callback}>
                <TabPane tab="Symptoms" key="1">
                  <Table
                    columns={columns_symptoms}
                    dataSource={data_symptoms}
                  />
                </TabPane>
                <TabPane tab="Medication" key="2">
                  <Table
                    columns={columns_medication}
                    dataSource={getMedicationData()}
                  />
                </TabPane>
                <TabPane tab="Appointments" key="3">
                  <Table
                    columns={columns_appointments}
                    dataSource={getAppointmentsData()}
                  />
                </TabPane>
                <TabPane tab="Actions" key="4">
                  Content of Actions Tab
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
        <AddMedicationReminder />
        <AddAppointmentDrawer />
      </div>
    );
  }
}

export default injectIntl(PatientDetails);
