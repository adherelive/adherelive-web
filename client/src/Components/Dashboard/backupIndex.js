// import React, { Component, Fragment } from "react";
// import { injectIntl } from "react-intl";
// import messages from "./message";
// import { connect } from "getstream";
// import {
//   TABLE_DEFAULT_BLANK_FIELD,
//   FEATURES,
//   MISSED_MEDICATION,
//   MISSED_APPOINTMENTS,
//   MISSED_ACTIONS,
//   MISSED_DIET,
//   MISSED_WORKOUT,
//   USER_PERMISSIONS,
// } from "../../constant";
// import Tabs from "antd/es/tabs";
// // import Patients from "../../Containers/Patient/paginatedTable";
// import Patients from "../../Containers/Patient/paginatedTable";
// import Watchlist from "../../Containers/Patient/paginatedWatchlist";
// import PatientDetailsDrawer from "../../Containers/Drawer/patientDetails";

// import ChatPopup from "../../Containers/ChatPopup";
// import AddPatientDrawer from "../Drawer/addPatient";
// import Loading from "../Common/Loading";
// import { withRouter } from "react-router-dom";
// import Donut from "../Common/graphs/donut";
// import GraphsModal from "./graphsModal";
// import { getPatientConsultingVideoUrl } from "../../Helper/url/patients";
// import { getPatientConsultingUrl } from "../../Helper/url/patients";
// import config from "../../config";
// import { message, Button, Spin, Menu, Dropdown, Modal } from "antd";
// import SearchPatient from "../../Containers/SearchPatient";
// import MissedAppointmentsDrawer from "../../Containers/Drawer/missedAppointment";
// import MissedVitalsDrawer from "../../Containers/Drawer/missedVital";
// import MissedMedicationsDrawer from "../../Containers/Drawer/missedMedication";
// import MissedDietsDrawer from "../../Containers/Drawer/missedDiet";
// import MissedWorkoutsDrawer from "../../Containers/Drawer/missedWorkout";

// // helpers...
// import { getRoomId } from "../../Helper/twilio";

// const { GETSTREAM_API_KEY, GETSTREAM_APP_ID } = config;
// const { TabPane } = Tabs;

// const CHART_MISSED_MEDICATION = "Missed Medication";
// const CHART_MISSED_APPOINTMENT = "Missed Appointment";
// const CHART_MISSED_ACTION = "Missed Action";
// const CHART_MISSED_DIET = "Missed Diet";
// const CHART_MISSED_WORKOUT = "Missed Workout";

// export const CURRENT_TAB = {
//   ALL_PATIENTS: "1",
//   WATCHLIST: "2",
// };

// export const SORTING_TYPE = {
//   SORT_BY_DATE: "0",
//   SORT_BY_NAME: "1",
// };

// export const SORT_CREATEDAT = "sort_createdAt";
// export const SORT_NAME = "sort_name";
// export const FILTER_DIAGNOSIS = "filter_diagnosis";
// export const FILTER_TREATMENT = "filter_treatment";
// export const OFFSET = "offset";

// class Dashboard extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       visible: false,
//       visibleModal: false,
//       graphsToShow: [],
//       doctorUserId: 1,
//       patient_ids: [],
//       showModal: false,
//       loading: false,
//       submitting: false,
//       currentTab: CURRENT_TAB.ALL_PATIENTS,
//       allPatientsTab: {
//         sort_createdAt: 1,
//         sort_name: null,
//         filter_diagnosis: "",
//         filter_treatment: "",
//         offset: 0,
//       },
//       watchlistTab: {
//         sort_createdAt: 1,
//         sort_name: null,
//         filter_diagnosis: "",
//         filter_treatment: "",
//         offset: 0,
//       },
//     };
//   }

//   async componentDidMount() {
//     const { authPermissions = [] } = this.props;
//     const {
//       searchMedicine,
//       getGraphs,
//       doctors = {},
//       authenticated_user,
//       closePopUp,
//       fetchChatAccessToken,
//       getAllFeatures,
//       getAllMissedScheduleEvents,
//     } = this.props;

//     this.setState({ loading: true });

