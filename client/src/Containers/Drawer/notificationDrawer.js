import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import NotificationDrawer from "../../Components/Drawer/notification";
import { close } from "../../modules/drawer";
import { DRAWER } from "../../constant";
import { open } from "../../modules/drawer";
import { getMedications } from "../../modules/medications";
import { getNotification } from "../../modules/notifications";
import { getAppointments, addAppointment, addCarePlanAppointment } from "../../modules/appointments";

const mapStateToProps = state => {
    const {
        drawer: { visible, loading, data: { type, payload = {} } = {} },
        patients, treatments, care_plans, static_templates, providers, doctors, auth,
        notifications, appointments, medications, medicines
    } = state
    return {
        visible: visible && type === DRAWER.NOTIFICATIONS,
        loading,
        payload,
        treatments,
        patients,
        care_plans,
        static_templates,
        providers,
        doctors,
        auth,
        notifications,
        appointments,
        medications,
        medicines
    };
};

const mapDispatchToProps = dispatch => {
    return {
        close: () => dispatch(close()),
        getNotification: (activities) => dispatch(getNotification(activities))
    };
};

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(NotificationDrawer));