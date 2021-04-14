import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import messages from "./message";
import edit_image from "../../../Assets/images/edit.svg";
import { getUploadAppointmentDocumentUrl } from "../../../Helper/urls/appointments";
import { doRequest } from "../../../Helper/network";
import { generatePrescriptionUrl } from "../../../Helper/urls/patients";
import ShareIcon from "../../../Assets/images/redirect3x.png";

import config from "../../../config";

import {
  REQUEST_TYPE,
  GENDER,
  PERMISSIONS,
  TABLET,
  SYRUP,
  PARTS,
  PART_LIST_CODES,
  DIAGNOSIS_TYPE,
  TABLE_DEFAULT_BLANK_FIELD,
  FEATURES,
  USER_CATEGORY,
  HOST,
  PATH
} from "../../../constant";
import { Tabs, Table, Dropdown, Spin, message, Button } from "antd";
import Modal from "antd/es/modal";
import Menu from "antd/es/menu";

import OtpInput from "react-otp-input";

// DRAWERS
import VitalTimelineDrawer from "../../../Containers/Drawer/vitalTimeline";
import MedicationTimelineDrawer from "../../../Containers/Drawer/medicationTimeline";
import AddCareplanDrawer from "../../../Containers/Drawer/addCareplan";
import AddMedicationReminder from "../../../Containers/Drawer/addMedicationReminder";
import AddVitals from "../../../Containers/Drawer/addVitals";
import AddAppointmentDrawer from "../../../Containers/Drawer/addAppointment";
import EditAppointmentDrawer from "../../../Containers/Drawer/editAppointment";
import EditVitals from "../../../Containers/Drawer/editVitals";
import EditPatientDrawer from "../../../Containers/Drawer/editPatientDrawer";
import SymptomsDrawer from "../../../Containers/Drawer/symptomsDrawer";
import EditMedicationReminder from "../../../Containers/Drawer/editMedicationReminder";
import AddReportDrawer from "../../../Containers/Drawer/addReport";
import EditReportDrawer from "../../../Containers/Drawer/editReport";

// TABLES
import VitalTable from "../../../Containers/Vitals/table";
import MedicationTable from "../../../Containers/Medications/table";
import ReportTable from "../../../Containers/Reports/table";

import PatientAlerts from "../../../Containers/Patient/common/patientAlerts";

import PatientCarePlans from "./common/patientProfileCarePlans";

import {
  PhoneOutlined,
  MessageOutlined,
  VideoCameraOutlined,
  CaretDownOutlined
} from "@ant-design/icons";
import moment from "moment";

// appointment upload modal
import AppointmentUpload from "../../../Containers/Modal/appointmentUpload";
import userDp from "../../../Assets/images/ico-placeholder-userdp.svg";
import noMedication from "../../../Assets/images/no_medication@3x.png";
import TemplateDrawer from "../../Drawer/medicationTemplateDrawer";
import ChatPopup from "../../../Containers/ChatPopup";
import TabletIcon from "../../../Assets/images/tabletIcon3x.png";
import InjectionIcon from "../../../Assets/images/injectionIcon3x.png";
import SyrupIcon from "../../../Assets/images/pharmacy.png";
import { getPatientConsultingVideoUrl } from "../../../Helper/url/patients";
import { getPatientConsultingUrl } from "../../../Helper/url/patients";
import SymptomTabs from "../../../Containers/Symptoms";
import { getRoomId } from "../../../Helper/twilio";
import { getFullName } from "../../../Helper/common";
import Tooltip from "antd/es/tooltip";

const BLANK_TEMPLATE = "Blank Template";
const { TabPane } = Tabs;
const APPOINTMENT = "appointment";

const { confirm } = Modal;

const PATIENT_TABS = {
  ACTIONS: {
    name: "Actions",
    key: "4"
  },
  REPORTS: {
    name: "Reports",
    key: "5"
  }
};

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
    dataIndex: "markComplete",
    key: "markComplete",
    width: "40%",
    render: ({
      id: appointment_id,
      end_time,
      active_event_id,
      markAppointmentComplete,
      formatMessage,
      uploadAppointmentDocs,
      schedule_events
    }) => {
      // const timeDifference = moment().diff(moment(end_time), "seconds");

      const appointmentEvent =
        Object.keys(schedule_events).filter(id => {
          const { event_id = {} } = schedule_events[id] || {};

          return event_id === appointment_id;
        }) || [];

      return (
        <div className="flex justify-space-between">
          {active_event_id && (
            <div className="wp100 flex align-center justify-center pointer">
              <Button
                type={"primary"}
                onClick={markAppointmentComplete(active_event_id)}
              >
                {formatMessage(messages.complete_text)}
              </Button>
            </div>
          )}
          {/*<div className="wp100 flex align-center justify-center pointer">*/}
          {/*  <Button*/}
          {/*    type={"secondary"}*/}
          {/*    onClick={uploadAppointmentDocs(appointment_id)}*/}
          {/*  >*/}
          {/*    {formatMessage(messages.upload_reports)}*/}
          {/*  </Button>*/}
          {/*</div>*/}
        </div>
      );
    }
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
  },
  {
    title: "Adherence",
    dataIndex: "Adherence",
    key: "adherence",
    width: "30%",
    ellipsis: true
  }
];

const PatientProfileHeader = ({ formatMessage, getMenu, showAddButton , selectedCarePlanId , auth_role , user_role_id }) => {
  console.log("3287642547652342",{selectedCarePlanId});
  return (
    <div className="flex pt20 pr24 pb10 pl24">
      <div className="patient-profile-header flex-grow-0">
        <div className="fs28 fw700">
          {formatMessage(messages.patient_profile_header)}
        </div>
      </div>
      <div className="flex-grow-1 tar">
        {showAddButton  && user_role_id.toString() === auth_role.toString() && (
          <Dropdown
            overlay={getMenu()}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button type="primary" className="ml10 add-button " icon={"plus"}>
              <span className="fs16">Add</span>
            </Button>
          </Dropdown>
        )}
      </div>
    </div>
  );
};

