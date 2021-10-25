import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  uploadAppointmentDocs,
  deleteAppointmentDocs,
} from "../../../modules/uploadDocuments";
import AppointmentUpload from "../../../Components/Modal/appointmentUpload";

const mapStateToProps = (state) => {
  const {
    appointments = {},
    upload_documents = {},
    schedule_events = {},
  } = state;

  return {
    appointments,
    upload_documents,
    schedule_events,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    uploadAppointmentDocs: (id) => (data) =>
      dispatch(uploadAppointmentDocs(data, id)),
    deleteAppointmentDocs: (doc_id) => dispatch(deleteAppointmentDocs(doc_id)),
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {
    appointments = {},
    upload_documents = {},
    schedule_events = {},
  } = stateProps;

  const { uploadAppointmentDocs, deleteAppointmentDocs } = dispatchProps;

  const { appointmentId, visible, onCancel } = ownProps;

  return {
    upload_documents,
    schedule_events,
    appointmentId,
    visible,
    onCancel,
    appointments: appointments[appointmentId] || {},
    uploadAppointmentDocs: uploadAppointmentDocs(appointmentId),
    deleteAppointmentDocs,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(AppointmentUpload)
);
