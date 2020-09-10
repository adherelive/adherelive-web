import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import VitalTable from "../../Components/Vitals/table";

import {getVitals} from "../../modules/vitals";

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
        getPatientVitals: (id) => () => dispatch(getVitals(id))
    };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const {
        vitals,
        vital_templates,
        vital_ids
    } = stateProps;

    const {getPatientVitals} = dispatchProps;
    const {patientId} = ownProps;

    return {
        vitals,
        vital_templates,
        vital_ids,
        getPatientVitals: getPatientVitals(patientId)
    };
};

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(VitalTable));