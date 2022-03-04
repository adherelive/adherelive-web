import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import VitalTimelineDrawer from "../../Components/Drawer/vitalTimeline";

import { getVitalTimeline } from "../../modules/vitals";
import { close } from "../../modules/drawer";
import { DRAWER } from "../../constant";

const mapStateToProps = (state) => {
  const {
    drawer: { visible, data: { type, payload: { id, loading } = {} } = {} },
    vitals = {},
    vital_templates = {},
    schedule_events = {},
  } = state;

  return {
    id,
    loading,
    vitals,
    vital_templates,
    schedule_events,
    visible: visible && type === DRAWER.VITAL_RESPONSE_TIMELINE,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    close: () => dispatch(close()),
    getVitalTimeline: (id) => () => dispatch(getVitalTimeline(id)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(VitalTimelineDrawer)
);
