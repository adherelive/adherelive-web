import { connect } from "react-redux";
import addReportDrawer from "../../Components/Drawer/addReportDrawer";
import { DRAWER } from "../../constant";
import { close } from "../../modules/drawer";
import { uploadReport, addReport } from "../../modules/reports";

const mapStateToProps = (state) => {
  const {
    drawer: { visible, loading, data: { type, payload = {} } = {} },
    reports = {},
  } = state;

  return {
    visible: visible && type === DRAWER.ADD_REPORT,
    loading,
    payload,
    reports,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    close: () => dispatch(close()),
    uploadReport: (patient_id, payload) =>
      dispatch(uploadReport(patient_id, payload)),
    addReport: (payload) => dispatch(addReport(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(addReportDrawer);
