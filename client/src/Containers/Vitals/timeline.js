import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import VitalTimeline from "../../Components/Vitals/timeline";
import {getVitalTimeline} from "../../modules/vitals";

const mapStateToProps = state => {
    const {
        drawer: { visible, data: { type, payload : {id, loading} = {} } = {} },
        vitals = {},
        vital_templates = {},
        schedule_events = {}
    } = state;

    return {
        id,
        vitals,
        vital_templates,
        schedule_events,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getVitalTimeline: (id) => () => dispatch(getVitalTimeline(id))
    };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const {
        id,
        loading,
        vitals,
        vital_templates,
        vital_ids
    } = stateProps;

    const {
        getVitalTimeline,
        vitalResponseDrawer,
        editVitalDrawer
    } = dispatchProps;

    return {
        id,
        vitals,
        vital_templates,
        vital_ids,
        vitalResponseDrawer,
        editVitalDrawer,
        getVitalTimeline: getVitalTimeline(id)
    };
};

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
)(VitalTimeline));