import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import AddAppointmentDrawer from "../../Components/Drawer/addAppointment";
import { close } from "../../modules/drawer";
import {DRAWER} from "../../constant";
import {getMedications} from "../../modules/medications";
import {getAppointments, addAppointment,addCarePlanAppointment} from "../../modules/appointments";

const mapStateToProps = state => {
    const {
        drawer: { visible, loading, data: { type, payload = {} } = {} },
        patients,treatments
    } = state
    return {
        visible: visible && type === DRAWER.ADD_APPOINTMENT,
        loading,
        payload,
        treatments,
        patients
    };
};

const mapDispatchToProps = dispatch => {
    return {
        close: () => dispatch(close()),
        addAppointment: data => dispatch(addAppointment(data)),
        addCarePlanAppointment: (data,carePlanId) => dispatch(addCarePlanAppointment(data,carePlanId)),
        
    getMedications: (id) => dispatch(getMedications(id)),
        getAppointments: (id) => dispatch(getAppointments(id)),
    };
};

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(AddAppointmentDrawer));