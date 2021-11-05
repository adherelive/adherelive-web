import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Drawer, Select, Form, message } from "antd";
import config from "../../../config";
import moment from "moment";
import { connect } from "getstream";
import messages from "./message";
import {
  NOTIFICATION_STAGES,
  EVENT_TYPE,
  AGORA_CALL_NOTIFICATION_TYPES,
  TYPE_SYMPTOMS,
  TYPE_APPOINTMENTS,
  TYPE_VITALS,
  TYPE_DIETS,
  TYPE_USER_MESSAGE,
  APPOINTMENT_TYPE_TITLE,
  MEDICATION_TIMING,
  TYPE_WORKOUTS,
  PATIENT_MEAL_TIMINGS,
  // WHEN_TO_TAKE_ABBR_TYPES,
} from "../../../constant";
import VideoCameraFilled from "@ant-design/icons/VideoCameraFilled";
import MessageFilled from "@ant-design/icons/MessageFilled";
import MedicineBoxFilled from "@ant-design/icons/MedicineBoxFilled";
import AlertFilled from "@ant-design/icons/AlertFilled";
import ClockCircleFilled from "@ant-design/icons/ClockCircleFilled";
import ClockCircleOutlined from "@ant-design/icons/ClockCircleOutlined";
import CoffeeOutlined from "@ant-design/icons/CoffeeOutlined";
import Loading from "../../Common/Loading";
import { throttle } from "lodash";
import { getPatientConsultingVideoUrl } from "../../../Helper/url/patients";
import workout_icon from "../../../Assets/images/workout_icon.png";
import vital_icon from "../../../Assets/images/vital.png";

// import { getNotifications } from "../../../Helper/urls/notifications";
const { Option } = Select;
const APPOINTMENT = "appointment";
// const MEDICATION = "medication";
// const MEDICATION_REMINDER = "medication-reminder";
const USER_MESSAGE = "USER_MESSAGE";
const VITALS = "vitals";

const { GETSTREAM_API_KEY, GETSTREAM_APP_ID } = config;

const CATEGORY = {
  ALL: "All",
  APPOINTMENT: "Appointment",
  SYMPTOMS: "Symptoms",
  USER_MESSAGES: "User Messages",
  CALL: "Call",
  VITAL: "Vital",
  DIET: "Diet",
  WORKOUT: "Workout",
};

const DURATION = {
  ALL: "All",
  CURRENT_MONTH: "Current Month",
  PREVIOUS_MONTH: "Previous Month",
  BEFORE_THREE_MONTHS: "Last Three Months", // excluding current month, past three
};

const { Item: FormItem } = Form;

class NotificationDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: CATEGORY.ALL,
      duration: DURATION.ALL,
      loading: false,
      loadMore: false,
      missedCallNotificationIds: [],
      drawerNode: null,
      page_limit: 0,
      no_notification_remaining: false,
    };
    this.client = null;
    this.clientFeed = null;

    this.handleScroll = throttle(this.handleScroll.bind(this), 1000);
  }

  componentDidMount() {}

  componentWillUnmount() {
    const { drawerNode = null } = this.state;

    if (drawerNode) {
      drawerNode.removeEventListener("scroll", this.handleScroll);
    }
  }

  getNotificationData = async ({
    limit = config.NOTIFICATION_ONE_TIME_LIMIT,
    loadMore = false,
  }) => {
    const {
      auth: { notificationToken = "", feedId = "" } = {},
      notifications = {},
      visible = false,
    } = this.props;

    if (notificationToken || feedId) {
      this.client = connect(
        GETSTREAM_API_KEY,
        notificationToken,
        GETSTREAM_APP_ID
      );

      this.clientFeed = this.client.feed("notification", feedId);

      let offset = 0;
      if (loadMore) {
        this.setState({ loadMore });
        offset = Object.keys(notifications).length;
      } else {
        this.setState({ loading: true });
      }

      await this.clientFeed.get().then(async (data) => {
        const { results = [] } = data || {};
        console.log("8687263876128631321", { data, results });
        if (results.length) {
          await this.getNotificationFromActivities(data);
          this.setMissedCallNoti();

          if (visible) {
            await this.clientFeed.get({ mark_seen: true }).then((data) => {
              this.clientFeed.get({ limit }).then((data) => {
                // this.getNotificationFromActivities(data);
              });
            });

            // await this.markAllMissedCallRead();
          }

          this.setState({
            loading: false,
            loadMore: false,
            no_notification_remaining: false,
          });
        } else {
          this.setState({
            loading: false,
            loadMore: false,
            no_notification_remaining: true,
          });
        }
      });
    }
  };

  handleScroll = async (event) => {
    const target = event.target;
    const { no_notification_remaining = false } = this.state;
    const { notifications = {} } = this.props;
    const { getNotificationData } = this;

    if (target.scrollHeight - target.scrollTop === target.clientHeight) {
      try {
        const currentNotificationsCount = Object.keys(notifications).length;

        if (
          currentNotificationsCount %
            parseInt(config.NOTIFICATION_ONE_TIME_LIMIT) ===
            0 &&
          !no_notification_remaining
        ) {
          await getNotificationData({ loadMore: true });
        } else {
          this.setState({ no_notification_remaining: true });
        }
      } catch (error) {
        console.log("handle load more on scroll catch error", error);
      }
    }
  };

  async componentDidUpdate(prevProps, prevState) {
    const { visible = false, notifications = {} } = this.props;
    const { visible: prev_visible = false } = prevProps;
    let finalNode = null;

    if (visible && visible !== prev_visible) {
      await this.getNotificationData({});

      const pageLimit = config.NOTIFICATION_ONE_TIME_LIMIT || 0;
      const intPageLimit = parseInt(pageLimit) || 0;
      this.setState({ page_limit: intPageLimit });

      const drawerContainer = document.getElementsByClassName("Drawer");
      const drawer = drawerContainer[0] || null;
      const childNodes = drawer && drawer.childNodes;
      const drawerNode = childNodes && childNodes[1];
      const drawerContentwrapperChildNodes =
        drawerNode && drawerNode.childNodes;
      const emp =
        drawerContentwrapperChildNodes && drawerContentwrapperChildNodes[0];
      const empChildNodes = emp && emp.childNodes;
      finalNode = empChildNodes && empChildNodes[0];

      if (finalNode) {
        this.setState({ drawerNode: finalNode });
        finalNode.addEventListener("scroll", this.handleScroll);
      }
    }
  }

  //   getNotificationData = () => {
  //     const {
  //       auth: { notificationToken = "", feedId = "" } = {},
  //       visible = false,
  //     } = this.props;
  //     const { page_limit = 0 } = this.state;
  //     if (notificationToken || feedId) {
  //       this.setState({ loading: true });

  //       let client = connect(
  //         GETSTREAM_API_KEY,
  //         notificationToken,
  //         GETSTREAM_APP_ID
  //       );

  //       let clientFeed = client.feed("notification", feedId);

  //       this.setState({ clientFeed });
  //       clientFeed.get({ limit: page_limit }).then(async (data) => {
  //         await this.getNotificationFromActivities(data);
  //         this.setMissedCallNoti();
  //       });

  //       if (visible) {
  //         clientFeed.get({ limit: page_limit, mark_seen: true }).then((res) => {
  //           // this.getNotificationFromActivities(res);
  //         });
  //       }
  //     }
  //   };

  setMissedCallNoti = () => {
    const { notifications = {} } = this.props;
    let missedCallNotificationIds = [];
    for (let each in notifications) {
      const {
        type = "",
        notification_id = "",
        is_read = false,
      } = notifications[each] || {};
      if (
        (type === AGORA_CALL_NOTIFICATION_TYPES.MISSED_CALL ||
          type === AGORA_CALL_NOTIFICATION_TYPES.START_CALL) &&
        !is_read
      ) {
        missedCallNotificationIds.push(notification_id);
      }
    }
    this.setState({ missedCallNotificationIds });
  };

  getNotificationFromActivities = async (data) => {
    try {
      const { getNotification, updateUnseenNotification } = this.props;
      let activities = [];
      let activitiesId = [];
      let groupId = {};
      const { results = [], unseen } = data;

      results.forEach((result) => {
        const { activities: response = [], is_read, is_seen, id } = result;
        let activityData = {};
        activityData.activity = response;
        activityData.is_read = is_read;
        activityData.is_seen = is_seen;

        activities = activities.concat(activityData);
        const { id: activity_id } = response[0] || {};
        activitiesId = activitiesId.concat(activity_id);
        groupId[activity_id] = id;
      });

      activities.sort((a, b) => {
        if (a.time < b.time) {
          return -1;
        }
        return 1;
      });
      this.setState({
        notifications: activitiesId,
        activityGroupId: groupId,
      });

      const res = await getNotification({ activities });

      this.setState({ loading: false });
    } catch (error) {
      this.setState({ loading: false });
      message.warn(this.formatMessage(messages.somethingWentWrong));
    }
  };

  readNotification = async (groupId, activity_id) => {
    const { auth: { notificationToken = "", feedId = "" } = {} } = this.props;
    const { page_limit = 0 } = this.state;
    // if (notificationToken || feedId) {
    //   let client = connect(
    //     GETSTREAM_API_KEY,
    //     notificationToken,
    //     GETSTREAM_APP_ID
    //   );

    //   let clientFeed = client.feed("notification", feedId);

    this.clientFeed
      .get({ mark_read: [groupId], limit: page_limit })
      .then((data) => {
        // this.clientFeed.get({ limit: page_limit }).then((data) => {
        //   // console.log("2934y98237498238423 data-=-=-=-=-=-=-=-=-=-=-==-=-=>", {activity_id,data});
        //   this.getNotificationFromActivities(data);
        // });
      });
    // }
  };

  markAllSeen = (e) => {
    const { auth: { notificationToken = "", feedId = "" } = {} } = this.props;
    const { page_limit = 0 } = this.state;
    // if (notificationToken || feedId) {
    //   let client = connect(
    //     GETSTREAM_API_KEY,
    //     notificationToken,
    //     GETSTREAM_APP_ID
    //   );

    // this.clientFeed = this.client.feed("notification", feedId);
    this.clientFeed.get({ mark_seen: true }).then((data) => {
      this.clientFeed.get({ limit: page_limit }).then((data) => {
        // this.getNotificationFromActivities(data);
      });
    });
    // }
  };

  // handlePatientDetailsRedirect = (patient_id) => () => {
  //   const { history, close } = this.props;
  //   history.push(`/patients/${patient_id}`);
  //   close();
  // };

  handlePatientDetailsRedirectSymptoms =
    (patient_id, care_plan_id, notification_id) => async () => {
      const intCPId = parseInt(care_plan_id);
      const intPatientId = parseInt(patient_id);
      const { history, close, doNotificationRedirect } = this.props;
      const resp = await doNotificationRedirect({
        type: TYPE_SYMPTOMS,
        patient_id: intPatientId,
        care_plan_id: intCPId,
      });
      const { activityGroupId = {} } = this.state;
      const groupId = activityGroupId[notification_id] || null;
      if (patient_id) {
        this.readNotification(groupId, notification_id);
        history.push(`/patients/${patient_id}`);
        close();
      }
    };

  // handleMissedCallClick = async (notification_id) => {
  //   // console.log("2934y98237498238423 ^^^^^^^^^^^^",{notification_id,state:this.state});
  //   const { activityGroupId = {} } = this.state;
  //   const groupId = activityGroupId[notification_id] || null;
  //   await this.readNotification(groupId, notification_id);
  // };

  handlePatientDetailsRedirectAppointments =
    (patient_id, care_plan_id, notification_id) => async () => {
      const intCPId = parseInt(care_plan_id);
      const intPatientId = parseInt(patient_id);
      const { history, close, doNotificationRedirect } = this.props;
      const resp = await doNotificationRedirect({
        type: TYPE_APPOINTMENTS,
        patient_id: intPatientId,
        care_plan_id: intCPId,
      });

      const { activityGroupId = {} } = this.state;
      const groupId = activityGroupId[notification_id] || null;
      if (patient_id) {
        this.readNotification(groupId, notification_id);
        history.push(`/patients/${patient_id}`);
        close();
      }
    };

  handlePatientDetailsRedirectDiets =
    (patient_id, care_plan_id, notification_id) => async () => {
      const intCPId = parseInt(care_plan_id);
      const intPatientId = parseInt(patient_id);
      const { history, close, doNotificationRedirect } = this.props;
      const resp = await doNotificationRedirect({
        type: TYPE_DIETS,
        patient_id: intPatientId,
        care_plan_id: intCPId,
      });

      const { activityGroupId = {} } = this.state;
      const groupId = activityGroupId[notification_id] || null;
      if (patient_id) {
        this.readNotification(groupId, notification_id);
        history.push(`/patients/${patient_id}`);
        close();
      }
    };

  handlePatientDetailsRedirectWorkouts =
    (patient_id, care_plan_id, notification_id) => async () => {
      const intCPId = parseInt(care_plan_id);
      const intPatientId = parseInt(patient_id);
      const { history, close, doNotificationRedirect } = this.props;
      const resp = await doNotificationRedirect({
        type: TYPE_WORKOUTS,
        patient_id: intPatientId,
        care_plan_id: intCPId,
      });

      const { activityGroupId = {} } = this.state;
      const groupId = activityGroupId[notification_id] || null;
      if (patient_id) {
        this.readNotification(groupId, notification_id);
        history.push(`/patients/${patient_id}`);
        close();
      }
    };

  handlePatientChatFullScreen = (patient_id, notification_id) => async () => {
    const { history, close, doNotificationRedirect } = this.props;
    const resp = await doNotificationRedirect({
      type: TYPE_USER_MESSAGE,
      patient_id,
      care_plan_id: null,
    });
    const { activityGroupId = {} } = this.state;
    const groupId = activityGroupId[notification_id] || null;
    if (patient_id) {
      this.readNotification(groupId, notification_id);
      history.push(`/patient-consulting/${patient_id}`);
      close();
    }
  };

  getDurationflag = (noti_time) => {
    const { duration = DURATION.ALL } = this.state;

    let flag = false;

    switch (duration) {
      case DURATION.ALL:
        flag = true;
        break;
      case DURATION.CURRENT_MONTH:
        const previousMonth = moment().subtract(1, "M");
        const previousMonthLastDate = moment(previousMonth).endOf("month");

        flag = moment(previousMonthLastDate).isBefore(moment(noti_time), "day");

        break;
      case DURATION.PREVIOUS_MONTH:
        const prevMonth = moment().subtract(1, "M");
        const prevMonthLastDate = moment(prevMonth).endOf("month");
        const prevMonthFirstDate = moment(prevMonth).startOf("month");

        flag =
          moment(noti_time).isSameOrBefore(moment(prevMonthLastDate), "day") &&
          moment(noti_time).isSameOrAfter(moment(prevMonthFirstDate), "day");

        //  console.log("7832486218321312312 === >>> ",{
        //      str:
        //      `${moment(noti_time)}.isSameOrBefore(${moment(prevMonthLastDate)},'day') && ${moment(noti_time)}.isSameOrAfter(${moment(prevMonthFirstDate)},'day')
        //      `,
        //      noti_time});

        break;
      case DURATION.BEFORE_THREE_MONTHS:
        const pMonth = moment().subtract(1, "M");
        const pMonthLastDate = moment(pMonth).endOf("month");
        const pThreeMonth = moment().subtract(3, "M");
        const pThreeMonthFirstDate = moment(pThreeMonth).startOf("month");
        flag =
          moment(noti_time).isSameOrBefore(moment(pMonthLastDate), "day") &&
          moment(noti_time).isSameOrAfter(moment(pThreeMonthFirstDate), "day");

        // console.log("7832486218321312312 === >>> ",{
        //     str:
        //     `${moment(noti_time)}.isSameOrBefore(${moment(pMonthLastDate)},'day') && ${moment(noti_time)}.isSameOrAfter(${moment(pThreeMonthFirstDate)},'day')
        //     `,
        //     noti_time});
        break;
      default:
        flag = false;
    }

    return flag;
  };

  getNextKey = (currentKey) => {
    const { notifications = {} } = this.props;
    let keys = Object.keys(notifications);
    let idIndex = keys.indexOf(currentKey);
    let nextIndex = (idIndex += 1);

    if (nextIndex >= keys.length) {
      //lI
      return;
    }
    let nextKey = keys[nextIndex];
    return nextKey;
  };

  getAllNotification = () => {
    const { notifications = {} } = this.props;

    let all = [],
      unread = [],
      read = [];

    let notificationDates = [];

    for (let each in notifications) {
      const notification = notifications[each] || {};
      console.log("876876238682368762782782", { notification });
      const {
        time: date = "",
        is_read = false,
        stage = "",
        type = "",
        start_time = "",
      } = notification;
      const dataTorender = this.getSingleNotification(notification) || null;
      let eachDate = moment(date).format("Do MMM YYYY");
      if (type === APPOINTMENT && stage === NOTIFICATION_STAGES.START) {
        eachDate = moment(start_time).format("Do MMM YYYY");
      }

      // if (is_read) {
      //   dataTorender && read.push(dataTorender);
      // } else {
      //   dataTorender && unread.push(dataTorender);
      // }

      // notificationComponents.push(dataTorender);

      const displayDate = (
        <div className="ml8 mt10 mb10 fw800" key={`${eachDate}`}>
          {eachDate === moment().format("Do MMM YYYY")
            ? this.formatMessage(messages.todayText)
            : eachDate}
        </div>
      );

      if (notificationDates.indexOf(eachDate) === -1 && dataTorender) {
        all.push(displayDate);
        notificationDates.push(eachDate);
      }

      all.push(dataTorender);

      // if (nextKey) {
      //   const {
      //     time: nextDateVal = "",
      //     stage = "",
      //     type = "",
      //     start_time = "",
      //   } = notifications[nextKey] || {};

      //   let nextDate = moment(nextDateVal).format("Do MMM YYYY");
      //   if (type === APPOINTMENT && stage === NOTIFICATION_STAGES.START) {
      //     nextDate = moment(start_time).format("Do MMM YYYY");
      //   }

      //   if (eachDate !== nextDate) {
      //     all.push(displayDate);
      //   }
      // } else {
      //   all.push(displayDate);
      // }
    }
    return all;
  };

  handleRedirect =
    ({ type, path, patient_id, care_plan_id, notification_id, foreign_id }) =>
    async (e) => {
      e.preventDefault();
      const { history, close, doNotificationRedirect } = this.props;
      const { readNotification } = this;
      await doNotificationRedirect({
        type: type,
        foreign_id,
        patient_id,
        care_plan_id,
      });

      const { activityGroupId = {} } = this.state;
      const groupId = activityGroupId[notification_id] || null;
      readNotification(groupId, notification_id);
      history.push(path);
      close();
    };

  handleVitalRedirect =
    (patient_id, care_plan_id, notification_id) => async (e) => {
      const intCPId = parseInt(care_plan_id);
      const intPatientId = parseInt(patient_id);
      e.preventDefault();
      const { history, close, doNotificationRedirect } = this.props;
      const { readNotification } = this;
      const resp = await doNotificationRedirect({
        type: TYPE_VITALS,
        patient_id: intPatientId,
        care_plan_id: intCPId,
      });

      const { activityGroupId = {} } = this.state;
      const groupId = activityGroupId[notification_id] || null;
      if (patient_id) {
        readNotification(groupId, notification_id);
        history.push(`/patients/${patient_id}`);
        close();
      }
    };

  handleMissedCallRedirect =
    ({ foreign_id, notification_id }) =>
    async (e) => {
      e.preventDefault();
      const { close } = this.props;
      const { activityGroupId = {} } = this.state;
      const { readNotification } = this;

      const groupId = activityGroupId[notification_id] || null;
      await readNotification(groupId, notification_id);
      close();

      window.open(
        `${config.WEB_URL}/test${getPatientConsultingVideoUrl(foreign_id)}`,
        "_blank"
      );
    };

  getSingleNotification = (notification) => {
    const {
      appointments = {},
      patients = {},
      schedule_events = {},
    } = this.props;
    const { category = CATEGORY.ALL } = this.state;
    const { handleVitalRedirect, handleMissedCallRedirect, formatMessage } =
      this;

    let date = "";
    const today = moment().format("Do MMM YYYY");
    let title = "";
    let patientName = "";
    let time = "";
    let purpose = "";
    let medicine = "";
    let patient_id = "";
    let foreignId = foreign_id;
    let msgFrom = "";
    let newDate = false,
      dataToRender = null;

    const {
      is_read = false,
      notification_id = null,
      create_time = "",
      type = "",
      foreign_id = "",
      stage = "",
      time: noti_time = "",
      start_time = "",
    } = notification || {};
    let currentNotiDate = moment(noti_time).format("Do MMM YYYY");

    if (type === APPOINTMENT && stage === NOTIFICATION_STAGES.START) {
      currentNotiDate = moment(start_time).format("Do MMM YYYY");
    }

    time =
      currentNotiDate !== today
        ? moment(create_time).format("h:mm a")
        : moment(create_time).fromNow();

    if (currentNotiDate !== date) {
      date = currentNotiDate;
      newDate = true;
    }

    let isDuration = true;

    isDuration = this.getDurationflag(noti_time);

    if (!isDuration) {
      return;
    }

    // vital response
    if (
      type === VITALS &&
      stage === NOTIFICATION_STAGES.CREATE &&
      (category === CATEGORY.VITAL || category == CATEGORY.ALL)
    ) {
      const { actor_role_id = null } = notification || {};
      const {
        details: {
          basic_info: { care_plan_id } = {},
          vital_templates: { basic_info: { name: vitalName } = {} } = {},
        } = {},
      } = schedule_events[foreign_id] || {};

      Object.keys(patients).forEach((id) => {
        const { basic_info: { user_id } = {}, user_role_id = null } =
          patients[id] || {};
        if (`${user_role_id}` === `${actor_role_id}`) {
          patient_id = id;
        }
      });

      const { basic_info: { full_name: patientName } = {} } =
        patients[patient_id] || {};

      dataToRender = (
        <div
          className={`drawer-block pointer ${
            !is_read ? "bg-lighter-blue" : null
          }`}
          onClick={handleVitalRedirect(
            patient_id,
            care_plan_id,
            notification_id
          )}
        >
          <div className="flex align-center justify-space-between">
            <div className="wp20 flex align-center justify-center">
              <ClockCircleOutlined className="dark-sky-blue fs28" />
              {/* <img src={vital_icon}
              className="pointer h45 w45 " /> */}
            </div>
            <div className="wp75">
              <div className="fs16 medium">
                {formatMessage(
                  { ...messages.vitalResponseTitle },
                  { vitalName }
                )}
              </div>
              <div className="fs14">
                {formatMessage(
                  { ...messages.patientVitalResponse },
                  { patientName, vitalName }
                )}
              </div>
              <div className="fs14">{time}</div>
            </div>
          </div>
        </div>
      );
    } else if (
      type === APPOINTMENT &&
      (category === CATEGORY.APPOINTMENT || category == CATEGORY.ALL)
    ) {
      if (
        stage === NOTIFICATION_STAGES.START ||
        stage === NOTIFICATION_STAGES.PRIOR
      ) {
        const { event_id = null } = schedule_events[foreign_id] || {};
        foreignId = event_id ? event_id.toString() : foreign_id;
      }

      const {
        basic_info: {
          start_time = "",
          details: { reason = "", type = "", type_description = "" } = {},
        } = {},
        participant_two: { id: patId = "" } = {},
        care_plan_id = null,
      } = appointments[foreignId] || {};

      const { title: appt_title = "" } =
        APPOINTMENT_TYPE_TITLE[type.toString()] || {};

      const { basic_info: { full_name = "" } = {} } = patients[patId] || {};

      const startTime = moment(start_time).format("hh:mm a");

      patient_id = patId;

      const startTitle = `${this.formatMessage(
        messages.appointmentHeading
      )} ${" "} ${this.formatMessage(messages.started)}`;

      title = `${
        stage === NOTIFICATION_STAGES.PRIOR
          ? this.formatMessage(messages.upcomingAppointment)
          : startTitle
      }`;
      patientName = `${full_name}`;
      if (stage === NOTIFICATION_STAGES.START) {
        time =
          currentNotiDate !== today
            ? moment(start_time).format("h:mm a")
            : moment(start_time).fromNow();
      }

      purpose = reason;

      dataToRender = (
        <div
          className={`drawer-block pointer ${
            !is_read ? "bg-lighter-blue" : null
          }`}
          onClick={this.handlePatientDetailsRedirectAppointments(
            patient_id,
            care_plan_id,
            notification_id
          )}
        >
          <div className=" flex align-center justify-space-between">
            <div className="wp20 flex align-center justify-center">
              {stage === NOTIFICATION_STAGES.PRIOR ? (
                <ClockCircleFilled className="dark-sky-blue fs28" />
              ) : (
                <MedicineBoxFilled className="dark-sky-blue fs28" />
              )}
            </div>
            <div className="wp75">
              <div className="fs16 medium">{title}</div>
              {stage === NOTIFICATION_STAGES.PRIOR && (
                <div className="fs14 ">
                  {this.formatMessage(messages.aboutToStart)}
                </div>
              )}
              <div className="fs14 ">
                {appt_title}
                {" - "}
                {type_description}
              </div>
              <div className="fs14 ">
                {this.formatMessage(messages.withText)} {patientName}
              </div>
              <div className="fs14 ">
                {this.formatMessage(messages.startTimeText)}
                {" - "}
                {startTime}
              </div>
              <div className="fs14">
                {type === APPOINTMENT ? purpose : medicine}
              </div>
              <div className="fs14">{time}</div>
            </div>
          </div>
        </div>
      );
    } else if (
      type === USER_MESSAGE &&
      (category === CATEGORY.USER_MESSAGES || category == CATEGORY.ALL)
    ) {
      const { actor_role_id = null, message = "" } = notification || {};
      // patient_id = actor_category_id;

      Object.keys(patients).forEach((id) => {
        const { basic_info: { user_id } = {}, user_role_id = null } =
          patients[id] || {};
        if (`${user_role_id}` === `${actor_role_id}`) {
          patient_id = id;
        }
      });

      const { basic_info: { full_name = "" } = {} } =
        patients[patient_id] || {};
      patientName = `${full_name}`;

      title = `${this.formatMessage(messages.newChatMessage)}`;
      msgFrom = `${message ? `${message} ` : ""}`;

      dataToRender = (
        <div
          className={`drawer-block pointer ${
            !is_read ? "bg-lighter-blue" : null
          }`}
          onClick={this.handlePatientChatFullScreen(
            patient_id,
            notification_id
          )}
        >
          <div className=" flex align-center justify-space-between">
            <div className="wp20 flex align-center justify-center">
              <MessageFilled className="dark-sky-blue fs28" />
            </div>
            <div className="wp75">
              <div className="fs16 medium">{title}</div>
              <div className="fs14">{msgFrom}</div>
              <div className="fs14">{time}</div>
            </div>
          </div>
        </div>
      );
    } else if (
      type === EVENT_TYPE.SYMPTOMS &&
      (category === CATEGORY.SYMPTOMS || category == CATEGORY.ALL)
    ) {
      const {
        actor_role_id = "",
        stage = "",
        foreign_id = null,
      } = notification || {};
      const { symptoms = {} } = this.props;
      const { text: symptomText = "", basic_info: { care_plan_id } = {} } =
        symptoms[foreign_id] || {};

      Object.keys(patients).forEach((id) => {
        const { basic_info: { user_id } = {}, user_role_id = null } =
          patients[id] || {};
        if (`${user_role_id}` === `${actor_role_id}`) {
          patient_id = id;
        }
      });

      // patient_id = actor_category_id;

      const { basic_info: { full_name = "" } = {} } =
        patients[patient_id] || {};

      patientName = `${full_name}`;

      let headingStage = "";

      switch (stage) {
        case NOTIFICATION_STAGES.UPDATE:
          headingStage = this.formatMessage(messages.updated);
          break;
        case NOTIFICATION_STAGES.DELETE:
          headingStage = this.formatMessage(messages.deleted);
          break;
        case NOTIFICATION_STAGES.SHARE:
          headingStage = this.formatMessage(messages.shared);
          break;
        case NOTIFICATION_STAGES.CREATE:
          headingStage = this.formatMessage(messages.added);
          break;
        case NOTIFICATION_STAGES.START:
          headingStage = this.formatMessage(messages.started);
          break;
        default:
          headingStage = stage;
      }

      title = `${this.formatMessage(
        messages.symptomText
      )}${" "}${headingStage}`;

      dataToRender = (
        <div
          className={`drawer-block pointer ${
            !is_read ? "bg-lighter-blue" : null
          }`}
          onClick={this.handlePatientDetailsRedirectSymptoms(
            patient_id,
            care_plan_id,
            notification_id
          )}
        >
          <div className=" flex align-center justify-space-between">
            <div className="wp20 flex align-center justify-center">
              <AlertFilled className="dark-sky-blue fs28" />
            </div>
            <div className="wp75">
              <div className="fs16 medium">{title}</div>
              <div className="fs14">
                {this.formatMessage(messages.byText)} {full_name}
              </div>
              <div className="fs14">{symptomText}</div>
              <div className="fs14">{time}</div>
            </div>
          </div>
        </div>
      );
    } else if (
      (type === AGORA_CALL_NOTIFICATION_TYPES.MISSED_CALL ||
        type === AGORA_CALL_NOTIFICATION_TYPES.START_CALL) &&
      (category === CATEGORY.CALL || category == CATEGORY.ALL)
    ) {
      const {
        actor,
        actor_role_id = null,
        foreign_id = null,
        participantData,
      } = notification || {};
      let patientId = null;

      Object.keys(participantData).forEach((participantId) => {
        if (participantId !== actor_role_id) {
          const { patient_id } = participantData[actor_role_id] || {};
          patientId = patient_id;
        } else {
          const { doctor_id, patient_id } =
            participantData[participantId] || {};
          patientId = patient_id;
        }
      });

      const { basic_info: { full_name = "" } = {} } = patients[patientId] || {};

      if (type === AGORA_CALL_NOTIFICATION_TYPES.MISSED_CALL) {
        title = `${this.formatMessage(messages.missedCallHeading)}`;
      } else {
        title = `${this.formatMessage(messages.startedCallHeading)}`;
      }

      dataToRender = (
        <div
          className={`drawer-block pointer ${
            !is_read ? "bg-lighter-blue" : null
          }`}
          onClick={handleMissedCallRedirect({
            foreign_id,
            notification_id,
          })}
        >
          <div className=" flex align-center justify-space-between">
            <div className="wp20 flex align-center justify-center">
              <VideoCameraFilled className="dark-sky-blue fs28" />
            </div>
            <div className="wp75">
              <div className="fs16 medium">{title}</div>
              <div className="fs14">
                {type === AGORA_CALL_NOTIFICATION_TYPES.MISSED_CALL
                  ? this.formatMessage(
                      { ...messages.missedCallMessage },
                      { full_name }
                    )
                  : this.formatMessage(
                      { ...messages.callStartedMessage },
                      { full_name }
                    )}
              </div>
              <div className="fs14">{time}</div>
            </div>
          </div>
        </div>
      );
    } else if (
      type === EVENT_TYPE.DIET &&
      (category === CATEGORY.DIET || category == CATEGORY.ALL)
    ) {
      const {
        diets = {},
        schedule_events = {},
        diet_responses = {},
      } = this.props;
      let patient_id = null;
      const {
        actor_role_id = "",
        stage = "",
        foreign_id = null,
        diet_id = null,
      } = notification || {};
      const { basic_info: { schedule_event_id = null } = {} } =
        diet_responses[foreign_id] || {};
      const { details: { time_text = [] } = {} } =
        schedule_events[schedule_event_id] || {};
      const { basic_info: { name: diet_name = "", care_plan_id = null } = {} } =
        diets[diet_id] || {};

      Object.keys(patients).forEach((id) => {
        const { basic_info: { user_id } = {}, user_role_id = null } =
          patients[id] || {};
        if (`${user_role_id}` === `${actor_role_id}`) {
          patient_id = id;
        }
      });

      const { basic_info: { full_name = "" } = {} } =
        patients[patient_id] || {};
      title = `${this.formatMessage(messages.dietHeading)}`;

      dataToRender = (
        <div
          className={`drawer-block pointer ${
            !is_read ? "bg-lighter-blue" : null
          }`}
          onClick={this.handlePatientDetailsRedirectDiets(
            patient_id,
            care_plan_id,
            notification_id
          )}
        >
          <div className=" flex align-center justify-space-between">
            <div className="wp20 flex align-center justify-center">
              <CoffeeOutlined className="dark-sky-blue fs28" />
            </div>
            <div className="wp75">
              <div className="fs16 medium">{title}</div>
              <div className="fs14">
                {formatMessage(
                  { ...messages.dietResponseAdded },
                  { full_name, diet_name, time_text }
                )}
              </div>
              <div className="fs14">{time}</div>
            </div>
          </div>
        </div>
      );
    } else if (
      type === EVENT_TYPE.WORKOUT &&
      (category === CATEGORY.WORKOUT || category == CATEGORY.ALL)
    ) {
      const { workouts = {} } = this.props;
      let patient_id = null;
      const {
        actor_role_id = "",
        stage = "",
        foreign_id = null,
        workout_id = null,
      } = notification || {};
      const {
        basic_info: { name: workout_name = "", care_plan_id = null } = {},
      } = workouts[workout_id] || {};

      Object.keys(patients).forEach((id) => {
        const { basic_info: { user_id } = {}, user_role_id = null } =
          patients[id] || {};
        if (`${user_role_id}` === `${actor_role_id}`) {
          patient_id = id;
        }
      });

      const { basic_info: { full_name = "" } = {} } =
        patients[patient_id] || {};
      title = `${this.formatMessage(messages.workoutHeading)}`;

      dataToRender = (
        <div
          className={`drawer-block pointer ${
            !is_read ? "bg-lighter-blue" : null
          }`}
          onClick={this.handlePatientDetailsRedirectWorkouts(
            patient_id,
            care_plan_id,
            notification_id
          )}
        >
          <div className=" flex align-center justify-space-between">
            <div className="wp20 flex align-center justify-center">
              <img src={workout_icon} className="pointer h45 w45 " />
            </div>
            <div className="wp75">
              <div className="fs16 medium">{title}</div>
              <div className="fs14">
                {formatMessage(
                  { ...messages.workoutResponseAdded },
                  { full_name, workout_name }
                )}
              </div>
              <div className="fs14">{time}</div>
            </div>
          </div>
        </div>
      );
    }

    return dataToRender ? (
      <div id={notification_id} key={`notification-${notification_id}`}>
        {dataToRender}
      </div>
    ) : null;
  };

  getCategoryOptions = () => {
    let options = [];
    options.push(
      Object.values(CATEGORY).map((each, index) => {
        return (
          <Option key={`category-${index}`} value={each}>
            {each}
          </Option>
        );
      })
    );

    return options;
  };

  getDurationOptions = () => {
    let options = [];
    options.push(
      Object.values(DURATION).map((each, index) => {
        return (
          <Option key={`duration-${index}`} value={each}>
            {each}
          </Option>
        );
      })
    );

    return options;
  };

  formatMessage = (data, ...rest) =>
    this.props.intl.formatMessage(data, rest[0]);

  setCategory = (value) => {
    this.setState({ category: value });
  };

  setDuration = (value) => {
    this.setState({ duration: value });
  };

  markAllMissedCallRead = async () => {
    try {
      const { missedCallNotificationIds = [], activityGroupId = {} } =
        this.state;
      const { readNotification } = this;

      let allGroupIds = [];

      for (let index = 0; index < missedCallNotificationIds.length; index++) {
        const groupId =
          activityGroupId[missedCallNotificationIds[index]] || null;
        allGroupIds.push(groupId);
      }
      await readNotification(allGroupIds, null);
    } catch (error) {
      console.log("error ==>", error);
    }
  };

  onClose = async () => {
    const { close, setUnseenNotificationCount } = this.props;

    await this.markAllMissedCallRead();

    this.setState({
      category: CATEGORY.ALL,
      duration: DURATION.ALL,
    });

    setUnseenNotificationCount(0);
    close();
  };

  getNotificationCards = () => {
    const { getAllNotification } = this;
    return (
      <div className="wp100 flex direction-column">{getAllNotification()}</div>
    );
  };

  getNotificationFilters = () => {
    const { category = CATEGORY.ALL, duration = DURATION.ALL } = this.state;
    const {
      setCategory,
      getCategoryOptions,
      setDuration,
      getDurationOptions,
      formatMessage,
    } = this;

    return (
      <Form className="wp100 flex align-center justify-space-between">
        <FormItem label={formatMessage(messages.category)} className="wp40">
          <Select
            className="form-inputs"
            placeholder="Select Category"
            value={category ? category : null}
            onChange={setCategory}
          >
            {getCategoryOptions()}
          </Select>
        </FormItem>

        <FormItem label={formatMessage(messages.month)} className="wp40">
          <Select
            className="form-inputs"
            placeholder="Select Month"
            value={duration ? duration : null}
            onChange={setDuration}
          >
            {getDurationOptions()}
          </Select>
        </FormItem>
      </Form>
    );
  };

  getNotificationDrawerContent = () => {
    const { loading, no_notification_remaining = false } = this.state;
    const { getNotificationFilters, getNotificationCards } = this;

    if (loading) {
      return <Loading className={"wp100"} />;
    }

    return (
      <Fragment>
        {getNotificationFilters()}
        {getNotificationCards()}
        {no_notification_remaining && (
          <div className="fs18 fw800">
            {this.formatMessage(messages.noMoreNotificationsDisplay)}
          </div>
        )}
      </Fragment>
    );
  };

  render() {
    const { visible } = this.props;
    const { loadMore } = this.state;
    const { getNotificationDrawerContent } = this;

    if (visible !== true) {
      return null;
    }

    return (
      <Drawer
        className="Drawer"
        title={this.formatMessage(messages.notifications)}
        placement="right"
        maskClosable={false}
        headerStyle={{
          position: "sticky",
          zIndex: "9999",
          top: "0px",
        }}
        onClose={this.onClose}
        visible={visible}
        width={400}
      >
        {getNotificationDrawerContent()}
        {loadMore && <Loading className={"wp100"} />}
      </Drawer>
    );
  }
}

export default injectIntl(NotificationDrawer);
