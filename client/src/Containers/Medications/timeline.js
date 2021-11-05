import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import MedicationTimeline from "../../Components/Medications/timeline";
import { getMedicationTimeline } from "../../modules/medications";

import { open } from "../../modules/drawer";
import { getMedications } from "../../modules/medications";
import { DRAWER } from "../../constant";

const mapStateToProps = (state) => {
  const {
    drawer: { visible, data: { type, payload: { id, loading } = {} } = {} },
    medications = {},
    schedule_events = {},
  } = state;

  return {
    id,
    medications,
    schedule_events,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getMedicationTimeline: (id) => () => dispatch(getMedicationTimeline(id)),
    medicationResponseDrawer: (payload) =>
      dispatch(open({ type: DRAWER.MEDICATION_RESPONSE_TIMELINE, payload })),
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { id, loading, medications, schedule_events } = stateProps;

  const {
    getMedicationTimeline,
    medicationResponseDrawer,
    editMedicationDrawer,
  } = dispatchProps;

  return {
    id,
    medications,
    schedule_events,
    medicationResponseDrawer,
    editMedicationDrawer,
    getMedicationTimeline: getMedicationTimeline(id),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(MedicationTimeline)
);
