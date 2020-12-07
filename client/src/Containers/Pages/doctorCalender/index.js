import { connect } from "react-redux";
import DoctorCalender from "../../../Components/Pages/doctorCalender";
import { withRouter } from "react-router-dom";
// import {open} from "../../../modules/drawer";
// import {DRAWER} from "../../../constant";
import {getCalenderDataCountForDay ,getCalenderDataForDay} from "../../../modules/scheduleEvents";

const mapStateToProps = state => {
  const {} = state;

  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    getCalenderDataCountForDay : (date) => dispatch(getCalenderDataCountForDay(date)),
    getCalenderDataForDay : (date,type) => dispatch(getCalenderDataForDay(date,type))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DoctorCalender)
);
