import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getAllMissedScheduleEvents } from "../../modules/scheduleEvents";
import MissedWorkoutsDrawer from "../../Components/Drawer/missedWorkoutsDrawer";
import { close } from "../../modules/drawer";
import { DRAWER } from "../../constant";

const mapStateToProps = (state) => {
  const {
    auth: {
      authPermissions = [],
      authenticated_user = 1,
      authenticated_category,
    } = {},
    drawer: { visible, loading, data: { type, payload = {} } = {} },
    patients = {},
    pages: { dashboard: { missed_workouts, workout_ids } = {} },
  } = state;

  return {
    visible: visible && type === DRAWER.MISSED_WORKOUT,
    loading,
    payload,
    authPermissions,
    authenticated_category,
    authenticated_user,
    patients,
    missed_workouts,
    workout_ids,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllMissedScheduleEvents: () => dispatch(getAllMissedScheduleEvents()),
    close: () => dispatch(close()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MissedWorkoutsDrawer)
);
