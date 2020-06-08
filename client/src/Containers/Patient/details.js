import PatientDetails from "../../Components/Patient/details";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {open} from "../../modules/drawer";
import {DRAWER} from "../../constant";

const mapStateToProps = (state, ownprops) => {
    const {users = {}, appointments, medications} = state;
    // const { id } = ownprops;
    const user_details = users["3"] || {};
    console.log("usee:::", user_details, state, users, users["3"]);
    return {
        user_details,
        appointments,
        users,
        medications
    };
};

const mapDispatchToProps = dispatch => {
    return {
        openAppointmentDrawer: (payload) => dispatch(open({type: DRAWER.ADD_APPOINTMENT, payload})),
        openMReminderDrawer: (payload) => dispatch(open({type: DRAWER.ADD_MEDICATION_REMINDER, payload})),
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(PatientDetails)
);
