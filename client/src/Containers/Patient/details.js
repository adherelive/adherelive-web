import PatientDetails from "../../Components/Patient/details";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { open } from "../../modules/drawer";
import { close } from "../../modules/drawer";
import { getMedications } from "../../modules/medications";
import { getAppointments, getAppointmentsDetails } from "../../modules/appointments";
import { searchMedicine } from "../../modules/medicines";
import { getPatientCarePlanDetails } from "../../modules/carePlans";
import { addCarePlanMedicationsAndAppointments } from "../../modules/carePlans";
import { DRAWER } from "../../constant";
import { openPopUp, closePopUp } from "../../modules/chat";
import { fetchChatAccessToken } from "../../modules/twilio";

const mapStateToProps = (state, ownProps) => {
    const { users = {}, appointments, medications, medicines = {}, patients = {}, care_plans = {}, doctors = {}, treatments = {},
        conditions = {}, template_medications = {}, template_appointments = {}, care_plan_templates = {},
        severity = {}, show_template_drawer = {}, auth: { authPermissions = [], authenticated_user = 1 } = {}, chats, drawer, care_plan_template_ids = [], twilio = {} } = state;
    // const { id } = ownprops;
    const user_details = users["3"] || {};
    const {
        location: {
            state: {
                // showTemplateDrawer = false,
                currentCarePlanId = 0
            } = {}
        } = {}
    } = ownProps;
    return {
        user_details,
        appointments,
        users,
        treatments,
        conditions,
        severity,
        medications,
        medicines,
        patients,
        care_plans,
        doctors,
        care_plan_templates,
        template_appointments,
        template_medications,
        show_template_drawer,
        currentCarePlanId,
        authPermissions,
        chats,
        twilio,
        drawer,
        care_plan_template_ids,
        authenticated_user
    };
};

const mapDispatchToProps = dispatch => {
    return {
        openAppointmentDrawer: (payload) => dispatch(open({ type: DRAWER.ADD_APPOINTMENT, payload })),
        openMReminderDrawer: (payload) => dispatch(open({ type: DRAWER.ADD_MEDICATION_REMINDER, payload })),
        openVitalsDrawer: (payload) => dispatch(open({ type: DRAWER.ADD_VITALS, payload })),
        openSymptomsDrawer: (payload) => dispatch(open({ type: DRAWER.SYMPTOMS, payload })),
        getMedications: (id) => dispatch(getMedications(id)),
        close: () => dispatch(close()),
        getAppointments: (id) => dispatch(getAppointments(id)),
        getAppointmentsDetails: () => dispatch(getAppointmentsDetails()),
        getPatientCarePlanDetails: (patientId) => dispatch(getPatientCarePlanDetails(patientId)),
        searchMedicine: value => dispatch(searchMedicine(value)),
        addCarePlanMedicationsAndAppointments: (payload, carePlanId) => dispatch(addCarePlanMedicationsAndAppointments(payload, carePlanId)),
        openEditAppointmentDrawer: (payload) => dispatch(open({ type: DRAWER.EDIT_APPOINTMENT, payload })),
        openEditMedicationDrawer: (payload) => dispatch(open({ type: DRAWER.EDIT_MEDICATION, payload })),
        openPopUp: () => dispatch(openPopUp()),
        closePopUp: () => dispatch(closePopUp()),
        fetchChatAccessToken: userId => dispatch(fetchChatAccessToken(userId)),
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(PatientDetails)
);
