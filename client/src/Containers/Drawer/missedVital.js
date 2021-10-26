import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getAllMissedScheduleEvents } from "../../modules/scheduleEvents";
import MissedVitalDrawer from "../../Components/Drawer/missedVitalsDrawer";
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
    pages: { dashboard: { missed_vitals, vital_ids } = {} } = {},
  } = state;

  return {
    visible: visible && type === DRAWER.MISSED_VITAL,
    loading,
    payload,
    authenticated_category,
    authPermissions,
    authenticated_user,
    patients,
    missed_vitals,
    vital_ids,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllMissedScheduleEvents: () => dispatch(getAllMissedScheduleEvents()),
    close: () => dispatch(close()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MissedVitalDrawer)
);
