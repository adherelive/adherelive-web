import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import NotificationDrawer from "../../Components/Drawer/notification";
import { close } from "../../modules/drawer";
import { DRAWER } from "../../constant";
import { open } from "../../modules/drawer";
import { getMedications } from "../../modules/medications";
import { getAppointments, addAppointment, addCarePlanAppointment } from "../../modules/appointments";

const mapStateToProps = state => {
    const {
        drawer: { visible, loading, data: { type, payload = {} } = {} },
        patients, treatments, care_plans, static_templates, providers, doctors,auth
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
        auth
    };
};

const mapDispatchToProps = dispatch => {
    return {
        close: () => dispatch(close()),
    };
};

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(NotificationDrawer));