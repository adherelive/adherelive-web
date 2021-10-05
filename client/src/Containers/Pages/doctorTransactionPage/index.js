import {connect} from "react-redux";
import DoctorTransactionPage from "../../../Components/Pages/doctorTransactionPage";
import {withRouter} from "react-router-dom";


const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(DoctorTransactionPage)
);
