import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ReportTable from "../../Components/Reports/table";
import { fetchReports } from "../../modules/reports";

import { open } from "../../modules/drawer";
import { DRAWER } from "../../constant";

const mapStateToProps = (state) => {
  const {
    reports = {},
    doctors = {},
    patients = {},
    upload_documents = {},
    pages: { report_ids = [] } = {},
  } = state || {};
  return {
    reports,
    doctors,
    patients,
    upload_documents,
    report_ids,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openEditReport: (payload) =>
      dispatch(open({ type: DRAWER.EDIT_REPORT, payload })),
    fetchPatientReports: (id) => () => dispatch(fetchReports(id)),
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { reports, doctors, patients, upload_documents, report_ids } =
    stateProps;

  const { fetchPatientReports, openEditReport } = dispatchProps;
  const { patientId } = ownProps;

  return {
    reports,
    doctors,
    patients,
    upload_documents,
    report_ids,
    openEditReport,
    fetchPatientReports: fetchPatientReports(patientId),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReportTable)
);
