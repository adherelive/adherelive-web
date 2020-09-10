import React, { Component } from "react";
import { injectIntl } from "react-intl";
import messages from "./message";
import edit_image from "../../../Assets/images/edit.svg";
import chat_image from "../../../Assets/images/chat.svg";
import {
  GENDER,
  PERMISSIONS,
  ROOM_ID_TEXT,
  TABLET,
  SYRINGE,
  SYRUP,
  PARTS,
  PART_LIST_BACK,
  PART_LIST_CODES,
  PART_LIST_FRONT,
  BODY
} from "../../../constant";
import { Tabs, Table, Menu, Dropdown, Spin, message, Button } from "antd";

// DRAWERS

// TABLES
import VitalTable from "../../../Containers/Vitals/table";
import AppointmentTable from "../../../Containers/Appointments/table";

import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import moment from "moment";
import AddMedicationReminder from "../../../Containers/Drawer/addMedicationReminder";
import AddVitals from "../../../Containers/Drawer/addVitals";
import AddAppointmentDrawer from "../../../Containers/Drawer/addAppointment";
import EditAppointmentDrawer from "../../../Containers/Drawer/editAppointment";
import EditMedicationReminder from "../../../Containers/Drawer/editMedicationReminder";
import userDp from "../../../Assets/images/ico-placeholder-userdp.svg";
import noMedication from "../../../Assets/images/no_medication@3x.png";
import TemplateDrawer from "../../Drawer/medicationTemplateDrawer";
import SymptomsDrawer from "../../../Containers/Drawer/symptomsDrawer";
import ChatPopup from "../../../Containers/ChatPopup";
import TabletIcon from "../../../Assets/images/tabletIcon3x.png";
import InjectionIcon from "../../../Assets/images/injectionIcon3x.png";
import SyrupIcon from "../../../Assets/images/pharmacy.png";
import { getPatientConsultingVideoUrl } from "../../../Helper/url/patients";
import { getPatientConsultingUrl } from "../../../Helper/url/patients";
import SymptomTabs from "../../../Containers/Symptoms";
// import messages from "../../Dashboard/message";
import config from "../../../config";

const BLANK_TEMPLATE = "Blank Template";
const { TabPane } = Tabs;
const APPOINTMENT = "appointment";

const PATIENT_TABS = {
  ACTIONS: {
    name: "Actions",
    key: "4"
  }
};

function callback(key) {}

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

// const columns_symptoms = [
//   {
//     title: "Medicine",
//     dataIndex: "medicine",
//     key: "medicine",
//   },
//   {
//     title: "In take",
//     dataIndex: "in_take",
//     key: "in_take",
//   },
//   {
//     title: "Duration",
//     dataIndex: "duration",
//     key: "duration",
//   },
// ];

const columns_medication = [
  {
    title: "Medicine",
    dataIndex: "medicine",
    key: "medicine",
    width: "30%",
    ellipsis: true
  },
  {
    title: "In take",
    dataIndex: "in_take",
    key: "in_take"
  },
  {
    title: "Duration",
    dataIndex: "duration",
    key: "duration"
  },
  {
    title: "",
    dataIndex: "edit",
    key: "edit",
    render: () => (
      <div className="edit-medication">
        <img src={edit_image} className="edit-medication-icon" />
      </div>
    )
  }
];

const columns_symptoms = [
  {
    title: "Body Part",
    dataIndex: "body_part",
    key: "body_part",
    width: "30%",
    ellipsis: true
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description"
  }
  // {
  //   title: "",
  //   dataIndex: "edit",
  //   key: "edit",
  //   render: () => (
  //     <div className="edit-medication">
  //       <img src={edit_image} className="edit-medication-icon" />
  //     </div>
  //   ),
  // },
];

const columns_medication_non_editable = [
  {
    title: "Medicine",
    dataIndex: "medicine",
    key: "medicine",
    width: "30%",
    ellipsis: true
  },
  {
    title: "In take",
    dataIndex: "in_take",
    key: "in_take"
  },
  {
    title: "Duration",
    dataIndex: "duration",
    key: "duration"
  }
];

const columns_appointments = [
  {
    title: "Organizer",
    dataIndex: "organizer",
    key: "organizer",
    width: "20%",

    ellipsis: true
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    width: "20%",
    ellipsis: true
  },
  {
    title: "Timing",
    dataIndex: "time",
    key: "time",
    width: "22%"
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    width: "30%",
    ellipsis: true
  },
  {
    title: "",
    dataIndex: "edit",
    key: "edit",
    render: () => (
      <div className="edit-medication">
        <img src={edit_image} className="edit-medication-icon" />
      </div>
    )
  }
];

const columns_appointments_non_editable = [
  {
    title: "Organizer",
    dataIndex: "organizer",
    key: "organizer",
    width: "20%",

    ellipsis: true
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    width: "20%",
    ellipsis: true
  },
  {
    title: "Timing",
    dataIndex: "time",
    key: "time",
    width: "22%"
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    width: "30%",
    ellipsis: true
  }
];

