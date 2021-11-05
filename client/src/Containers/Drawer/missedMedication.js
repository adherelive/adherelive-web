import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getAllMissedScheduleEvents } from "../../modules/scheduleEvents";
import MissedMedicationsDrawer from "../../Components/Drawer/missedMedicationsDrawer";
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
    pages: { dashboard: { missed_medications, medication_ids } = {} },
  } = state;

  return {
    visible: visible && type === DRAWER.MISSED_MEDICATION,
    loading,
    payload,
    authPermissions,
    authenticated_category,
    authenticated_user,
    patients,
    missed_medications,
    medication_ids,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllMissedScheduleEvents: () => dispatch(getAllMissedScheduleEvents()),
    close: () => dispatch(close()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MissedMedicationsDrawer)
);
