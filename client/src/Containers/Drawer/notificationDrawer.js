import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import NotificationDrawer from "../../Components/Drawer/notification";
import { close } from "../../modules/drawer";
import { DRAWER } from "../../constant";
import { getNotification } from "../../modules/notifications";
import { doNotificationRedirect } from "../../modules/notificationRedirect";
import { setUnseenNotificationCount } from "../../modules/pages/NotificationCount";

const mapStateToProps = (state) => {
  const {
    drawer: { visible, loading, data: { type, payload = {} } = {} },
    patients,
    treatments,
    care_plans,
    static_templates,
    providers,
    doctors,
    auth,
    notifications,
    appointments,
    medications,
    medicines,
    schedule_events,
    symptoms = {},
    notification_redirect = {},
    diets = {},
    diet_food_group_mappings = {},
    workouts = {},
    diet_responses = {},
  } = state;
  return {
    visible: visible && type === DRAWER.NOTIFICATIONS,
    loading,
    payload,
    treatments,
    patients,
    care_plans,
    static_templates,
    providers,
    doctors,
    auth,
    notifications,
    appointments,
    medications,
    medicines,
    schedule_events,
    symptoms,
    notification_redirect,
    diets,
    diet_food_group_mappings,
    workouts,
    diet_responses,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    close: () => dispatch(close()),
    getNotification: (activities) => dispatch(getNotification(activities)),
    doNotificationRedirect: (payload) =>
      dispatch(doNotificationRedirect(payload)),
    setUnseenNotificationCount: (count) =>
      dispatch(setUnseenNotificationCount(count)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NotificationDrawer)
);
