import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import AddAppointmentDrawer from "../../Components/Drawer/addAppointment";
import { close } from "../../modules/drawer";
import {DRAWER} from "../../constant";

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
    };
};

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(AddAppointmentDrawer));