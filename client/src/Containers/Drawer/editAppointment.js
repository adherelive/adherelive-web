import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import EditAppointmentDrawer from "../../Components/Drawer/editAppointment";
import { close } from "../../modules/drawer";
import {DRAWER} from "../../constant";
import {getMedications} from "../../modules/medications";
import {getAppointments, updateAppointment, deleteAppointment} from "../../modules/appointments";

const mapStateToProps = state => {
    const {
        drawer: { visible, loading, data: { type, payload = {} } = {} },
        patients,
        appointments,
    } = state
    return {
        visible: visible && type === DRAWER.EDIT_APPOINTMENT,
        loading,
        payload,
        patients,
        appointments
    };
};

const mapDispatchToProps = dispatch => {
    return {
        close: () => dispatch(close()),
        updateAppointment: data => dispatch(updateAppointment(data)),
        deleteAppointment: id => dispatch(deleteAppointment(id)),
        getAppointments: (id) => dispatch(getAppointments(id)),
        getMedications: (id) => dispatch(getMedications(id)),
        // editAppointment: data => dispatch(editAppointment(data)),
    };
};

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(EditAppointmentDrawer));