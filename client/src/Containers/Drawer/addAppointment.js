import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import AddAppointmentDrawer from "../../Components/Drawer/addAppointment";
import { close } from "../../modules/drawer";
import {DRAWER} from "../../constant";
import {addAppointment} from "../../modules/appointments";

const mapStateToProps = state => {
    const {
        drawer: { visible, loading, data: { type, payload = {} } = {} }
    } = state
    return {
        visible: visible && type === DRAWER.ADD_APPOINTMENT,
        loading,
        payload
    };
};

const mapDispatchToProps = dispatch => {
    return {
        close: () => dispatch(close()),
        addAppointment: data => dispatch(addAppointment(data)),
    };
};

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(AddAppointmentDrawer));