//     closePopUp();
//     let doctorUserId = ""; //user_id of doctor
//     for (let doc of Object.values(doctors)) {
//       let { basic_info: { user_id, id = 1 } = {} } = doc;
//       if (parseInt(user_id) === parseInt(authenticated_user)) {
//         doctorUserId = authenticated_user;
//       }
//     }
//     this.setState({ graphLoading: true, doctorUserId });
//     getGraphs().then((response) => {
//       const {
//         status,
//         payload: { data: { user_preferences: { charts = [] } = {} } = {} } = {},
//       } = response;
//       if (status) {
//         this.setState({
//           graphsToShow: [...charts],
//           graphLoading: false,
//           loading: false,
//         });
//       } else {
//         this.setState({ loading: false });
//       }
//     });

//     if (authPermissions.length === 0) {
//       this.setState({ showModal: true });
//     }
//     fetchChatAccessToken(authenticated_user);
//     searchMedicine("");
//     getAllFeatures();
//     getAllMissedScheduleEvents();
//     this.initiateInAppNotificationObj();
//   }

//   // handleGetAllDietsForDoctor = async() => {
//   //   try{
//   //     const { getAllDietsForDoctor } = this.props;
//   //     const response = await getAllDietsForDoctor();
//   //     const { status, payload: { message : resp_msg = ''  } = {}  } =
//   //           response || {};

//   //     if(!status){
//   //       message.warn(resp_msg);

//   //     }
//   //   }catch(error){
//   //     console.log("error ===========>>>",{error});
//   //   }
//   // }

//   // initiateInAppNotificationObj = () => {
//   //   const { notificationToken, feedId, } = this.props;
//   //   if (notificationToken || feedId) {
//   //       let client = connect(
//   //           GETSTREAM_API_KEY,
//   //           notificationToken,
//   //           GETSTREAM_APP_ID
//   //       );

//   //       this.client = clientFeed;

//   //   }

//   //   this.updateUnseenNotificationData();
//   // };

//   // getFeedData = async() => {
//   //   let clientFeed = this.client.feed("notification", atob(this.feedId));
//   //   const data = await clientFeed.get({ limit: 30 });
//   //   return data;
//   // }

//   // updateUnseenNotificationData = async () => {
//   //   const data = await this.getFeedData();
//   //   const { unseen = 0 } = data || {};
//   //   this.props.updateUnseenInAppNotificationCount(unseen);
//   // };

//   initiateInAppNotificationObj = () => {
//     const { notificationToken, feedId } = this.props;
//     const { updateUnseenNotificationData } = this;

//     if (notificationToken || feedId) {
//       let clientFeed = connect(
//         config.GETSTREAM_API_KEY,
//         notificationToken,
//         config.GETSTREAM_APP_ID
//       );

//       this.client = clientFeed;
//     }

//     updateUnseenNotificationData();
//   };

//   getFeedData = async () => {
//     const { feedId } = this.props;
//     const limit = config.REACT_APP_NOTIFICATION_ONE_TIME_LIMIT;
//     let clientFeed = this.client.feed("notification", feedId);

//     const data = await clientFeed.get({ limit });
//     return data;
//   };

//   updateUnseenNotificationData = async () => {
//     const data = await this.getFeedData();
//     const { unseen = 0 } = data || {};
//     const { setUnseenNotificationCount } = this.props;
//     setUnseenNotificationCount(unseen);
//   };

//   changeTabState = ({ currentTab, type, value }) => {
//     let prevState = "";
//     if (currentTab === CURRENT_TAB.ALL_PATIENTS) {
//       const { allPatientsTab = {} } = this.state;
//       prevState = allPatientsTab;
//     } else {
//       const { watchlistTab = {} } = this.state;
//       prevState = watchlistTab;
//     }

//     let newState = prevState;
//     newState[type] = value;

//     if (currentTab === CURRENT_TAB.ALL_PATIENTS) {
//       this.setState({ allPatientsTab: newState });
//     } else {
//       this.setState({ watchwatchlistTab: newState });
//     }
//   };

