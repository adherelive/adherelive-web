import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import VitalTimelineDrawer from "../../Components/Vitals/timeline";
import {getVitalTimeline} from "../../modules/vitals";
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
        vitals,
        vital_templates,
        vital_ids
    } = stateProps;

    const {
        getVitalTimeline,
        vitalResponseDrawer,
        editVitalDrawer
    } = dispatchProps;
    const {id} = ownProps;

    console.log("87391283 patientId", id);

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
)(VitalTimelineDrawer));