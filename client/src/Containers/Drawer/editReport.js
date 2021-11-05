import { connect } from "react-redux";
import editReportDrawer from "../../Components/Drawer/editReportDrawer";
import { DRAWER } from "../../constant";
import { close } from "../../modules/drawer";
import {
  uploadReport,
  addReport,
  fetchReports,
  deleteReport,
  updateReport,
} from "../../modules/reports";

const mapStateToProps = (state) => {
  const {
    drawer: { visible, loading, data: { type, payload = {} } = {} },
    reports = {},
  } = state;

  return {
    visible: visible && type === DRAWER.EDIT_REPORT,
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
    getAllReports: (patient_id) => dispatch(fetchReports(patient_id)),
    deleteReport: (doc_id) => dispatch(deleteReport(doc_id)),
    updateReport: (report_id, payload) =>
      dispatch(updateReport(report_id, payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(editReportDrawer);