//   sortByName = ({ currentTab }) => {
//     let prevState = "";
//     if (currentTab === CURRENT_TAB.ALL_PATIENTS) {
//       const { allPatientsTab = {} } = this.state;
//       prevState = allPatientsTab;
//     } else {
//       const { watchlistTab = {} } = this.state;
//       prevState = watchlistTab;
//     }

//     let newState = prevState;
//     newState["sort_createdAt"] = null;
//     newState["sort_name"] = 1;

//     if (currentTab === CURRENT_TAB.ALL_PATIENTS) {
//       this.setState({ allPatientsTab: newState });
//     } else {
//       this.setState({ watchwatchlistTab: newState });
//     }
//   };

//   sortByCreatedAt = ({ currentTab }) => {
//     let prevState = "";
//     if (currentTab === CURRENT_TAB.ALL_PATIENTS) {
//       const { allPatientsTab = {} } = this.state;
//       prevState = allPatientsTab;
//     } else {
//       const { watchlistTab = {} } = this.state;
//       prevState = watchlistTab;
//     }

//     let newState = prevState;
//     newState["sort_createdAt"] = 1;
//     newState["sort_name"] = null;

//     if (currentTab === CURRENT_TAB.ALL_PATIENTS) {
//       this.setState({ allPatientsTab: newState });
//     } else {
//       this.setState({ watchwatchlistTab: newState });
//     }
//   };

//   getMenu = () => {
//     const { authPermissions = [] } = this.props;
//     return (
//       <Menu>
//         {authPermissions.includes(USER_PERMISSIONS.PATIENTS.ADD) && (
//           <Menu.Item onClick={this.showAddPatientDrawer}>
//             <div>{this.formatMessage(messages.patients)}</div>
//           </Menu.Item>
//         )}
//         {authPermissions.includes(USER_PERMISSIONS.GRAPHS.UPDATE) && (
//           <Menu.Item onClick={this.showEditGraphModal}>
//             <div>{this.formatMessage(messages.graphs)}</div>
//           </Menu.Item>
//         )}
//       </Menu>
//     );
//   };

//   formatMessage = (data) => this.props.intl.formatMessage(data);

//   chartClicked = (name) => {
//     if (name === CHART_MISSED_APPOINTMENT) {
//       const { openMissedAppointmentDrawer } = this.props;
//       openMissedAppointmentDrawer();
//     } else if (name === CHART_MISSED_ACTION) {
//       const { openMissedVitalDrawer } = this.props;
//       openMissedVitalDrawer();
//     } else if (name === CHART_MISSED_MEDICATION) {
//       const { openMissedMedicationDrawer } = this.props;
//       openMissedMedicationDrawer();
//     } else if (name === CHART_MISSED_DIET) {
//       const { openMissedDietDrawer } = this.props;
//       openMissedDietDrawer();
//     } else if (name === CHART_MISSED_WORKOUT) {
//       const { openMissedWorkoutDrawer } = this.props;
//       openMissedWorkoutDrawer();
//     }
//   };

//   renderChartTabs = () => {
//     const { graphs, dashboard = {} } = this.props;
//     const {
//       medication_ids = {},
//       appointment_ids = {},
//       vital_ids = {},
//       diet_ids = {},
//       workout_ids = {},
//     } = dashboard;
//     const {
//       critical: medication_critical = [],
//       non_critical: medication_non_critical = [],
//     } = medication_ids;
//     const {
//       critical: vital_critical = [],
//       non_critical: vital_non_critical = [],
//     } = vital_ids;
//     const {
//       critical: appointment_critical = [],
//       non_critical: appointment_non_critical = [],
//     } = appointment_ids;
//     const {
//       critical: diet_critical = [],
//       non_critical: diet_non_critical = [],
//     } = diet_ids;
//     const {
//       critical: workout_critical = [],
//       non_critical: workout_non_critical = [],
//     } = workout_ids;

//     const medication_total =
//       medication_critical.length + medication_non_critical.length;
//     const vital_total = vital_critical.length + vital_non_critical.length;
//     const appointment_total =
//       appointment_critical.length + appointment_non_critical.length;
//     const diet_total = diet_critical.length + diet_non_critical.length;
//     const workout_total = workout_critical.length + workout_non_critical.length;

