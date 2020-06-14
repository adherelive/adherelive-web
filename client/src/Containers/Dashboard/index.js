import {withRouter} from "react-router-dom";
import Dashboard from "../../Components/Dashboard";
import {signOut, getInitialData} from "../../modules/auth";
import {searchMedicine} from "../../modules/medicines";
import {connect} from "react-redux";

const mapStateToProps = state => {
    const {graphs} = state;
    return {graphs};
};

const mapDispatchToProps = dispatch => {
    return {
        signOut: () => dispatch(signOut()),
        getInitialData: () => dispatch(getInitialData()),
        searchMedicine: value => dispatch(searchMedicine(value)),
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Dashboard)
);