const PatientCard = ({
  patient_display_picture = userDp,
  // patient_first_name = "Patient one",
  // patient_middle_name,
  // patient_last_name,
  patientFullName,
  gender = "m",
  patient_age = "--",
  uid = "123456",
  patient_phone_number,
  // patient_email_id,
  formatMessage,
  openChat,
  patients,
  patient_id,
  editPatient,
  // editPatientOption,
  openVideoScreen
}) => {
  const { details: { comorbidities, allergies } = {} } =
    patients[patient_id] || {};

  const menu = (
    <Menu>
      <Menu.Item onClick={editPatient}>
        <div>{formatMessage(messages.edit_patient)}</div>
      </Menu.Item>
    </Menu>
  );
  return (
    <div className="flex direction-column tac br10 bg-faint-grey">
      {/* <div className="flex justify-end pt20 pl20 pr20 pb6">
        <CaretDownOutlined className="pointer" />
      </div> */}

      <div className="wp100 flex justify-end p10">
        <Dropdown overlay={menu} placement={"bottomLeft"}>
          <CaretDownOutlined className="pointer" />
        </Dropdown>
      </div>
      {/*<div>*/}
      {/*  <Collapse*/}
      {/*    ghost={true}*/}
      {/*    expandIconPosition={"right"}*/}
      {/*    bordered={false}*/}
      {/*    expandIcon={() => <CaretDownOutlined className="pointer" />}*/}
      {/*  >*/}
      {/*    <Panel key={"1"} style={{ border: "none" }} className="br10">*/}
      {/*      <div className="flex   align-center tac">{editPatientOption()}</div>*/}
      {/*    </Panel>*/}
      {/*  </Collapse>*/}
      {/*</div>*/}

      <div className="flex">
        <div className="flex align-start">
          <img
            alt=""
            className=" w50 br50 mr10 ml10"
            src={patient_display_picture}
          />
        </div>

        <div className="flex direction-column align-start">
          <div className="patient-name flex flex-wrap">
            <div className="word-wrap">
              {patientFullName && patientFullName.length > 20
                ? `${patientFullName.substring(0, 21)}..`
                : patientFullName}
            </div>
            <div className="align-self-start">
              ({gender ? `${GENDER[gender].view} ` : ""}
              {patient_age})
            </div>
          </div>
          <div className="patient-id mt6 mr0 mb0 ml0 warm-grey">PID: {uid}</div>

          <div className="flex justify-space-evenly mt10">
            <div className="br50 bg-darker-blue p10 mr10 w30 h30 flex justify-center align-center pointer">
              <Tooltip placement={"bottom"} title={patient_phone_number}>
                <PhoneOutlined className="text-white fs18" />
              </Tooltip>
            </div>
            <div
              className="br50 bg-darker-blue p10 mr10 w30 h30 flex justify-center align-center pointer"
              onClick={openChat}
            >
              <Tooltip
                placement={"bottom"}
                title={formatMessage(messages.chat_icon_text)}
              >
                <MessageOutlined className="text-white fs18" />
              </Tooltip>
            </div>

            <div
              className="br50 bg-darker-blue p10 mr10 w30 h30 flex justify-center align-center pointer"
              onClick={openVideoScreen}
            >
              <Tooltip
                placement={"bottom"}
                title={formatMessage(messages.video_icon_text)}
              >
                <VideoCameraOutlined className="text-white fs18" />
              </Tooltip>
            </div>

            {/* <div className="br50 bg-darker-blue p10 mr10 w30 h30 flex justify-center align-center pointer">
              <Tooltip placement={"bottom"} title={formatMessage(messages.video_icon_text)}>
              <div className="text-white fs18" >
                      {editPatientOption()}

              </div>
              </Tooltip>
            </div> */}
          </div>
        </div>
      </div>

      <div className="flex direction-column align-start mt10 ml10">
        <div className="fs12 fw700 brown-grey">
          {formatMessage(messages.comorbidities_text)}
        </div>
        <div className="fs14 fw700 black-85">{comorbidities}</div>
      </div>

      {/*allergies*/}
      <div className="flex direction-column align-start mb14 mt6 ml10">
        <div className="fs12 fw700 brown-grey">
          {formatMessage(messages.allergies_text)}
        </div>
        <div className="fs14 fw700 flex black-85">{allergies}</div>
      </div>

      {/*<div className="patient-contact-number mt16 mr0 mb0 ml0 flex   justify-center align-center">*/}
      {/*  <PhoneOutlined className="dark-sky-blue mr8" />*/}
      {/*  <div>{patient_phone_number}</div>*/}
      {/*</div>*/}
      {/*<div className="patient-email-id mt8 mr0 mb0 ml0 flex   justify-center align-center">*/}
      {/*  {patient_email_id && <MailOutlined className="dark-sky-blue mr8" />}*/}
      {/*  {patient_email_id && <div>{patient_email_id}</div>}*/}
      {/*</div>*/}

      {/*show more*/}
      {/*<div>*/}
      {/*  <Collapse ghost={true} expandIconPosition={"right"}  bordered={false} expandIcon={() => <CaretDownOutlined />}>*/}
      {/*    <Panel  key={"1"} style={{border:"none"}} className="br10">*/}

      {/*      /!*comorbidities*!/*/}
      {/*      <div className="flex direction-column align-start">*/}
      {/*        <div className="fs12 fw700 brown-grey">{formatMessage(messages.comorbidities_text)}</div>*/}
      {/*        <div className="fs14 fw700 black-85">{comorbidities}</div>*/}
      {/*      </div>*/}

      {/*      /!*allergies*!/*/}
      {/*      <div className="flex direction-column align-start mb14">*/}
      {/*        <div className="fs12 fw700 brown-grey">{formatMessage(messages.allergies_text)}</div>*/}
      {/*        <div className="fs14 fw700 flex black-85">{allergies}</div>*/}
      {/*      </div>*/}

      {/*    </Panel>*/}
      {/*  </Collapse>*/}
      {/*</div>*/}

      {/*<div className="action-buttons flex">*/}
      {/*  <div className="edit-button p10">*/}
      {/*    <img className="mr5" src={edit_image} />*/}
      {/*    <span>{formatMessage(messages.profile_edit)}</span>*/}
      {/*  </div>*/}
      {/*  <div className="chat-button p10" onClick={openChat}>*/}
      {/*    <img className="mr5" src={chat_image} />*/}
      {/*    <span>{formatMessage(messages.profile_chat)}</span>*/}
      {/*  </div>*/}
      {/*</div>*/}
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
  treatment_diagnosis_description,
  treatment_diagnosis_type,
  treatment_clinical_notes,
  treatment_symptoms,
  selectedCarePlanId
}) => {
  const time = moment().format("Do MMMM YYYY, hh:mm a");

  console.log("1897312 config", { config });
  return (
    <div className="treatment mt20 tal bg-faint-grey">
      <div className="header-div flex align-center justify-space-between">
        <h3>{formatMessage(messages.treatment_details)}</h3>
        {selectedCarePlanId ? (
          <a
            href={`${config.WEB_URL}${generatePrescriptionUrl(
              selectedCarePlanId
            )}`}
            target={"_blank"}
            className="presc-link"
          >
            <Button
              type="ghost"
              className="flex align-center justify-space-evenly"
            >
              <span className="fs14">
                {" "}
                {formatMessage(messages.prescription)}
              </span>
              <img
                title={"Generate Prescription"}
                src={ShareIcon}
                alt="prescription icon"
                className="pointer w15 ml14"
              ></img>
            </Button>
          </a>
        ) : null}
      </div>

      <div className="treatment-details pl16 pr16 ">
        <div className="flex direction-column mb14 mt20">
          <div className="fs14">{formatMessage(messages.treatment_header)}</div>
          <div className="fs14 fw700">{treatment_name}</div>
        </div>

        <div className="flex direction-column mb14">
          <div className="fs14">
            {formatMessage(messages.treatment_severity)}
          </div>
          <div className="fs16 fw700">{treatment_severity_status}</div>
        </div>

        <div className="flex direction-column mb14">
          <div className="fs14">
            {formatMessage(messages.treatment_condition)}
          </div>
          <div className="fs16 fw700">{treatment_condition}</div>
        </div>

        <div className="flex direction-column mb14">
          <div className="fs14">{formatMessage(messages.treatment_doctor)}</div>
          <div className="fs16 fw700">{treatment_doctor}</div>
        </div>

        <div className="flex direction-column mb14">
          <div className="fs14">{formatMessage(messages.clinical_notes)}</div>
          <div className="fs16 fw700">{treatment_clinical_notes}</div>
        </div>

        <div className="flex direction-column mb14">
          <div className="fs14">{formatMessage(messages.diagnosis_text)}</div>
          <div>
            <span className="fs16 fw700">{`${treatment_diagnosis_description}`}</span>{" "}
            <span className="fs12 fw600">{`(${treatment_diagnosis_type})`}</span>
          </div>
        </div>

        <div className="flex direction-column mb14">
          <div className="fs14">{formatMessage(messages.symptoms_text)}</div>
          <div className="fs16 fw700">{treatment_symptoms}</div>
        </div>

        <div className="flex direction-column mb14">
          <div className="fs14">
            {formatMessage(messages.treatment_start_date)}
          </div>
          <div className="fs16 fw700">{treatment_start_date}</div>
        </div>

        <div className="flex direction-column mb14">
          <div className="fs14">
            {formatMessage(messages.treatment_provider)}
          </div>
          <div className="fs16 fw700">{treatment_provider}</div>
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
      appointmentsListIds: [],
      symptoms: [
        { body_part: PARTS.HEAD, description: "werwerewrwer" },
        { body_part: PARTS.CHEST, description: "342342352343" }
      ],
      consentLoading: false,
      selectedCarePlanId: null,
      isOtherCarePlan: true,
      uploadDocsModalVisible: false,
      uploadDocsAppointmentId: null,
      allAppointmentDocs: {},
      symptom_dates: [],
      report_ids: []
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
      getLastVisitAlerts,
      searchMedicine,
      show_template_drawer = {}
    } = this.props;

    const { show: showTd = false } = show_template_drawer;
    // let isCarePlanDataPresent = currentCarePlanId ? true : false;
    if (showTd) {
      this.setState({ templateDrawerVisible: true });
    }

    fetchChatAccessToken(authenticated_user);
    this.fetchSymptomsData();
    this.fetchReportData();
    this.fetchVitalDetails();

    // if (showTd) {
    getPatientCarePlanDetails(patient_id).then(response => {
      let { status = false, payload = {} } = response;
      if (status) {
        let {
          data: {
            show = false,
            care_plan_templates = {},
            care_plan_template_ids = [],
            care_plan_ids = [],
            current_careplan_id = null
          } = {}
        } = payload;

        // const { basic_info: { id: carePlanTemplateId = 0 } } = care_plan_templates[Object.keys(care_plan_templates)[0]];

        let carePlanTemplateExists =
          care_plan_templates && Object.values(care_plan_templates).length
            ? true
            : false;

        this.setState({
          carePlanTemplateId,
          carePlanTemplateExists,
          loading: false,
          patientCarePlanIds: care_plan_ids,
          current_careplan_id,
          isOtherCarePlan: false,
          selectedCarePlanId: current_careplan_id
        });
      }
    });

    getMedications(patient_id);
    getAppointmentsDetails();
    getAppointments(patient_id);

    // }
    searchMedicine("");
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

  fetchSymptomsData = async () => {
    try {
      const { getSymptomTimeLine, patient_id } = this.props;
      const res = await getSymptomTimeLine(patient_id);
      const { status = false, payload: { data: { symptom_dates } = {} } = {} } =
        res || {};
      // console.log("43243234728323492",res);
      if (status) {
        this.setState({ symptom_dates });
      }
    } catch (error) {
      console.log("errrrrr--->", error);
      message.warn(error);
    }
  };

  fetchVitalDetails = () => {
    const { getVitalOccurence, searchVital } = this.props;
    getVitalOccurence().then(res => {
      const { status = false } = res;
    });

    searchVital("").then(res => {
      const { status = false } = res;
    });
  };

  fetchReportData = async () => {
    try {
      const { fetchPatientReports, patient_id } = this.props;
      const { loading } = this.state;
      const response = await fetchPatientReports(patient_id);
      const { status, payload: { data: { report_ids = [] } = {} } = {} } =
        response || {};
      // console.log("43243234728323492 REPORTS ------>", response);
      if (status === true) {
        this.setState({ report_ids, loading: false });
      }
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  markAppointmentComplete = id => async e => {
    e.stopPropagation();
    const { markAppointmentComplete } = this.props;
    const response = await markAppointmentComplete(id);

    const { status, payload: { data, error, message: responseMessage } = {} } =
      response || {};

    if (status === true) {
      message.success(responseMessage);
    } else {
      message.warn(responseMessage);
    }
  };

  uploadAppointmentDocs = id => async e => {
    e.stopPropagation();
    this.setState({
      uploadDocsModalVisible: true,
      uploadDocsAppointmentId: id
    });
  };

  getAppointmentsData = (carePlan = {}, docName = "--") => {
    const {
      appointments,
      users = {},
      // doctors = {},
      // patients = {},
      schedule_events = {}
    } = this.props;

    const {
      markAppointmentComplete,
      formatMessage,
      uploadAppointmentDocs
    } = this;

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
        organizer: { id: organizer_id } = {},
        active_event_id = null
      } = appointments[id] || {};
      const { basic_info: { user_name = "" } = {} } = users[organizer_id] || {};
      return {
        // organizer: organizer_type === "doctor" ? doctors[organizer_id] : patients[organizer_id].
        key: id,
        organizer: user_name ? user_name : docName,
        date: `${moment(start_date).format("LL")}`,
        time: `${
          start_time
            ? moment(start_time).format("LT")
            : TABLE_DEFAULT_BLANK_FIELD
        } - ${
          end_time ? moment(end_time).format("LT") : TABLE_DEFAULT_BLANK_FIELD
        }`,
        description: description ? description : "--",
        markComplete: {
          id,
          end_time,
          active_event_id,
          schedule_events,
          markAppointmentComplete,
          formatMessage,
          uploadAppointmentDocs
        }
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
          <div className="flex   justify-space-around align-center">
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

  formatMessage = data => this.props.intl.formatMessage(data);

  getMenu = () => {
    const {
      handleAppointment,
      handleMedicationReminder,
      handleSymptoms,
      handleVitals,
      handleAddCareplan,
      handleAddReports
    } = this;
    const { authPermissions = [], authenticated_category } = this.props;
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
        {authPermissions.includes(PERMISSIONS.ADD_CAREPLAN) && (
          <Menu.Item onClick={handleAddCareplan}>
            <div>{this.formatMessage(messages.newTreatmentPlan)}</div>
          </Menu.Item>
        )}
        {(authenticated_category === USER_CATEGORY.DOCTOR ||
          authenticated_category === USER_CATEGORY.PATIENT) && (
          <Menu.Item onClick={handleAddReports}>
            <div>{this.formatMessage(messages.reports)}</div>
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

  handleAddCareplan = e => {
    const { openAddCareplanDrawer, patient_id } = this.props;
    openAddCareplanDrawer({
      // patients: {
      //   id: patient_id,
      //   first_name: "test",
      //   last_name: "patient"
      // },
      // patient_id
    });
  };

  handleAddReports = e => {
    const { openAddReportsDrawer } = this.props;
    const { patient_id } = this.props;

    openAddReportsDrawer({
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
    const { onRowClickSymptoms } = this;
    // const { key } = record;
    return {
      onClick: onRowClickSymptoms(record)
    };
  };

  handlePatientLastVisitAlert = () => {
    const { getLastVisitAlerts, patient_id } = this.props;

    getLastVisitAlerts(patient_id).then(response => {
      const {
        status = false,
        statusCode,
        payload: {
          error: { error_type = "" } = {},
          message: errorMessage = ""
        } = {}
      } = response;

      if (status) {
        let data = response.payload.data;
      } else {
        message.error(this.formatMessage(messages.somethingWentWrong));
      }
    });
  };

  // handleSubmitTemplate = data => {
  //   const {
  //     addCarePlanMedicationsAndAppointments,
  //     getMedications,
  //     getAppointments,
  //     care_plans,
  //     patient_id,
  //     getPatientCarePlanDetails
  //   } = this.props;
  //
  //   let carePlanId = 1;
  //   for (let carePlan of Object.values(care_plans)) {
  //     let {
  //       basic_info: { id = 1, patient_id: patientId = 1 }
  //     } = carePlan;
  //     if (patient_id == patientId) {
  //       carePlanId = id;
  //     }
  //   }
  //   addCarePlanMedicationsAndAppointments(data, carePlanId).then(response => {
  //     const {
  //       status = false,
  //       statusCode,
  //       payload: {
  //         error: { error_type = "" } = {},
  //         message: errorMessage = ""
  //       } = {}
  //     } = response;
  //     if (status) {
  //       this.onCloseTemplate();
  //
  //       message.success(this.formatMessage(messages.carePlanUpdated));
  //       getMedications(patient_id).then(() => {
  //         getAppointments(patient_id).then(() => {
  //           getPatientCarePlanDetails(patient_id);
  //         });
  //       });
  //     } else {
  //       if (statusCode === 422 && error_type == "slot_present") {
  //         message.error(this.formatMessage(messages.slotPresent));
  //       } else if (statusCode === 422) {
  //         message.error(errorMessage);
  //       } else {
  //         message.error(this.formatMessage(messages.somethingWentWrong));
  //       }
  //     }
  //   });
  // };
  openVideoChatTab = roomId => () => {
    const videoCallBlocked = this.checkVideoCallIsBlocked();

    if (videoCallBlocked) {
      message.error(this.formatMessage(messages.videoCallBlocked));
      return;
    }
    window.open(
      `${config.WEB_URL}/test${getPatientConsultingVideoUrl(roomId)}`,
      "_blank"
    );
  };

  checkVideoCallIsBlocked = () => {
    const { features_mappings = {} } = this.props;
    let videoCallBlocked = false;
    const videoCallFeatureId = this.getFeatureId(FEATURES.VIDEO_CALL);
    const otherUserCategoryId = this.getOtherUserCategoryId();
    const { [otherUserCategoryId]: mappingsData = [] } = features_mappings;

    if (mappingsData.indexOf(videoCallFeatureId) >= 0) {
      videoCallBlocked = false;
    } else {
      videoCallBlocked = true;
    }

    return videoCallBlocked;
  };

  getFeatureId = featureName => {
    const { features = {} } = this.props;
    const featuresIds = Object.keys(features);

    for (const id of featuresIds) {
      const { [id]: { name = null } = ({} = {}) } = features;

      if (name === featureName) {
        return parseInt(id, 10);
      }
    }

    return null;
  };

  getOtherUserCategoryId = () => {
    const { patient_id } = this.props;
    return patient_id;
  };

  maximizeChat = () => {
    const { patient_id } = this.props;
    window.open(
      `${config.WEB_URL}${getPatientConsultingUrl(patient_id)}`,
      "_blank"
    );
  };

  handleSymptoms = e => {
    const { openSymptomsDrawer, patient_id } = this.props;
    openSymptomsDrawer({
      patient_id
    });
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

  handleSubmitTemplate = data => {
    const {
      addCarePlanMedicationsAndAppointments,
      getMedications,
      getAppointments,
      care_plans,
      patient_id,
      getPatientCarePlanDetails
    } = this.props;
    const { carePlanId, ...rest } = data || {};
    addCarePlanMedicationsAndAppointments(rest, carePlanId).then(response => {
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

  maximizeChat = () => {
    const { patient_id } = this.props;
    window.open(
      `${config.WEB_URL}${getPatientConsultingUrl(patient_id)}`,
      "_blank"
    );
  };

  consentConfirmModal = () => {
    const { intl: { formatMessage } = {} } = this.props;
    return (
      <div className="flex align-center">
        {formatMessage(messages.consent_details_text)}
      </div>
    );
  };

  handleOtpModal = show => {
    this.setState({ showOtpModal: show });
  };

  handleRequestConsent = () => {
    const { requestConsent, patient_id } = this.props;
    const { consentLoading } = this.state;
    const { consentConfirmModal, closeConfirm, handleOtpModal } = this;

    confirm({
      content: consentConfirmModal(),
      okButtonProps: {
        loading: consentLoading
      },
      onOk: async () => {
        await this.sendOtp();
      },
      onCancel() {
        // closeConfirm();
      }
    });
  };

  sendOtp = async e => {
    if (e) {
      e.preventDefault();
    }
    const { requestConsent, patient_id, patients } = this.props;
    const { handleOtpModal } = this;

    const { basic_info: { full_name } = {} } =
      patients[patient_id] || {};

    this.setState({ consentLoading: true });
    const response = await requestConsent(patient_id);
    const {
      status,
      payload: { data: { user_id: otpUserId } = {} } = {},
      message: errMessage
    } = response || {};
    if (status === true) {
      this.setState({ otpUserId });
      message.success(
        `OTP sent successfully to ${full_name}. Please consult with patient for the same`
      );
    } else {
      message.warn(errMessage);
    }
    this.setState({ consentLoading: false });
    handleOtpModal(true);
  };

  updateOtp = otp => {
    this.setState({ otp });
  };

  getConsentDetails = () => {
    const { intl: { formatMessage } = {} } = this.props;
    const { otp } = this.state;
    const { updateOtp } = this;
    return (
      <div>
        <div className="fs20 fw700 wp100 flex justify-center fs18 fw500 mb20">
          {formatMessage(messages.enter_otp_text)}
        </div>

        <div className="fs16 flex align-center tac">
          {formatMessage(messages.sent_otp_consent_details_text)}
        </div>

        <div className="wp100 flex justify-center">
          <div className="wp80 justify-space-evenly">
            <OtpInput
              value={otp}
              onChange={updateOtp}
              numInputs={4}
              // shouldAutoFocus={true}
              className="wp100 flex justify-space-evenly"
              inputStyle={{
                width: 60,
                height: 60,
                margin: 8,
                border: "none",
                fontSize: 20,
                borderBottom: "1px solid #000"
              }}
              focusStyle={{ border: "none" }}
            />
          </div>
        </div>

        <div></div>
      </div>
    );
  };

  handleOtpVerify = async e => {
    e.preventDefault();
    const { consentVerify } = this.props;
    const { otp, otpUserId } = this.state;

    const response = await consentVerify({ otp, user_id: otpUserId });
    const { status, message: errMessage = "error" } = response || {};
    if (status === true) {
      message.success("OTP verified successfully");
      this.setState({ showOtpModal: false });
    } else {
      message.warn(errMessage);
    }
  };

  handleOtpCancel = e => {
    e.preventDefault();
    this.handleOtpModal(false);
  };

  closeAppointmentDocsModal = e => {
    e.preventDefault();
    // const {allAppointmentDocs[key]} = this.state.allAppointmentDocs;
    this.setState({
      uploadDocsModalVisible: false,
      uploadDocsAppointmentId: null
    });
  };

  handleCarePlanChange = id => e => {
    e.preventDefault();
    const { doctors, care_plans, authenticated_user } = this.props;

    let doctorId = null;

    Object.keys(doctors).forEach(id => {
      const { basic_info: { user_id } = {} } = doctors[id] || {};

      if (user_id === authenticated_user) {
        doctorId = id;
      }
    });

    let isOtherCarePlan = true;

    const {
      basic_info: { doctor_id }
    } = care_plans[id] || {};
    if (doctorId === `${doctor_id}`) {
      isOtherCarePlan = false;
    }

    this.setState({ selectedCarePlanId: id, isOtherCarePlan });
  };

  getOtpModalFooter = () => {
    const { intl: { formatMessage } = {} } = this.props;
    const { handleOtpVerify, sendOtp } = this;
    return (
      <div>
        {/*<Button ghost={true} className="text-grey">{formatMessage(messages.cancel_text)}</Button>*/}
        <Button onClick={sendOtp}>
          {formatMessage(messages.resend_otp_text)}
        </Button>
        <Button type={"primary"} onClick={handleOtpVerify}>
          {formatMessage(messages.verify_otp_text)}
        </Button>
      </div>
    );
  };

  editPatientOption = () => {
    return (
      <div
        onClick={this.handleEditPatientDrawer}
        className="flex  align-center justify-center  wp100 "
      >
        <div className="pointer h30 flex   ">
          <div className="flex direction-column align-center justify-center  hp100   ">
            <span className="fw700 fs19 mr20">
              {this.formatMessage(messages.edit_patient)}
            </span>
          </div>
          <div className="flex direction-column align-center justify-center  hp100 ">
            <img src={edit_image} className="edit-patient-icon" />
          </div>
        </div>
      </div>
    );
  };

  handleEditPatientDrawer = () => {
    // e.preventDefault();
    let {
      patient_id: id,
      patients,
      doctors,
      treatments = {},
      severity: severities = {},
      conditions = {},
      chats,
      chat_ids,
      users,
      care_plans,
      authenticated_user,
      openEditPatientDrawer
    } = this.props;

    let doctor_id = null;

    Object.keys(doctors).forEach(id => {
      const { basic_info: { user_id } = {} } = doctors[id] || {};

      if (user_id === authenticated_user) {
        doctor_id = id;
      }
    });

    let patientData = patients[id] || {};
    let treatment = "";
    let condition = "";
    let severity = "";

    let carePlanData = {};
    const { selectedCarePlanId = null } = this.state;
    const carePlan = care_plans[selectedCarePlanId] || {};

    let { basic_info = {} } = carePlan || {};
    let {
      doctor_id: doctorId = 1,
      patient_id,
      id: carePlanId = 1
    } = basic_info;

    let {
      details: {
        treatment_id: cTreatment = "",
        condition_id: cCondition = "",
        severity_id: cSeverity = ""
      } = {}
    } = carePlan || {};

    let { basic_info: { name: treatmentName = "" } = {} } =
      treatments[cTreatment] || {};
    let { basic_info: { name: severityName = "" } = {} } =
      severities[cSeverity] || {};
    let { basic_info: { name: conditionName = "" } = {} } =
      conditions[cCondition] || {};

    treatment = treatmentName;
    condition = conditionName;
    severity = severityName;

    carePlanData = {
      ...care_plans[carePlanId],
      treatment,
      condition,
      severity
    };

    patientData = {
      ...patients[id],
      treatment,
      condition,
      severity,
      carePlanData
    };

    openEditPatientDrawer({ patientData, carePlanData });
  };

  handleBeforeUploadRegistration = key => file => {
    const { allAppointmentDocs = {} } = this.state;

    console.log("6756467897865678777", this.state);
    // if(allAppointmentDocs[key]){
    //   const {upload_documents = {}} = allAppointmentDocs[key];
    //   console.log("783423452374672348",upload_documents);
    //   for (let doc of upload_documents) {
    //     console.log("DOCCCCCCCCCCCCCCCCCCCCC",doc);
    //     let fileName = file.name;
    //     let newFileName = fileName.replace(/\s/g, '');
    //     if (doc.includes(newFileName)) {
    //       console.log("DUPLICATE");
    //       message.error(this.formatMessage(messages.duplicateError));
    //       return false;
    //     }
    //   }
    //   console.log("handleBeforeUploadRegistration Called YYYYYYYYYYYYYYYYYYy");
    //   return true
    // }
    console.log("handleBeforeUploadRegistration Called");
    return true;
  };

  // handleAddAppointmentDocuments = (appointment_id)  => info => {

  //   const fileList = info.fileList;
  //   let key = appointment_id;
  //   let {  allAppointmentDocs={} } = this.state;
  //   console.log("4334543535345345",info);

  // }

  // handleChangeList = key => info => {

  //   console.log("234532432423423",info);
  //   // const fileList = info.fileList;
  //   // let { education = {} } = this.state;
  //   // let newEducation = education;
  //   // let { photos = [], photo = [] } = newEducation[key];
  //   // for (let item of fileList) {

  //   //   let uid = item.uid;
  //   //   let push = true;

  //   //   if (typeof (item) == 'object') {
  //   //     for (let photo of photos) {

  //   //       let { name = '' } = item;
  //   //       let fileName = name;
  //   //       let newFileName = fileName.replace(/\s/g, '');
  //   //       if (photo.includes(newFileName)) {
  //   //         push = false;
  //   //       }
  //   //     }
  //   //   }
  //   //   if (newEducation[key].photo && newEducation[key].photo.length) {
  //   //     for (let pic of newEducation[key].photo) {
  //   //       if (pic.uid === uid) {
  //   //         push = false;
  //   //       }
  //   //     }
  //   //   }
  //   //   if (push) {
  //   //     newEducation[key].photo.push(item);
  //   //   }
  //   // };

  //   // this.setState({ education: newEducation });
  // };

  onUploadCompleteRegistration = async (data = {}, key) => {
    // const {allAppointmentDocs ={} } =this.state;
    const { upload_documents: latest_docs = {} } = data;
    // console.log("7865789089767567890",data);

    // const {storeAppointmentDocuments} = this.props;
    // let appointmentDocs = allAppointmentDocs[key];
    // allAppointmentDocs[key] = {...appointmentDocs,upload_documents};
    // let newAppointmentDocs = allAppointmentDocs[key];
    // this.setState({allAppointmentDocs:{...allAppointmentDocs}});

    // storeAppointmentDocuments(data)

    const { allAppointmentDocs = {} } = this.state;
    let newappointmentDocs = allAppointmentDocs;

    if (newappointmentDocs[key]) {
      let newDocs = newappointmentDocs[key].upload_documents;
      newappointmentDocs[key].upload_documents = latest_docs;
      this.setState({
        allAppointmentDocs: newappointmentDocs
      });
    } else {
      newappointmentDocs[key] = {};
      newappointmentDocs[key].upload_documents = latest_docs;
      this.setState({
        allAppointmentDocs: newappointmentDocs
      });
    }
  };

  customRequestUploadDocuments = key => async ({
    file,
    filename,
    onError,
    onProgress,
    onSuccess
  }) => {
    let { allAppointmentDocs = {} } = this.state;
    const { storeAppointmentDocuments } = this.props;

    let newAppointmentDocs = allAppointmentDocs[key];

    let data = new FormData();
    data.append("files", file);

    let uploadResponse = await doRequest({
      method: REQUEST_TYPE.POST,
      data: data,
      url: getUploadAppointmentDocumentUrl(key)
    });

    const {
      status = false,
      statusCode,
      payload: { data: responseData = {}, message: respMessage = "" } = {}
    } = uploadResponse;

    console.log("1398109830912 uploadResponse --> ", { uploadResponse });

    if (status) {
      message.success(respMessage);
    } else {
      message.warn(respMessage);
    }
  };

  handleChangeList = info => {
    const fileList = info.fileList;
    let { photos = [], photo = [] } = this.state;
    for (let item of fileList) {
      let uid = item.uid;
      let push = true;

      if (typeof item == "object") {
        for (let photo of photos) {
          let { name = "" } = item;
          let fileName = name;
          let newFileName = fileName.replace(/\s/g, "");
          if (photo.includes(newFileName)) {
            push = false;
          }
        }
      }
      if (push) {
        photo.push(item);
      }
    }

    this.setState({ photos: [...photos, ...photo] });
  };

  getUseTemplateComponent = (
    isOtherCarePlan,
    noMedication,
    firstTemplateName
  ) => {
    const { formatMessage } = this;
    return (
      <div className="flex flex-grow-1 direction-column justify-center hp100 align-center">
        <img src={noMedication} className="w200 h200" />
        <div className="fs20 fw700">
          {formatMessage(messages.nothing_to_show)}
        </div>
        {/* {showUseTemplate && (carePlanTemplateId || carePlanTemplateExists) ? ( */}
        {!isOtherCarePlan && (
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
        )}
        {/* ) :
                  showUseTemplate ? (
                    <div className='use-template-button' onClick={this.handleMedicationReminder}>
                      <div>{formatMessage(messages.add_medication)}</div>
                    </div>) : <div />} */}
      </div>
    );
  };

  openVideoScreen = () => {
    const { care_plans, doctors, patients } = this.props;
    const { selectedCarePlanId } = this.state;

    const { basic_info: { doctor_id, patient_id } = {} } =
      care_plans[selectedCarePlanId] || {};
    const { basic_info: { user_id: doctorUserId } = {} } =
      doctors[doctor_id] || {};
    const { basic_info: { user_id: patientUserID } = {} } =
      patients[patient_id] || {};

    const roomId = getRoomId(doctorUserId, patientUserID);

    window.open(
      `${config.WEB_URL}/test${getPatientConsultingVideoUrl(roomId)}`,
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
      symptoms = {},
      authenticated_user = null,
      reports = {},
      auth_role = null
    } = this.props;

    const {
      loading,
      templateDrawerVisible = false,
      carePlanTemplateId = 0,
      // carePlanTemplateExists = false,
      carePlanTemplateIds = [],
      patientCarePlanIds = [],
      showOtpModal,
      selectedCarePlanId,
      // current_careplan_id,
      isOtherCarePlan,
      symptom_dates = [],
      report_ids = []
    } = this.state;

    const {
      formatMessage,
      getMenu,
      getAppointmentsData,
      // getMedicationData,
      onCloseTemplate,
      onRowAppointment,
      // onRowMedication,
      // onRowSymptoms,
      handleRequestConsent,
      getConsentDetails,
      // handleOtpVerify,
      handleOtpCancel,
      handleCarePlanChange,
      getOtpModalFooter,
      getUseTemplateComponent,
      openVideoScreen
    } = this;

    // const AppointmentLocale = {
    //   emptyText: this.formatMessage(messages.emptyAppointmentTable)
    // };

    if (loading || !selectedCarePlanId) {
      return (
        <div className="page-loader hp100 wp100 flex align-center justify-center ">
          <Spin size="large"></Spin>
        </div>
      );
    }

    let doctorId = null;

    Object.keys(doctors).forEach(id => {
      const { basic_info: { user_id } = {} } = doctors[id] || {};

      if (user_id === authenticated_user) {
        doctorId = id;
      }
    });

    let reportsExist = false;
    Object.keys(reports).forEach(id => {
      const { basic_info: { patient_id: p_id } = {} } = reports[id] || {};
      if (parseInt(patient_id) === parseInt(p_id)) {
        reportsExist = true;
      }
    });

    let { basic_info: { name: firstTemplateName = "" } = {} } =
      care_plan_templates[care_plan_template_ids[0]] || {};

    // todo: dummy careplan
    let carePlanId = selectedCarePlanId;
    let cPAppointmentIds = [];
    let cPMedicationIds = [];
    let vitalIds = [];

    for (let carePlan of Object.values(care_plans)) {
      let {
        basic_info: { id = 1, doctor_id }
      } = carePlan;
      if (doctorId === `${doctor_id}`) {
        if (carePlanId === null) {
          carePlanId = id;
        }
      }

      if (id === selectedCarePlanId) {
        let {
          appointment_ids = [],
          medication_ids = [],
          vital_ids = []
        } = carePlan;

        cPAppointmentIds = appointment_ids;
        cPMedicationIds = medication_ids;
        vitalIds = vital_ids;
        carePlanId = selectedCarePlanId;
      }
    }

    const {
      basic_info: { doctor_id = 1 } = {},
      activated_on: treatment_start_date,
      details: {
        treatment_id = "",
        severity_id = "",
        condition_id = "",
        clinical_notes = "",
        diagnosis: {
          type: d_type = "",
          description: diagnosis_description = ""
        } = {},
        symptoms: carePlan_symptoms = ""
      } = {}
    } = care_plans[carePlanId] || {};
    const { basic_info: { name: treatment = "" } = {} } =
      treatments[treatment_id] || {};
    const { basic_info: { name: condition = "" } = {} } =
      conditions[condition_id] || {};
    const { basic_info: { name: severity = "" } = {} } =
      severities[severity_id] || {};

    const diagnosis_type_obj = DIAGNOSIS_TYPE[d_type] || {};
    const diagnosis_type = diagnosis_type_obj["value"] || "";

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

    let showUseTemplate = true;
    if (cPAppointmentIds.length || cPMedicationIds.length) {
      showUseTemplate = false;
    }

    let showTabs =
      cPAppointmentIds.length ||
      cPMedicationIds.length ||
      vitalIds.length ||
      symptom_dates.length ||
      report_ids.length ||
      reportsExist
        ? true
        : false;

    const {
      basic_info: {
        first_name,
        middle_name,
        last_name,
        full_name: patientFullName = "",
        user_id,
        age,
        gender,
        uid = "",
        user_id: patientUserId = ""
      } = {}
    } = patients[patient_id] || {};

    const roomId = getRoomId(doctorUserId, patientUserId);

    const { basic_info: { mobile_number = "", email, prefix = "" } = {} } =
      users[user_id] || {};

    const {
      close,
      openPopUp,
      user_details: { profile_picture: patient_display_picture } = {}
    } = this.props;

    const {
      treatment_details: { treatment_provider } = {}
    } = this.props.user_details;

    console.log("2347632645327453287648273648723",{props:this.props});

    let showAddButton =
      (authPermissions.includes(PERMISSIONS.ADD_APPOINTMENT) ||
        authPermissions.includes(PERMISSIONS.ADD_MEDICATION) ||
        authPermissions.includes(PERMISSIONS.ADD_ACTION) ||
        authPermissions.includes(PERMISSIONS.ADD_CAREPLAN)) &&
      !isOtherCarePlan;

    let docName = doctor_first_name
      ? `${doctor_first_name} ${
          doctor_middle_name ? `${doctor_middle_name} ` : ""
        }${doctor_last_name}`
      : "--";

    const {
      uploadDocsModalVisible = false,
      uploadDocsAppointmentId = null,
    } = this.state;


    const {basic_info : {user_role_id = null } = {} } = care_plans[selectedCarePlanId];

    return (
      <Fragment>
        <div className="pt10 pr10 pb10 pl10">
          <PatientProfileHeader
            formatMessage={formatMessage}
            getMenu={getMenu}
            showAddButton={showAddButton}
            selectedCarePlanId={selectedCarePlanId}
            auth_role={auth_role}
            user_role_id = {user_role_id}
          />

          <div className="flex wp100">
            <div className=" w350 pt10 pr24 pb20 pl24">
              <PatientCard
                patient_display_picture={patient_display_picture}
                patient_first_name={first_name}
                patient_middle_name={middle_name}
                patient_last_name={last_name}
                patientFullName={patientFullName}
                uid={uid}
                gender={gender}
                patient_age={age}
                patient_phone_number={`${
                  prefix ? `+${prefix} ` : ""
                }${mobile_number}`}
                patient_email_id={email ? email : ""}
                formatMessage={formatMessage}
                openChat={openPopUp}
                patients={patients}
                patient_id={patient_id}
                editPatient={this.handleEditPatientDrawer}
                editPatientOption={this.editPatientOption}
                openVideoScreen={openVideoScreen}
              />

              {/* {this.editPatientOption()} */}

              {/*<PatientCarePlans {...this.props}  />*/}
              <PatientCarePlans
                {...this.props}
                patientCarePlanIds={patientCarePlanIds}
                handleRequestConsent={handleRequestConsent}
                handleCarePlanChange={handleCarePlanChange}
                selectedCarePlanId={selectedCarePlanId}
                patient_id={patient_id}
                treatment_provider={
                  treatment_provider ? treatment_provider : "--"
                }
              />

              <PatientTreatmentCard
                selectedCarePlanId={selectedCarePlanId}
                formatMessage={formatMessage}
                treatment_name={treatment ? treatment : "--"}
                treatment_condition={condition ? condition : "--"}
                treatment_doctor={
                  doctor_first_name
                    ? getFullName({
                        first_name: doctor_first_name,
                        middle_name: doctor_middle_name,
                        last_name: doctor_last_name
                      })
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
                treatment_diagnosis_description={
                  diagnosis_description ? diagnosis_description : "--"
                }
                treatment_diagnosis_type={
                  diagnosis_type ? diagnosis_type : "--"
                }
                treatment_clinical_notes={
                  clinical_notes ? clinical_notes : "--"
                }
                treatment_symptoms={
                  carePlan_symptoms ? carePlan_symptoms : "--"
                }
              />
            </div>

            <div className="wp80 direction-column align-center pt10 pr24 pb20 pl24 ola123">
              {!isOtherCarePlan && user_role_id.toString() === auth_role.toString() && <PatientAlerts patientId={patient_id} />}

              {/* <div className="last-visit-alerts" >*/}
              {/*   <div className="last-visit-h-container" >*/}
              {/*     <span >Alerts from last visit</span>  */}
              {/*   </div>*/}
              {/*   */}
              {/*   <div className="last-visit-details">*/}
              {/*    */}
              {/*   </div>*/}
              {/*       */}
              {/*</div>*/}

              {!showTabs &&
                getUseTemplateComponent(
                  isOtherCarePlan,
                  noMedication,
                  firstTemplateName
                )}
              {showTabs && (
                <div className="flex-grow-1 direction-column align-center">
                  <div className="patient-tab mt20">
                    <Tabs defaultActiveKey="1">
                      <TabPane tab="Medication" key="1">
                        {cPMedicationIds.length > 0 ||
                        cPAppointmentIds.length > 0 ? (
                          <MedicationTable
                            patientId={patient_id}
                            carePlanId={carePlanId}
                            isOtherCarePlan={isOtherCarePlan}
                          />
                        ) : (
                          <div className="mt20">
                            {getUseTemplateComponent(
                              isOtherCarePlan,
                              noMedication,
                              firstTemplateName
                            )}
                          </div>
                        )}
                      </TabPane>
                      <TabPane tab="Appointments" key="2">
                        {cPMedicationIds.length > 0 ||
                        cPAppointmentIds.length > 0 ? (
                          <Table
                            columns={
                              !isOtherCarePlan &&
                              authPermissions.includes(
                                PERMISSIONS.EDIT_APPOINTMENT
                              )
                                ? columns_appointments
                                : columns_appointments_non_editable
                            }
                            dataSource={getAppointmentsData(carePlan, docName)}
                            onRow={
                              !isOtherCarePlan &&
                              authPermissions.includes(
                                PERMISSIONS.EDIT_APPOINTMENT
                              )
                                ? onRowAppointment
                                : null
                            }
                          />
                        ) : (
                          <div className="mt20">
                            {getUseTemplateComponent(
                              isOtherCarePlan,
                              noMedication,
                              firstTemplateName
                            )}
                          </div>
                        )}
                      </TabPane>

                      <TabPane tab="Symptoms" key="3">
                        <SymptomTabs patientId={patient_id} />
                      </TabPane>
                      <TabPane
                        tab={PATIENT_TABS.ACTIONS["name"]}
                        key={PATIENT_TABS.ACTIONS["key"]}
                      >
                        <VitalTable
                          patientId={patient_id}
                          carePlanId={carePlanId}
                          isOtherCarePlan={isOtherCarePlan}
                        />
                      </TabPane>
                      <TabPane
                        tab={PATIENT_TABS.REPORTS["name"]}
                        key={PATIENT_TABS.REPORTS["key"]}
                      >
                        <ReportTable patientId={patient_id} />
                      </TabPane>
                    </Tabs>
                  </div>
                </div>
              )}
            </div>
          </div>
          {!isOtherCarePlan && (
            <Fragment>
              <AddMedicationReminder
                patientId={patient_id}
                carePlanId={carePlanId}
              />
              <EditMedicationReminder
                patientId={patient_id}
                carePlanId={carePlanId}
              />

              <EditReportDrawer patient_id={patient_id} />

              <AddVitals carePlanId={carePlanId} />
              <EditVitals />
              <AddAppointmentDrawer carePlanId={carePlanId} />
              <AddCareplanDrawer patientId={patient_id} />
              <AddReportDrawer />

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
              <EditAppointmentDrawer
                carePlan={carePlan}
                carePlanId={carePlanId}
              />
            </Fragment>
          )}
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
                patientId={patient_id}
              />
            </div>
          )}
          <SymptomsDrawer />
          <VitalTimelineDrawer />
          <MedicationTimelineDrawer />
          <EditPatientDrawer />
        </div>
        <Modal
          visible={showOtpModal}
          title={formatMessage(messages.consent_modal_title_text)}
          // onOk={handleOtpVerify}
          onCancel={handleOtpCancel}
          // okText={formatMessage(messages.verify_otp_text)}
          footer={getOtpModalFooter()}
        >
          {getConsentDetails()}
        </Modal>

        {uploadDocsModalVisible && (
          <AppointmentUpload
            visible={uploadDocsModalVisible}
            appointmentId={uploadDocsAppointmentId}
            onCancel={this.closeAppointmentDocsModal}
          />
        )}
      </Fragment>
    );
  }
}

export default injectIntl(PatientDetails);