//     const { graphsToShow, graphLoading } = this.state;

//     // initial loading phase
//     if (graphLoading) {
//       return (
//         <div className="flex flex-grow-1 wp100 align-center justify-center">
//           <Spin />
//         </div>
//       );
//     }

//     const chartBlocks = graphsToShow.map((id) => {
//       const { name, type = "" } = graphs[id] || {};
//       let total = 0;
//       let critical = 0;

//       if (type === MISSED_MEDICATION) {
//         total = medication_total;
//         critical = medication_critical.length;
//       } else if (type === MISSED_APPOINTMENTS) {
//         total = appointment_total;
//         critical = appointment_critical.length;
//       } else if (type === MISSED_ACTIONS) {
//         total = vital_total;
//         critical = vital_critical.length;
//       } else if (type === MISSED_DIET) {
//         total = diet_total;
//         critical = diet_critical.length;
//       } else if (type === MISSED_WORKOUT) {
//         total = workout_total;
//         critical = workout_critical.length;
//       }

//       return (
//         <div key={`donut-div-${id}`} onClick={() => this.chartClicked(name)}>
//           <Donut
//             key={id}
//             id={id}
//             data={[critical, total - critical]}
//             total={total}
//             title={name}
//             formatMessage={this.formatMessage}
//           />
//         </div>
//       );
//     });
//     // no graph selected to show phase
//     if (graphsToShow.length === 0) {
//       return (
//         <div className="flex justify-center align-center fs20 fw600 wp100 bg-grey br5">
//           {this.formatMessage(messages.no_graph_text)}
//         </div>
//       );
//     } else {
//       return chartBlocks;
//     }
//   };

//   showAddPatientDrawer = () => {
//     this.setState({ visible: true });
//   };
//   showEditGraphModal = () => {
//     this.setState({ visibleModal: true });
//   };

//   addPatient = (data) => {
//     const { addPatient, authenticated_user } = this.props;

//     const { basic_info: { id = 1 } = {} } = authenticated_user || {};
//     this.setState({ submitting: true });
//     addPatient(data).then((response) => {
//       let {
//         status = false,
//         statusCode = 0,
//         payload: {
//           data: {
//             patient_ids = [],
//             care_plan_ids = [],
//             carePlanTemplateId = 0,
//           } = {},
//           message: responseMessage = "",
//         } = {},
//       } = response;
//       let showTemplateDrawer = carePlanTemplateId ? true : false;
//       let currentCarePlanId = care_plan_ids[0];
//       let patient_id = patient_ids ? patient_ids[0] : 0;
//       if (status) {
//         this.props.history.push({
//           pathname: `/patients/${patient_id}`,
//           state: { showTemplateDrawer, currentCarePlanId },
//         });

//         // })
//         this.setState({ submitting: false });
//       } else {
//         if (statusCode === 422) {
//           message.error(this.formatMessage(messages.patientExistError));
//         } else {
//           message.error(this.formatMessage(messages.somethingWentWrongError));
//         }

//         this.setState({ submitting: false });
//       }
//     });
//   };

//   editDisplayGraphs = (data) => {
//     let dataToUpdate = {};
//     dataToUpdate.chart_ids = data;
//     let { updateGraphs } = this.props;
//     updateGraphs(dataToUpdate).then((response) => {
//       const { status } = response;
//       if (status) {
//         this.setState({ graphsToShow: data, visibleModal: false });
//       } else {
//         message.error(this.formatMessage(messages.somethingWentWrongError));
//       }
//     });
//   };

//   hideAddPatientDrawer = () => {
//     this.setState({ visible: false });
//   };

//   hideEditGraphModal = () => {
//     this.setState({ visibleModal: false });
//   };

//   openVideoChatTab = async () => {
//     await this.props.getAllFeatures();

//     const videoCallBlocked = this.checkVideoCallIsBlocked();

//     if (videoCallBlocked) {
//       message.error(this.formatMessage(messages.videoCallBlocked));
//       return;
//     }
//     const {
//       patients,
//       twilio: { care_plan_id: currentCareplanId = 1 } = {},
//       auth_role: doctorRoleId = null,
//       care_plans,
//     } = this.props;
//     const { doctorUserId } = this.state;
//     // let { basic_info: { user_id: patientUserId = "" } = {} , user_role_id : patientRoleId = null  } = patients[
//     //   chatPatientId
//     // ];

