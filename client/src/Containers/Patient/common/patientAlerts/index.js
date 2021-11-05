import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getLastVisitAlerts } from "../../../../modules/scheduleEvents";
import PatientAlerts from "../../../../Components/Patient/details/common/patientAlerts";

const mapStateToProps = (state) => {
  const { schedule_events, symptoms } = state || {};

  return { schedule_events, symptoms };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getLastVisitAlerts: (id) => () => dispatch(getLastVisitAlerts(id)),
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { schedule_events, symptoms } = stateProps;

  const { getLastVisitAlerts } = dispatchProps;

  const { patientId } = ownProps;

  return {
    schedule_events,
    symptoms,
    getLastVisitAlerts: getLastVisitAlerts(patientId),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(PatientAlerts)
);
