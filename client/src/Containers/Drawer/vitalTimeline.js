import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import VitalTimelineDrawer from "../../Components/Drawer/vitalTimeline";

import {getVitalTimeline} from "../../modules/vitals";
import {close} from "../../modules/drawer";
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
        visible: visible && type === DRAWER.VITAL_RESPONSE_TIMELINE,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        close: () => dispatch(close()),
        getVitalTimeline: (id) => () => dispatch(getVitalTimeline(id))
    };
};

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const {
        id,
        vitals,
        vital_templates,
        schedule_events,
        visible
    } = stateProps;

    const {
        close,
        getVitalTimeline
    } = dispatchProps;

    return {
        id,
        vitals,
        vital_templates,
        schedule_events,
        visible,
        close,
        getVitalTimeline: getVitalTimeline(id)
    };
};

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(VitalTimelineDrawer));