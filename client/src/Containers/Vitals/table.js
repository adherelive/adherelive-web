import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import VitalTable from "../../Components/Vitals/table";

import {open} from "../../modules/drawer";
import {getVitals} from "../../modules/vitals";
import {DRAWER} from "../../constant";

const mapStateToProps = state => {
  const {vitals = {}, vital_templates = {}, pages: {vital_ids = []} = {}} = state;

  return {
      vitals,
      vital_templates,
      vital_ids
  };
};

const mapDispatchToProps = dispatch => {
    return {
        getPatientVitals: (id) => () => dispatch(getVitals(id)),
        editVitalDrawer: (payload) => dispatch(open({type: DRAWER.EDIT_VITALS, payload})),
        vitalResponseDrawer: (payload) => dispatch(open({type: DRAWER.VITAL_RESPONSE_TIMELINE, payload}))
    };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const {
        vitals,
        vital_templates,
        vital_ids
    } = stateProps;

    const {
        getPatientVitals,
        vitalResponseDrawer,
        editVitalDrawer
    } = dispatchProps;
    const {patientId} = ownProps;

    return {
        vitals,
        vital_templates,
        vital_ids,
        vitalResponseDrawer,
        editVitalDrawer,
        getPatientVitals: getPatientVitals(patientId)
    };
};

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(VitalTable));