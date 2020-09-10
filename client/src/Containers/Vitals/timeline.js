import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import VitalTimelineDrawer from "../../Components/Vitals/timeline";
import {getVitals} from "../../modules/vitals";
import {DRAWER} from "../../constant";

const mapStateToProps = state => {
    const {
        drawer: { visible, data: { type, payload : {id} = {} } = {} },
        vitals = {},
        vital_templates = {},
        schedule_events = {}
    } = state;

    return {
        id,
        vitals,
        schedule_events,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getPatientVitals: (id) => () => dispatch(getVitals(id)),
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
)(VitalTimelineDrawer));