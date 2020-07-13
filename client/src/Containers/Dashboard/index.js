import { withRouter } from "react-router-dom";
import Dashboard from "../../Components/Dashboard";
import { signOut, getInitialData } from "../../modules/auth";
import { addPatient } from '../../modules/patients';
import { searchMedicine } from "../../modules/medicines";
import { getGraphs } from "../../modules/graphs";
import { connect } from "react-redux";

const mapStateToProps = state => {
    const { graphs, authenticatedUser,
        treatments = {},
        conditions = {},
        severity = {} } = state;
    return {
        graphs,
        treatments,
        conditions,
        severity
    };
};

const mapDispatchToProps = dispatch => {
    return {
        signOut: () => dispatch(signOut()),
        getGraphs:() => dispatch(getGraphs()),
        getInitialData: () => dispatch(getInitialData()),
        searchMedicine: value => dispatch(searchMedicine(value)),
        addPatient: (data, id) => dispatch(addPatient(data, id))
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Dashboard)
);
