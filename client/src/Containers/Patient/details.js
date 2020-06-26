import PatientDetails from "../../Components/Patient/details";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {open} from "../../modules/drawer";
import {getMedications} from "../../modules/medications";
import {getAppointments} from "../../modules/appointments";
import {searchMedicine} from "../../modules/medicines";
import {getPatientCarePlanDetails} from "../../modules/carePlans";
import {addCarePlanMedicationsAndAppointments} from "../../modules/carePlans";
import {DRAWER} from "../../constant";

const mapStateToProps = (state, ownProps) => {
    const {users = {}, appointments, medications, medicines = {}, patients = {}, care_plans = {}, doctors = {}} = state;
    // const { id } = ownprops;
    const user_details = users["3"] || {};
    const {
        location: {
            state: {
                showTemplateDrawer=false
            } = {}
        } = {}
    } = ownProps;
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
        showTemplateDrawer
    };
};

const mapDispatchToProps = dispatch => {
    return {
        openAppointmentDrawer: (payload) => dispatch(open({type: DRAWER.ADD_APPOINTMENT, payload})),
        openMReminderDrawer: (payload) => dispatch(open({type: DRAWER.ADD_MEDICATION_REMINDER, payload})),
        getMedications: (id) => dispatch(getMedications(id)),
        getAppointments: (id) => dispatch(getAppointments(id)),
        getPatientCarePlanDetails:(patientId)=>dispatch(getPatientCarePlanDetails(patientId)),
        searchMedicine: value => dispatch(searchMedicine(value)),
        addCarePlanMedicationsAndAppointments:(payload,carePlanId)=>dispatch(addCarePlanMedicationsAndAppointments(payload,carePlanId)),
        openEditAppointmentDrawer: (payload) => dispatch(open({type: DRAWER.EDIT_APPOINTMENT, payload})),
        openEditMedicationDrawer: (payload) => dispatch(open({type: DRAWER.EDIT_MEDICATION, payload})),
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(PatientDetails)
);
