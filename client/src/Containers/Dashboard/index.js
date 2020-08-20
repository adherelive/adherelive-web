import { withRouter } from "react-router-dom";
import Dashboard from "../../Components/Dashboard";
import { signOut, getInitialData } from "../../modules/auth";
import { addPatient } from '../../modules/patients';
import { searchMedicine } from "../../modules/medicines";
import { searchTreatment } from "../../modules/treatments";
import { searchCondition } from "../../modules/conditions";
import { searchSeverity } from "../../modules/severity";
import { getGraphs, updateGraphs } from "../../modules/graphs";
import { connect } from "react-redux";
import { closePopUp } from "../../modules/chat";

const mapStateToProps = state => {
    const { graphs, auth: { authPermissions = [] } = {},
        treatments = {},
        conditions = {},
        severity = {}, chats, drawer, twilio, patients, doctors } = state;
    return {
        graphs,
        treatments,
        conditions,
        severity,
        authPermissions,
        chats,
        drawer,
        twilio,
        patients,
        doctors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        signOut: () => dispatch(signOut()),
        getGraphs: () => dispatch(getGraphs()),
        updateGraphs: (data) => dispatch(updateGraphs(data)),
        getInitialData: () => dispatch(getInitialData()),
        searchMedicine: value => dispatch(searchMedicine(value)),
        searchCondition: value => dispatch(searchCondition(value)),
        searchTreatment: value => dispatch(searchTreatment(value)),
        searchSeverity: value => dispatch(searchSeverity(value)),
        addPatient: (data) => dispatch(addPatient(data)),
        closePopUp: () => dispatch(closePopUp()),
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Dashboard)
);