//     // const roomId = getRoomId(doctorRoleId, patientRoleId);
//     const { channel_id: roomId } = care_plans[currentCareplanId] || {};

//     console.log("123921083 roomId", roomId);

//     window.open(
//       `${config.WEB_URL}/test${getPatientConsultingVideoUrl(roomId)}`,
//       "_blank"
//     );
//   };

//   checkVideoCallIsBlocked = () => {
//     const { features_mappings = {} } = this.props;
//     let videoCallBlocked = false;
//     const videoCallFeatureId = this.getFeatureId(FEATURES.VIDEO_CALL);
//     const otherUserCategoryId = this.getOtherUserCategoryId();
//     const { [otherUserCategoryId]: mappingsData = [] } = features_mappings;

//     if (mappingsData.indexOf(videoCallFeatureId) >= 0) {
//       videoCallBlocked = false;
//     } else {
//       videoCallBlocked = true;
//     }

//     return videoCallBlocked;
//   };

//   getFeatureId = (featureName) => {
//     const { features = {} } = this.props;
//     const featuresIds = Object.keys(features);

//     for (const id of featuresIds) {
//       const { [id]: { name = null } = ({} = {}) } = features;

//       if (name === featureName) {
//         return parseInt(id, 10);
//       }
//     }

//     return null;
//   };

//   getOtherUserCategoryId = () => {
//     const {
//       twilio: { patientId = 1 },
//     } = this.props;
//     return patientId;
//   };

//   maximizeChat = () => {
//     const {
//       patients,
//       twilio: { patientId: chatPatientId = 1 },
//     } = this.props;
//     window.open(
//       `${config.WEB_URL}${getPatientConsultingUrl(chatPatientId)}`,
//       "_blank"
//     );
//   };

//   getVerifyModal = () => {
//     const { showVerifyModal = false } = this.props;
//     return (
//       <div className="wp100 flex justify-center align-center">
//         <Modal
//           className="mt62"
//           visible={showVerifyModal}
//           closable
//           mask
//           maskClosable
//           onCancel={this.closeModal}
//           wrapClassName=""
//           width={`50%`}
//           footer={null}
//         >
//           <div className="fs24 fw700 flex justify-center p10 mt20 mb20">
//             {this.formatMessage(messages.welcome_onboard_text)}
//           </div>
//           <div className="wp100 fs16 text-center mb20">
//             {this.formatMessage(messages.pending_verify_content_text)}
//           </div>
//         </Modal>
//       </div>
//     );
//   };

//   closeModal = () => {
//     const { showVerifyModal } = this.props;
//     showVerifyModal(false);
//   };

//   changeTab = (tab) => {
//     this.setState({ currentTab: tab });
//   };

//   getProviderBanner = () => {
//     const { providers = {}, doctor_provider_id = null } = this.props;
//     const { details: { banner = "" } = {} } =
//       providers[doctor_provider_id] || {};

//     if (!doctor_provider_id || !banner) {
//       return null;
//     }

//     return (
//       <div>
//         <img
//           src={banner}
//           alt="provider-banner"
//           style={{ height: "80px", width: "auto" }}
//         />
//       </div>
//     );
//   };

//   render() {
//     const {
//       doctors = {},
//       authenticated_user,
//       graphs,
//       treatments,
//       conditions,
//       severity,
//       patients,
//       authPermissions = [],
//       chats: { minimized = false, visible: popUpVisible = false },
//       drawer: { visible: drawerVisible = false } = {},
//       ui_features: { showVerifyModal = false } = {},
//       twilio: { patientId: chatPatientId = 1, care_plan_id },
//       auth_role: doctorRoleId = null,
//       authenticated_category,
//       care_plans,
//     } = this.props;
//     const { payload: { patient_id } = {} } = this.props;

//     let doctorID = null;
//     let docName = "";
//     Object.keys(doctors).forEach((id) => {
//       const { basic_info: { user_id } = {} } = doctors[id] || {};

