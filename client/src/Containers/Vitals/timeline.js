import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import VitalTimeline from "../../Components/Vitals/timeline";
import {
  getVitalTimeline,
  editVitalResponse,
  deleteVitalResponse,
} from "../../modules/vitals";

const mapStateToProps = (state) => {
  const {
    drawer: {
      visible,
      data: {
        type,
        payload: { id, loading, canViewDetails = false } = {},
      } = {},
    },
    vitals = {},
    vital_templates = {},
    schedule_events = {},
  } = state;

  return {
    id,
    vitals,
    vital_templates,
    schedule_events,
    canViewDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getVitalTimeline: (id) => () => dispatch(getVitalTimeline(id)),
    editVitalResponse: (data) => dispatch(editVitalResponse(data)),
    deleteVitalResponse: (data) => dispatch(deleteVitalResponse(data)),
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { id, loading, vitals, vital_templates, vital_ids, canViewDetails } =
    stateProps;

  const {
    getVitalTimeline,
    vitalResponseDrawer,
    editVitalDrawer,
    editVitalResponse,
    deleteVitalResponse,
  } = dispatchProps;

  return {
    id,
    vitals,
    vital_templates,
    vital_ids,
    vitalResponseDrawer,
    editVitalDrawer,
    editVitalResponse,
    deleteVitalResponse,
    getVitalTimeline: getVitalTimeline(id),
    canViewDetails,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(VitalTimeline)
);
