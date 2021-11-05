import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getAllMissedScheduleEvents } from "../../modules/scheduleEvents";
import MissedDietsDrawer from "../../Components/Drawer/missedDietsDrawer";
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
    pages: { dashboard: { missed_diets, diet_ids } = {} },
  } = state;

  return {
    visible: visible && type === DRAWER.MISSED_DIET,
    authenticated_category,
    loading,
    payload,
    authPermissions,
    authenticated_user,
    patients,
    missed_diets,
    diet_ids,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllMissedScheduleEvents: () => dispatch(getAllMissedScheduleEvents()),
    close: () => dispatch(close()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MissedDietsDrawer)
);