//       if (user_id === authenticated_user) {
//         doctorID = id;
//       }
//     });
//     const { basic_info: { full_name } = {} } = doctors[doctorID] || {};
//     docName = full_name ? `Dr. ${full_name}` : TABLE_DEFAULT_BLANK_FIELD;

//     // console.log("198237837128 getCookie", this.getCookie("accessToken"));

//     const {
//       formatMessage,
//       renderChartTabs,
//       getVerifyModal,
//       changeTab,
//       getProviderBanner,
//     } = this;

//     let {
//       basic_info: {
//         user_id: patientUserId = "",
//         first_name = "",
//         middle_name = "",
//         last_name = "",
//       } = {},
//       user_role_id: patientRoleId = null,
//       details: { profile_pic: patientDp = "" } = {},
//     } = patients[patient_id] || {};

//     const {
//       visible,
//       graphsToShow,
//       visibleModal,
//       doctorUserId,
//       loading = false,
//       submitting = false,
//       currentTab = CURRENT_TAB.ALL_PATIENTS,
//       allPatientsTab,
//       watchlistTab,
//     } = this.state;

//     // const roomId = getRoomId(doctorRoleId, patientRoleId);

//     const { channel_id: roomId } = care_plans[care_plan_id] || {};

//     let bannerFlag = true;
//     const { providers = {}, doctor_provider_id = null } = this.props;
//     const { details: { banner = "" } = {} } =
//       providers[doctor_provider_id] || {};

//     if (!doctor_provider_id || !banner) {
//       bannerFlag = false;
//     }

//     if (
//       Object.keys(graphs).length === 0 ||
//       loading ||
//       docName === TABLE_DEFAULT_BLANK_FIELD
//     ) {
//       return (
//         <div className="hvh100 flex direction-column align-center justify-center">
//           <Loading className={"wp100"} />
//         </div>
//       );
//     }

//     return (
//       <Fragment>
//         <div className=" dashboard p20">
//           <div
//             className={`flex direction-row justify-space-between align-center`}
//           >
//             {bannerFlag ? (
//               getProviderBanner()
//             ) : (
//               <div className={bannerFlag ? "mt14" : ""}>
//                 {docName !== "" ? (
//                   <div className="fs28 fw700">
//                     {formatMessage(messages.welcome)}, {docName}
//                   </div>
//                 ) : (
//                   <div className="fs28 fw700">
//                     {formatMessage(messages.dashboard)}
//                   </div>
//                 )}
//               </div>
//             )}
//             {(authPermissions.includes(USER_PERMISSIONS.PATIENTS.ADD) ||
//               authPermissions.includes(USER_PERMISSIONS.GRAPHS.UPDATE)) && (
//               <div className="flex direction-row justify-space-between align-center w500">
//                 <SearchPatient />

//                 <Dropdown
//                   className={"mr10 "}
//                   overlay={this.getMenu()}
//                   trigger={["click"]}
//                   placement="bottomRight"
//                 >
//                   <Button
//                     type="primary"
//                     className="ml10 add-button "
//                     icon={"plus"}
//                   >
//                     <span className="fs16">Add</span>
//                   </Button>
//                 </Dropdown>
//               </div>
//             )}
//           </div>

//           {/* }   */}

//           {/* }   */}

//           {bannerFlag && (
//             <div className="mt14">
//               {docName !== "" ? (
//                 <div className="fs28 fw700">
//                   {formatMessage(messages.welcome)}, {docName}
//                 </div>
//               ) : (
//                 <div className="fs28 fw700">
//                   {formatMessage(messages.dashboard)}
//                 </div>
//               )}
//             </div>
//           )}

//           <section className="horizontal-scroll-wrapper pr10 mt10">
//             {renderChartTabs()}
//           </section>

//           <div className="mt20 fs20 fw700">
//             {formatMessage(messages.patients)}
//           </div>