// const data_symptoms = [
//   {
//     key: "1",
//     medicine: "Amoxil 2mg",
//     in_take: "Twice, Daily",
//     duration: "Till 3rd March",
//   },
//   {
//     key: "2",
//     medicine: "Insulin",
//     in_take: "Mon at 10am, Wed at 2pm",
//     duration: "till 2nd March",
//   },
// ];

// const data_medication = [
//   {
//     key: "1",
//     medicine: "Amoxil 2mg",
//     in_take: "Twice, Daily",
//     duration: "Till 3rd March",
//     edit: { edit_image },
//   },
//   {
//     key: "2",
//     medicine: "Insulin",
//     in_take: "Mon at 10am, Wed at 2pm",
//     duration: "till 2nd March",
//     edit: { edit_image },
//   },
// ];

const PatientProfileHeader = ({ formatMessage, getMenu, showAddButton }) => {
  return (
    <div className="flex pt20 pr24 pb20 pl24">
      <div className="patient-profile-header flex-grow-0">
        <div className="fs28 fw700">
          {formatMessage(messages.patient_profile_header)}
        </div>
      </div>
      <div className="flex-grow-1 tar">
        {showAddButton && (
          <Dropdown
            overlay={getMenu()}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button type="primary" className="add-button">
              Add
            </Button>
          </Dropdown>
        )}
      </div>
    </div>
  );
};

