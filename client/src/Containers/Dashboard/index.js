import {withRouter} from "react-router-dom";
import Dashboard from "../../Components/Dashboard";
import {signOut, getInitialData} from "../../modules/auth";
import {addPatient} from '../../modules/patients';
import {searchMedicine} from "../../modules/medicines";
import {connect} from "react-redux";

const mapStateToProps = state => {
    const {graphs,authenticatedUser} = state;
    return {graphs};
};

const mapDispatchToProps = dispatch => {
    return {
        signOut: () => dispatch(signOut()),
        getInitialData: () => dispatch(getInitialData()),
        searchMedicine: value => dispatch(searchMedicine(value)),
        addPatient:(data,id)=>dispatch(addPatient(data,id))
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Dashboard)
);
