import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import AddAppointmentDrawer from "../../Components/Drawer/addAppointment";
import { close } from "../../modules/drawer";
import {DRAWER} from "../../constant";
import {getAppointments, addAppointment} from "../../modules/appointments";

const mapStateToProps = state => {
    const {
        drawer: { visible, loading, data: { type, payload = {} } = {} },
        patients
    } = state
    return {
        visible: visible && type === DRAWER.ADD_APPOINTMENT,
        loading,
        payload,
        patients
    };
};

const mapDispatchToProps = dispatch => {
    return {
        close: () => dispatch(close()),
        addAppointment: data => dispatch(addAppointment(data)),
        getAppointments: (id) => dispatch(getAppointments(id)),
    };
};

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(AddAppointmentDrawer));