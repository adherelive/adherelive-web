import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getAllMissedScheduleEvents } from "../../modules/scheduleEvents";
import MissedAppointmentsDrawer from "../../Components/Drawer/missedAppointmentsDrawer";
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
    pages: { dashboard: { missed_appointments, appointment_ids } = {} },
  } = state;

  return {
    visible: visible && type === DRAWER.MISSED_APPOINTMENT,
    loading,
    payload,
    authenticated_category,
    authPermissions,
    authenticated_user,
    patients,
    missed_appointments,
    appointment_ids,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllMissedScheduleEvents: () => dispatch(getAllMissedScheduleEvents()),
    close: () => dispatch(close()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MissedAppointmentsDrawer)
);
