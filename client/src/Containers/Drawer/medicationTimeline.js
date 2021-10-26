import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import MedicationTimelineDrawer from "../../Components/Drawer/medicationTimeline";

import { close } from "../../modules/drawer";
import { DRAWER } from "../../constant";

const mapStateToProps = (state) => {
  const {
    drawer: { visible, data: { type, payload: { id, loading } = {} } = {} },
    medications = {},
    schedule_events = {},
    medicines = {},
  } = state;

  return {
    id,
    loading,
    medications,
    schedule_events,
    visible: visible && type === DRAWER.MEDICATION_RESPONSE_TIMELINE,
    medicines,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    close: () => dispatch(close()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MedicationTimelineDrawer)
);
