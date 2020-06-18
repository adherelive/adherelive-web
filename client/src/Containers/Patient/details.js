import PatientDetails from "../../Components/Patient/details";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {open} from "../../modules/drawer";
import {getMedications} from "../../modules/medications";
import {getAppointments} from "../../modules/appointments";
import {searchMedicine} from "../../modules/medicines";
import {DRAWER} from "../../constant";

const mapStateToProps = (state, ownprops) => {
    const {users = {}, appointments, medications, medicines = {}, patients = {}, care_plans = {}, doctors = {}} = state;
    // const { id } = ownprops;
    const user_details = users["3"] || {};
    console.log("usee:::", user_details, state, users, users["3"]);
    return {
        user_details,
        appointments,
        users,
        medications,
        medicines,
        patients,
        care_plans,
        doctors,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        openAppointmentDrawer: (payload) => dispatch(open({type: DRAWER.ADD_APPOINTMENT, payload})),
        openMReminderDrawer: (payload) => dispatch(open({type: DRAWER.ADD_MEDICATION_REMINDER, payload})),
        getMedications: (id) => dispatch(getMedications(id)),
        getAppointments: (id) => dispatch(getAppointments(id)),
        searchMedicine: value => dispatch(searchMedicine(value))
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(PatientDetails)
);