const PatientCard = ({
  patient_display_picture = userDp,
  patient_first_name = "Patient one",
  patient_middle_name,
  patient_last_name,
  gender = "m",
  patient_age = "--",
  patient_id = "123456",
  patient_phone_number,
  patient_email_id,
  formatMessage,
  openChat
}) => {
  return (
    <div className="patient-card tac">
      <img
        alt=""
        className="patient-dp mt20 mr0 mb0 ml0"
        src={patient_display_picture}
      />
      <div className="patient-name mt8 mr0 mb0 ml0">
        {patient_first_name} {patient_middle_name} {patient_last_name} (
        {gender ? `${GENDER[gender].view} ` : ""}
        {patient_age})
      </div>
      <div className="patient-id mt6 mr0 mb0 ml0 ">PID: {patient_id}</div>
      <div className="patient-contact-number mt16 mr0 mb0 ml0 flex direction-row justify-center align-center">
        <PhoneOutlined className="dark-sky-blue mr8" />
        <div>{patient_phone_number}</div>
      </div>
      <div className="patient-email-id mt8 mr0 mb0 ml0 flex direction-row justify-center align-center">
        {patient_email_id && <MailOutlined className="dark-sky-blue mr8" />}
        {patient_email_id && <div>{patient_email_id}</div>}
      </div>
      <div className="action-buttons flex">
        <div className="edit-button p10">
          <img className="mr5" src={edit_image} />
          <span>{formatMessage(messages.profile_edit)}</span>
        </div>
        <div className="chat-button p10" onClick={openChat}>
          <img className="mr5" src={chat_image} />
          <span>{formatMessage(messages.profile_chat)}</span>
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
  treatment_severity_status = "1"
}) => {
  return (
    <div className="treatment mt20">
      <h3>{formatMessage(messages.treatment_details)}</h3>
      <div className="treatment-details pl16 pr16">
        <div className="treatment-name flex mt10">
          <div className="wp40">{formatMessage(messages.treatment_header)}</div>
          <div className="w120 wba tdh">{treatment_name}</div>
        </div>
        <div className="treatment-severity flex mt10">
          <div className="wp40">
            {formatMessage(messages.treatment_severity)}
          </div>
          <div className="w120 wba tdh">
            {/* <div
              className={`severity-label mr4 bg-${SEVERITY_STATUS[treatment_severity_status].color}`}
            ></div> */}
            {/* {SEVERITY_STATUS[treatment_severity_status].text} */}
            {treatment_severity_status}
          </div>
        </div>
        <div className="treatment-condition flex mt10">
          <div className="wp40">
            {formatMessage(messages.treatment_condition)}
          </div>
          <div className="w120 wba tdh">{treatment_condition}</div>
        </div>
        <div className="treatment-doctor flex mt10">
          <div className="wp40">{formatMessage(messages.treatment_doctor)}</div>
          <div className="w120 wba tdh">{treatment_doctor}</div>
        </div>
        <div className="treatment-start-date flex mt10">
          <div className="wp40">
            {formatMessage(messages.treatment_start_date)}
          </div>
          <div className="w120 wba">{treatment_start_date}</div>
        </div>
        <div className="treatment-provider flex mt10">
          <div className="wp40">
            {formatMessage(messages.treatment_provider)}
          </div>
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
  missed_appointment
}) => {
  return (
    <div className="patient-alerts pl16 pr16">
      <h3>
        {formatMessage(messages.alerts_last_visit)}
        <span className="alerts-count"> ({count})</span>
      </h3>
      <div className="new-symptoms flex mt10">
        <div className="new-symptoms-header w40">
          <div className="symptoms-side mb4"></div>
          {formatMessage(messages.new_symptoms_header)}
        </div>
        <div className="new-symptoms-text w60 tdh">{new_symptoms_string}</div>
      </div>
      <div className="missed-appointment flex mt10">
        <div className="missed-appointment-header w40">
          <div className="missed-appointment-side mb4"></div>
          {formatMessage(messages.missed_appointment_header)}
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
      templateDrawerVisible: false,
      carePlanTemplateExists: false,
      carePlanTemplateIds: [],
      symptoms: [
        { body_part: PARTS.HEAD, description: "werwerewrwer" },
        { body_part: PARTS.CHEST, description: "342342352343" }
      ]
    };
  }

  componentDidMount() {
    let {
      getMedications,
      getAppointments,
      getPatientCarePlanDetails,
      getAppointmentsDetails,
      patient_id,
      care_plans,
      authenticated_user,
      closePopUp,
      fetchChatAccessToken,
      currentCarePlanId,
      show_template_drawer = {}
    } = this.props;
    this.getData();
    const { show: showTd = false } = show_template_drawer;
    // let isCarePlanDataPresent = currentCarePlanId ? true : false;
    if (showTd) {
      this.setState({ templateDrawerVisible: true });
    }

    fetchChatAccessToken(authenticated_user);
    if (!showTd) {
      getPatientCarePlanDetails(patient_id).then(response => {
        let { status = false, payload = {} } = response;
        if (status) {
          let {
            data: {
              show = false,
              care_plan_templates = {},
              care_plan_template_ids = []
            } = {}
          } = payload;

          // const { basic_info: { id: carePlanTemplateId = 0 } } = care_plan_templates[Object.keys(care_plan_templates)[0]];

          let carePlanTemplateExists =
            care_plan_templates && Object.values(care_plan_templates).length
              ? true
              : false;

          this.setState({ carePlanTemplateId, carePlanTemplateExists });
        }
      });
      getMedications(patient_id);
      getAppointmentsDetails();
      getAppointments(patient_id);
    }
    // searchMedicine("");
    let carePlanTemplateId = 0;
    for (let carePlan of Object.values(care_plans)) {
      let {
        basic_info: { patient_id: patientId = 1 }
      } = carePlan;

      if (parseInt(patient_id) === parseInt(patientId)) {
        let { basic_info: { care_plan_template_id = 0 } = {} } = carePlan;
        carePlanTemplateId = care_plan_template_id;
      }
    }
    this.setState({ carePlanTemplateId });
  }

  getAppointmentsData = (carePlan = {}, docName = "--") => {
    const {
      appointments,
      users = {}
      // doctors = {},
      // patients = {},
    } = this.props;

    let { appointment_ids = [] } = carePlan;
    let formattedAppointments = appointment_ids.map(id => {
      // todo: changes based on care-plan || appointment-repeat-type,  etc.,
      const {
        basic_info: {
          // organizer_type = "doctor",
          start_date,
          start_time,
          end_time,
          description = ""
        } = {},
        organizer: { id: organizer_id } = {}
      } = appointments[id] || {};
      const { basic_info: { user_name = "" } = {} } = users[organizer_id] || {};
      return {
        // organizer: organizer_type === "doctor" ? doctors[organizer_id] : patients[organizer_id].
        key: id,
        organizer: user_name ? user_name : docName,
        date: `${moment(start_date).format("LL")}`,
        time: `${moment(start_time).format("LT")} - ${moment(end_time).format(
          "LT"
        )}`,
        description: description ? description : "--"
      };
    });
    formattedAppointments.sort(function(a, b) {
      var dateA = new Date(a.date),
        dateB = new Date(b.date);
      return dateA - dateB;
    });
    return formattedAppointments;
  };

  getSymptomsData = (symptoms = {}) => {
    const {
      appointments,
      users = {}
      // doctors = {},
      // patients = {},
    } = this.props;

    let formattedSymptoms = Object.values(symptoms).map((symptom, index) => {
      // todo: changes based on care-plan || appointment-repeat-type,  etc.,
      const {
        text = "",
        config: { side = "1", parts = [] } = {},
        image_document_ids = [],
        audio_document_ids = []
      } = symptom || {};
      return {
        // organizer: organizer_type === "doctor" ? doctors[organizer_id] : patients[organizer_id].
        side: side,
        key: index,
        body_part_key: parts[0] ? parts[0] : "",
        body_part: parts[0] ? this.getBodyPartName(parts[0]) : "--",
        description: text,
        image_document_ids,
        audio_document_ids
      };
    });
    return formattedSymptoms;
  };

  getMedicationData = (carePlan = {}) => {
    const {
      medications = {},
      // users = {},
      medicines = {}
    } = this.props;

    let { medication_ids = [] } = carePlan;
    const medicationRows = medication_ids.map(id => {
      // todo: changes based on care-plan || appointment-repeat-type,  etc.,

      const {
        basic_info: {
          // organizer_id,
          // organizer_type = "doctor",
          end_date,
          details: { medicine_id, repeat_days, medicine_type = "1" } = {}
        } = {}
      } = medications[id] || {};

      const { basic_info: { name, type } = {} } = medicines[medicine_id] || {};
      return {
        // organizer: organizer_type === "doctor" ? doctors[organizer_id] : patients[organizer_id].
        key: id,
        medicine: (
          <div className="flex direction-row justify-space-around align-center">
            <img
              className="w20 mr10"
              src={
                medicine_type === TABLET
                  ? TabletIcon
                  : medicine_type === SYRUP
                  ? SyrupIcon
                  : InjectionIcon
              }
              alt="medicine icon"
            />
            <p className="mb0">{name ? `${name}` : "--"}</p>
          </div>
        ),
        in_take: `${repeat_days ? repeat_days.join(", ") : "--"}`,
        duration: end_date ? `Till ${moment(end_date).format("DD MMMM")}` : "--"
      };
    });

    return medicationRows;
  };

  handleItemSelect = ({ selectedKeys }) => {
    const { openAppointmentDrawer } = this.props;
    switch (selectedKeys[0]) {
      case APPOINTMENT:
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

  formatMessage = data => this.props.intl.formatMessage(data);

  getMenu = () => {
    const {
      handleAppointment,
      handleMedicationReminder,
      handleSymptoms,
      handleVitals
    } = this;
    const { authPermissions = [] } = this.props;
    return (
      <Menu>
        {authPermissions.includes(PERMISSIONS.ADD_MEDICATION) && (
          <Menu.Item onClick={handleMedicationReminder}>
            <div>{this.formatMessage(messages.medications)}</div>
          </Menu.Item>
        )}
        {authPermissions.includes(PERMISSIONS.ADD_APPOINTMENT) && (
          <Menu.Item onClick={handleAppointment}>
            <div>{this.formatMessage(messages.appointments)}</div>
          </Menu.Item>
        )}
        {/* <Menu.Item onClick={handleSymptoms}>
          <div>{this.formatMessage(messages.symptoms)}</div>
        </Menu.Item> */}
        {authPermissions.includes(PERMISSIONS.ADD_ACTION) && (
          <Menu.Item>
            <div>{this.formatMessage(messages.actions)}</div>
          </Menu.Item>
        )}
        {authPermissions.includes(PERMISSIONS.ADD_MEDICATION) && (
          <Menu.Item onClick={handleVitals}>
            <div>{this.formatMessage(messages.vitals)}</div>
          </Menu.Item>
        )}
      </Menu>
    );
  };

  handleAppointment = e => {
    // e.preventDefault();
    const { openAppointmentDrawer, patient_id } = this.props;
    openAppointmentDrawer({
      patients: {
        id: patient_id,
        first_name: "test",
        last_name: "patient"
      },
      patient_id
    });
  };

  handleMedicationReminder = e => {
    const { openMReminderDrawer, patient_id } = this.props;
    openMReminderDrawer({
      patient_id
    });
  };

  handleVitals = e => {
    const { openVitalsDrawer, patient_id } = this.props;
    openVitalsDrawer({
      patient_id
    });
  };

  handleSymptoms = e => {
    const { openSymptomsDrawer, patient_id } = this.props;
    openSymptomsDrawer({
      patient_id
    });
  };

  getBodyPartName = selected_part => {
    const { formatMessage } = this;
    if (selected_part === PART_LIST_CODES.HEAD) {
      return formatMessage(messages.head);
    } else if (selected_part === PART_LIST_CODES.LEFT_EYE) {
      return formatMessage(messages.leftEye);
    } else if (selected_part === PART_LIST_CODES.RIGHT_EYE) {
      return formatMessage(messages.rightEye);
    } else if (selected_part === PART_LIST_CODES.LEFT_EAR) {
      return formatMessage(messages.leftEar);
    } else if (selected_part === PART_LIST_CODES.RIGHT_EAR) {
      return formatMessage(messages.rightEar);
    } else if (selected_part === PART_LIST_CODES.NOSE) {
      return formatMessage(messages.nose);
    } else if (selected_part === PART_LIST_CODES.MOUTH) {
      return formatMessage(messages.mouth);
    } else if (selected_part === PART_LIST_CODES.NECK) {
      return formatMessage(messages.neck);
    } else if (selected_part === PART_LIST_CODES.LEFT_SHOULDER) {
      return formatMessage(messages.leftShoulder);
    } else if (selected_part === PART_LIST_CODES.RIGHT_SHOULDER) {
      return formatMessage(messages.rightShoulder);
    } else if (selected_part === PART_LIST_CODES.CHEST) {
      return formatMessage(messages.chest);
    } else if (selected_part === PART_LIST_CODES.LEFT_ARM) {
      return formatMessage(messages.leftArm);
    } else if (selected_part === PART_LIST_CODES.RIGHT_ARM) {
      return formatMessage(messages.rightArm);
    } else if (selected_part === PART_LIST_CODES.LEFT_ELBOW) {
      return formatMessage(messages.leftElbow);
    } else if (selected_part === PART_LIST_CODES.RIGHT_ELBOW) {
      return formatMessage(messages.rightElbow);
    } else if (selected_part === PART_LIST_CODES.STOMACH) {
      return formatMessage(messages.stomach);
    } else if (selected_part === PART_LIST_CODES.ABDOMEN) {
      return formatMessage(messages.abdomen);
    } else if (selected_part === PART_LIST_CODES.LEFT_FOREARM) {
      return formatMessage(messages.leftForearm);
    } else if (selected_part === PART_LIST_CODES.RIGHT_FOREARM) {
      return formatMessage(messages.rightForearm);
    } else if (selected_part === PART_LIST_CODES.LEFT_WRIST) {
      return formatMessage(messages.leftWrist);
    } else if (selected_part === PART_LIST_CODES.RIGHT_WRIST) {
      return formatMessage(messages.rightWrist);
    } else if (selected_part === PART_LIST_CODES.LEFT_HAND) {
      return formatMessage(messages.leftHand);
    } else if (selected_part === PART_LIST_CODES.RIGHT_HAND) {
      return formatMessage(messages.rightHand);
    } else if (selected_part === PART_LIST_CODES.LEFT_HAND_FINGER) {
      return formatMessage(messages.leftHandFingers);
    } else if (selected_part === PART_LIST_CODES.RIGHT_HAND_FINGER) {
      return formatMessage(messages.rightHandFingers);
    } else if (selected_part === PART_LIST_CODES.LEFT_HIP) {
      return formatMessage(messages.leftHip);
    } else if (selected_part === PART_LIST_CODES.RIGHT_HIP) {
      return formatMessage(messages.rightHip);
    } else if (selected_part === PART_LIST_CODES.LEFT_THIGH) {
      return formatMessage(messages.leftThigh);
    } else if (selected_part === PART_LIST_CODES.RIGHT_THIGH) {
      return formatMessage(messages.rightThigh);
    } else if (selected_part === PART_LIST_CODES.LEFT_KNEE) {
      return formatMessage(messages.leftKnee);
    } else if (selected_part === PART_LIST_CODES.RIGHT_KNEE) {
      return formatMessage(messages.rightKnee);
    } else if (selected_part === PART_LIST_CODES.LEFT_SHIN) {
      return formatMessage(messages.leftShin);
    } else if (selected_part === PART_LIST_CODES.RIGHT_SHIN) {
      return formatMessage(messages.rightShin);
    } else if (selected_part === PART_LIST_CODES.LEFT_ANKLE) {
      return formatMessage(messages.leftAnkle);
    } else if (selected_part === PART_LIST_CODES.RIGHT_ANKLE) {
      return formatMessage(messages.rightAnkle);
    } else if (selected_part === PART_LIST_CODES.LEFT_FOOT) {
      return formatMessage(messages.leftFoot);
    } else if (selected_part === PART_LIST_CODES.RIGHT_FOOT) {
      return formatMessage(messages.rightFoot);
    } else if (selected_part === PART_LIST_CODES.LEFT_TOE) {
      return formatMessage(messages.leftToe);
    } else if (selected_part === PART_LIST_CODES.RIGHT_TOE) {
      return formatMessage(messages.rightToe);
    } else if (selected_part === PART_LIST_CODES.RECTUM) {
      return formatMessage(messages.rectum);
    } else if (selected_part === PART_LIST_CODES.URINARY_BLADDER) {
      return formatMessage(messages.urinary);
    } else if (selected_part === PART_LIST_CODES.HEAD_BACK) {
      return formatMessage(messages.head);
    } else if (selected_part === PART_LIST_CODES.NECK_BACK) {
      return formatMessage(messages.neck);
    } else if (selected_part === PART_LIST_CODES.RIGHT_SHOULDER_BACK) {
      return formatMessage(messages.rightShoulder);
    } else if (selected_part === PART_LIST_CODES.LEFT_SHOULDER_BACK) {
      return formatMessage(messages.leftShoulder);
    } else if (selected_part === PART_LIST_CODES.BACK) {
      return formatMessage(messages.back);
    } else if (selected_part === PART_LIST_CODES.LOWER_BACK) {
      return formatMessage(messages.lowerBack);
    } else if (selected_part === PART_LIST_CODES.LEFT_TRICEP) {
      return formatMessage(messages.leftTricep);
    } else if (selected_part === PART_LIST_CODES.RIGHT_TRICEP) {
      return formatMessage(messages.rightTricep);
    } else if (selected_part === PART_LIST_CODES.LEFT_FOREARM_BACK) {
      return formatMessage(messages.leftForearm);
    } else if (selected_part === PART_LIST_CODES.RIGHT_FOREARM_BACK) {
      return formatMessage(messages.rightForearm);
    } else if (selected_part === PART_LIST_CODES.LEFT_HAMSTRING) {
      return formatMessage(messages.leftHamString);
    } else if (selected_part === PART_LIST_CODES.RIGHT_HAMSTRING) {
      return formatMessage(messages.rightHamString);
    } else if (selected_part === PART_LIST_CODES.LEFT_CALF) {
      return formatMessage(messages.leftCalf);
    } else if (selected_part === PART_LIST_CODES.RIGHT_CALF) {
      return formatMessage(messages.rightCalf);
    }
  };

  onCloseTemplate = () => {
    this.setState({ templateDrawerVisible: false });
  };

  showTemplateDrawer = () => {
    this.setState({ templateDrawerVisible: true });
  };
  onRowClickAppointment = key => event => {
    const { openEditAppointmentDrawer, patient_id } = this.props;
    openEditAppointmentDrawer({ id: key, patient_id });
    //this.props.history.push(getGetFacilitiesUrl(key));
  };

  onRowAppointment = (record, rowIndex) => {
    const { onRowClickAppointment } = this;
    const { key } = record;
    return {
      onClick: onRowClickAppointment(key)
    };
  };

  onRowClickMedication = key => event => {
    const { openEditMedicationDrawer, patient_id } = this.props;
    openEditMedicationDrawer({ id: key, patient_id });
    //this.props.history.push(getGetFacilitiesUrl(key));
  };

  onRowMedication = (record, rowIndex) => {
    const { onRowClickMedication } = this;
    const { key } = record;
    return {
      onClick: onRowClickMedication(key)
    };
  };

  onRowClickSymptoms = record => event => {
    const { openSymptomsDrawer, patient_id } = this.props;
    openSymptomsDrawer({ data: record, patient_id });
    //this.props.history.push(getGetFacilitiesUrl(key));
  };

  onRowSymptoms = (record, rowIndex) => {
    console.log("utsdiyqwtdyyqwfduyqwfudydqwd=======>", record);
    const { onRowClickSymptoms } = this;
    // const { key } = record;
    return {
      onClick: onRowClickSymptoms(record)
    };
  };

  handleSubmitTemplate = data => {
    const {
      addCarePlanMedicationsAndAppointments,
      getMedications,
      getAppointments,
      care_plans,
      patient_id,
      getPatientCarePlanDetails
    } = this.props;
    let carePlanId = 1;
    for (let carePlan of Object.values(care_plans)) {
      let {
        basic_info: { id = 1, patient_id: patientId = 1 }
      } = carePlan;
      if (patient_id == patientId) {
        carePlanId = id;
      }
    }
    addCarePlanMedicationsAndAppointments(data, carePlanId).then(response => {
      const {
        status = false,
        statusCode,
        payload: {
          error: { error_type = "" } = {},
          message: errorMessage = ""
        } = {}
      } = response;
      if (status) {
        this.onCloseTemplate();

        message.success(this.formatMessage(messages.carePlanUpdated));
        getMedications(patient_id).then(() => {
          getAppointments(patient_id).then(() => {
            getPatientCarePlanDetails(patient_id);
          });
        });
      } else {
        if (statusCode === 422 && error_type == "slot_present") {
          message.error(this.formatMessage(messages.slotPresent));
        } else if (statusCode === 422) {
          message.error(errorMessage);
        } else {
          message.error(this.formatMessage(messages.somethingWentWrong));
        }
      }
    });
  };
  openVideoChatTab = roomId => () => {
    window.open(
      `${config.WEB_URL}${getPatientConsultingVideoUrl(roomId)}`,
      "_blank"
    );
  };

  maximizeChat = () => {
    const { patient_id } = this.props;
    window.open(
      `${config.WEB_URL}${getPatientConsultingUrl(patient_id)}`,
      "_blank"
    );
  };

  render() {
    let {
      patients,
      patient_id,
      users,
      care_plans,
      doctors,
      medicines,
      treatments = {},
      conditions = {},
      severity: severities = {},
      template_medications = {},
      template_appointments = {},
      care_plan_templates = {},
      authPermissions = [],
      chats: { minimized = false, visible: popUpVisible = false },
      drawer: { visible: drawerVisible = false } = {},
      care_plan_template_ids = {},
      symptoms = {}
    } = this.props;
    const {
      loading,
      templateDrawerVisible = false,
      carePlanTemplateId = 0,
      carePlanTemplateExists = false,
      carePlanTemplateIds = []
    } = this.state;

    const {
      formatMessage,
      getMenu,
      getAppointmentsData,
      getMedicationData,
      onCloseTemplate,
      onRowAppointment,
      onRowMedication,
      onRowSymptoms
    } = this;

    if (loading) {
      return (
        <div className="page-loader hp100 wp100 flex align-center justify-center ">
          <Spin size="large"></Spin>
        </div>
      );
    }

    let { basic_info: { name: firstTemplateName = "" } = {} } =
      care_plan_templates[care_plan_template_ids[0]] || {};

    // todo: dummy careplan
    let carePlanId = 1;
    let cPAppointmentIds = [];
    let cPMedicationIds = [];
    for (let carePlan of Object.values(care_plans)) {
      let {
        basic_info: { id = 1, patient_id: patientId = 1 }
      } = carePlan;
      if (parseInt(patient_id) === parseInt(patientId)) {
        carePlanId = id;
        let { appointment_ids = [], medication_ids = [] } = carePlan;

        cPAppointmentIds = appointment_ids;
        cPMedicationIds = medication_ids;
      }
    }

    if (loading) {
      return (
        <div className="page-loader hp100 wp100 flex align-center justify-center ">
          <Spin size="large"></Spin>
        </div>
      );
    }

    let showUseTemplate = true;
    if (cPAppointmentIds.length || cPMedicationIds.length) {
      showUseTemplate = false;
    }

    let showTabs = true; //(cPAppointmentIds.length || cPMedicationIds.length) ? true : false;
    const {
      basic_info: { doctor_id = 1 } = {},
      activated_on: treatment_start_date,
      treatment_id = "",
      severity_id = "",
      condition_id = ""
    } = care_plans[carePlanId] || {};
    const { basic_info: { name: treatment = "" } = {} } =
      treatments[treatment_id] || {};
    const { basic_info: { name: condition = "" } = {} } =
      conditions[condition_id] || {};
    const { basic_info: { name: severity = "" } = {} } =
      severities[severity_id] || {};

    // console.log('5876556456rutueerteuu=========>>>>>>>>>>', cPAppointmentIds, cPMedicationIds, carePlanId, care_plans, patient_id);
    let carePlan = care_plans[carePlanId] || {};
    let {
      details: {
        condition_id: cId = 0,
        severity_id: sId = 0,
        treatment_id: tId = 0
      } = {}
    } = carePlan;
    if (carePlanTemplateId) {
      let {
        basic_info: {
          condition_id: cIdTemp = 0,
          severity_id: sIdTemp = 0,
          treatment_id: tIdTemp = 0
        } = {}
      } = care_plan_templates[carePlanTemplateId] || {};
      carePlan.treatment_id = tIdTemp;
      carePlan.severity_id = sIdTemp;
      carePlan.condition_id = cIdTemp;
    } else {
      carePlan.treatment_id = tId;
      carePlan.severity_id = sId;
      carePlan.condition_id = cId;
    }
    const {
      basic_info: {
        first_name: doctor_first_name,
        middle_name: doctor_middle_name,
        last_name: doctor_last_name,
        user_id: doctorUserId = 1
      } = {}
    } = doctors[doctor_id] || {};

    const {
      basic_info: {
        first_name,
        middle_name,
        last_name,
        user_id,
        age,
        gender,
        uid = "123456",
        user_id: patientUserId = ""
      }
    } = patients[patient_id] || {};

    let roomId = doctorUserId + ROOM_ID_TEXT + patientUserId;

    const { basic_info: { mobile_number = "", email, prefix = "" } = {} } =
      users[user_id] || {};

    const {
      close,
      openPopUp,
      user_details: {
        // // gender,
        // age: patient_age,
        // phone_number: patient_phone_number = "--",
        // email_id: patient_email_id = "test-patient@mail.com",
        profile_picture: patient_display_picture
      } = {}
    } = this.props;

    const {
      treatment_details: {
        // treatment_severity: treatment_severity_status = "1",
        treatment_provider
        // treatment_condition,
      } = {}
    } = this.props.user_details;

    let showAddButton =
      authPermissions.includes(PERMISSIONS.ADD_APPOINTMENT) ||
      authPermissions.includes(PERMISSIONS.ADD_MEDICATION) ||
      authPermissions.includes(PERMISSIONS.ADD_ACTION);

    // const {
    //   alerts: { count = "1", new_symptoms = [], missed_appointment = "" } = {},
    // } = this.props.user_details || {};

    let docName = doctor_first_name
      ? `${doctor_first_name} ${
          doctor_middle_name ? `${doctor_middle_name} ` : ""
        }${doctor_last_name}`
      : "--";

    // const new_symptoms_string =
    //   new_symptoms.length > 0 ? new_symptoms.map((e) => e).join(", ") : "";

    return (
      <div className="pt10 pr10 pb10 pl10">
        <PatientProfileHeader
          formatMessage={formatMessage}
          getMenu={getMenu}
          showAddButton={showAddButton}
        />
        <div className="flex">
          <div className="patient-details flex-grow-0 pt20 pr24 pb20 pl24">
            <PatientCard
              patient_display_picture={patient_display_picture}
              patient_first_name={first_name}
              patient_middle_name={middle_name}
              patient_last_name={last_name}
              patient_id={uid}
              gender={gender}
              patient_age={age}
              patient_phone_number={`${
                prefix ? `+${prefix} ` : ""
              }${mobile_number}`}
              patient_email_id={email ? email : ""}
              formatMessage={formatMessage}
              openChat={openPopUp}
            />
            <PatientTreatmentCard
              formatMessage={formatMessage}
              treatment_name={treatment ? treatment : "--"}
              treatment_condition={condition ? condition : "--"}
              treatment_doctor={
                doctor_first_name
                  ? `${doctor_first_name} ${
                      doctor_middle_name ? `${doctor_middle_name} ` : ""
                    }${doctor_last_name}`
                  : "--"
              }
              treatment_start_date={
                treatment_start_date
                  ? moment(treatment_start_date).format("Do MMM YYYY")
                  : "--"
              }
              treatment_provider={
                treatment_provider ? treatment_provider : "--"
              }
              treatment_severity_status={severity ? severity : "--"}
            />
          </div>
          <div className="flex-grow-1 direction-column align-center pt20 pr24 pb20 pl24">
            {!showTabs && (
              <div className="flex flex-grow-1 direction-column justify-center hp100 align-center">
                <img src={noMedication} className="w200 h200" />
                <div className="fs20 fw700">
                  {formatMessage(messages.nothing_to_show)}
                </div>
                {/* {showUseTemplate && (carePlanTemplateId || carePlanTemplateExists) ? ( */}
                <div
                  className="use-template-button"
                  onClick={this.showTemplateDrawer}
                >
                  <div>
                    {firstTemplateName === BLANK_TEMPLATE
                      ? formatMessage(messages.create_template)
                      : formatMessage(messages.use_template)}
                  </div>
                </div>
                {/* ) :
                  showUseTemplate ? (
                    <div className='use-template-button' onClick={this.handleMedicationReminder}>
                      <div>{formatMessage(messages.add_medication)}</div>
                    </div>) : <div />} */}
              </div>
            )}
            {showTabs && (
              <div className="flex-grow-1 direction-column align-center">
                {/* <PatientAlertCard
              formatMessage={formatMessage}
              count={count}
              new_symptoms_string={new_symptoms_string}
              missed_appointment={missed_appointment}
            /> */}
                <div className="patient-tab mt20">
                  <Tabs defaultActiveKey="4" onChange={callback}>
                    {/* <TabPane tab="Symptoms" key="1">
                  <Table
                    columns={columns_symptoms}
                    dataSource={data_symptoms}
                  />
                </TabPane> */}
                    <TabPane tab="Medication" key="1">
                      <Table
                        columns={
                          authPermissions.includes(PERMISSIONS.EDIT_MEDICATION)
                            ? columns_medication
                            : columns_medication_non_editable
                        }
                        dataSource={getMedicationData(carePlan)}
                        onRow={
                          authPermissions.includes(PERMISSIONS.EDIT_MEDICATION)
                            ? onRowMedication
                            : null
                        }
                      />
                    </TabPane>
                    <TabPane tab="Appointments" key="2">
                      <Table
                        columns={
                          authPermissions.includes(PERMISSIONS.EDIT_APPOINTMENT)
                            ? columns_appointments
                            : columns_appointments_non_editable
                        }
                        dataSource={getAppointmentsData(carePlan, docName)}
                        onRow={
                          authPermissions.includes(PERMISSIONS.EDIT_APPOINTMENT)
                            ? onRowAppointment
                            : null
                        }
                      />
                      {/*<div className="wp100">*/}
                      {/*  /!* <AppointmentTable /> *!/*/}
                      {/*</div>*/}
                    </TabPane>

                    <TabPane tab="Symptoms" key="3">
                      {/* <Table
                        columns={columns_symptoms}
                        dataSource={this.getSymptomsData(symptoms)}
                        onRow={onRowSymptoms}
                      /> */}
                      <SymptomTabs patientId={patient_id} />
                    </TabPane>
                    <TabPane
                      tab={PATIENT_TABS.ACTIONS["name"]}
                      key={PATIENT_TABS.ACTIONS["key"]}
                    >
                      {/*<div>{formatMessage(messages.vitals)}</div>*/}
                      <VitalTable patientId={patient_id} />
                    </TabPane>
                  </Tabs>
                </div>
              </div>
            )}
          </div>
        </div>
        <AddMedicationReminder carePlanId={carePlanId} />
        <AddVitals carePlanId={carePlanId} />
        {popUpVisible && (
          <div
            className={
              (drawerVisible || templateDrawerVisible) && minimized
                ? "chat-popup-minimized"
                : (drawerVisible || templateDrawerVisible) && !minimized
                ? "chat-popup"
                : minimized
                ? "chat-popup-minimized-closedDrawer"
                : "chat-popup-closedDrawer"
            }
          >
            <ChatPopup
              roomId={roomId}
              placeVideoCall={this.openVideoChatTab(roomId)}
              patientName={
                first_name
                  ? `${first_name} ${middle_name ? `${middle_name} ` : ""}${
                      last_name ? `${last_name}` : ""
                    }`
                  : ""
              }
              maximizeChat={this.maximizeChat}
            />
          </div>
        )}
        <AddAppointmentDrawer carePlanId={carePlanId} />
        {templateDrawerVisible && (
          <TemplateDrawer
            visible={templateDrawerVisible}
            submit={this.handleSubmitTemplate}
            dispatchClose={close}
            closeTemplateDrawer={onCloseTemplate}
            patientId={patient_id}
            carePlanTemplateIds={carePlanTemplateIds}
            carePlan={carePlan}
            {...this.props}
          />
        )}
        <EditAppointmentDrawer carePlan={carePlan} carePlanId={carePlanId} />
        <EditMedicationReminder carePlanId={carePlanId} />
        <SymptomsDrawer />
      </div>
    );
  }
}

export default injectIntl(PatientDetails);
