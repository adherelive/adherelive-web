import {connect} from "react-redux";
import ProviderDoctorCalender from "../../../Components/Pages/providerDoctorCalender";
import {withRouter} from "react-router-dom";
// import {open} from "../../../modules/drawer";
// import {DRAWER} from "../../../constant";
import {getCalenderDataCountForDay, getCalenderDataForDay} from "../../../modules/scheduleEvents";

const mapStateToProps = state => {
    const {
        users = {},
        doctors = {},
        patients = {},
        date_wise_appointments = {},
        appointments = {}
    } = state;

    return {
        users,
        doctors,
        patients,
        date_wise_appointments,
        appointments
    };

};

const mapDispatchToProps = dispatch => {
    return {
        getCalenderDataCountForDay: (date) => dispatch(getCalenderDataCountForDay(date)),
        getCalenderDataForDay: (date, type) => dispatch(getCalenderDataForDay(date, type))
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(ProviderDoctorCalender)
);