//           <Tabs
//             tabPosition="top"
//             defaultActiveKey={CURRENT_TAB.ALL_PATIENTS}
//             activeKey={currentTab}
//             onTabClick={changeTab}
//           >
//             <TabPane
//               tab={
//                 <span className="fs16 fw600">
//                   {formatMessage(messages.summary)}
//                 </span>
//               }
//               key={CURRENT_TAB.ALL_PATIENTS}
//             >
//               {currentTab === CURRENT_TAB.ALL_PATIENTS && (
//                 <Patients
//                   currentTab={currentTab}
//                   tabState={allPatientsTab}
//                   changeTabState={this.changeTabState}
//                   sortByName={this.sortByName}
//                   sortByCreatedAt={this.sortByCreatedAt}
//                 />
//               )}
//             </TabPane>

//             <TabPane
//               tab={
//                 <span className="fs16 fw600">
//                   {formatMessage(messages.watchList)}
//                 </span>
//               }
//               key={CURRENT_TAB.WATCHLIST}
//             >
//               {currentTab === CURRENT_TAB.WATCHLIST && (
//                 <Watchlist
//                   currentTab={currentTab}
//                   tabState={watchlistTab}
//                   changeTabState={this.changeTabState}
//                   sortByName={this.sortByName}
//                   sortByCreatedAt={this.sortByCreatedAt}
//                 />
//               )}
//             </TabPane>
//           </Tabs>
//         </div>
//         <PatientDetailsDrawer />
//         {popUpVisible && (
//           <div
//             className={
//               drawerVisible && minimized
//                 ? "chat-popup-minimized"
//                 : drawerVisible && !minimized
//                 ? "chat-popup"
//                 : minimized
//                 ? "chat-popup-minimized-closedDrawer"
//                 : "chat-popup-closedDrawer"
//             }
//           >
//             <ChatPopup
//               roomId={roomId}
//               placeVideoCall={this.openVideoChatTab}
//               patientName={
//                 first_name
//                   ? `${first_name} ${middle_name ? `${middle_name} ` : ""}${
//                       last_name ? `${last_name}` : ""
//                     }`
//                   : ""
//               }
//               maximizeChat={this.maximizeChat}
//               patientDp={patientDp}
//               patientId={chatPatientId}
//               dashboardChat={true}
//             />
//           </div>
//         )}

//         <AddPatientDrawer
//           searchCondition={this.props.searchCondition}
//           searchTreatment={this.props.searchTreatment}
//           searchSeverity={this.props.searchSeverity}
//           searchPatientFromNum={this.props.searchPatientFromNum}
//           treatments={treatments}
//           conditions={conditions}
//           severity={severity}
//           close={this.hideAddPatientDrawer}
//           visible={visible}
//           submit={this.addPatient}
//           patients={patients}
//           submitting={submitting}
//         />

//         {visibleModal && (
//           <GraphsModal
//             visible={visibleModal}
//             handleCancel={this.hideEditGraphModal}
//             handleOk={this.editDisplayGraphs}
//             selectedGraphs={graphsToShow}
//             authenticated_category={authenticated_category}
//           />
//         )}

//         <MissedAppointmentsDrawer />

//         <MissedVitalsDrawer />

//         <MissedMedicationsDrawer />

//         <MissedDietsDrawer />

//         <MissedWorkoutsDrawer />

//         {authPermissions.length === 0 ? (
//           <div className="fixed b0 p20 bg-light-grey wp100">
//             <div className="fs18 fw700">
//               {this.formatMessage(messages.important_note_text).toUpperCase()}
//             </div>
//             <div className="wp100 ht20 fs16 text-left">
//               {this.formatMessage(messages.pending_verify_content_text)}
//             </div>
//             <span className="wp100 ht20 fs16 text-left">
//               {this.formatMessage(messages.pending_verify_content_other_text)}
//             </span>{" "}
//             <a
//               href={`mailto:${config.ADHERE_LIVE_CONTACT_LINK}?subject=${config.mail.VERIFICATION_PENDING_MESSAGE}`}
//               target={"_blank"}
//             >
//               <span className="wp100 ht20 fs16 text-left">
//                 {this.formatMessage(messages.adhere_support_text)}
//               </span>
//             </a>
//           </div>
//         ) : null}
//       </Fragment>
//     );
//   }
// }

// export default withRouter(injectIntl(Dashboard));
