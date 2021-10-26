import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import EditAppointmentDrawer from "../../Components/Drawer/editAppointment";
import { close } from "../../modules/drawer";
import { DRAWER } from "../../constant";
import { getMedications } from "../../modules/medications";
import { getPatientCarePlanDetails } from "../../modules/carePlans";
import {
  getAppointments,
  updateAppointment,
  deleteAppointment,
  getAppointmentsDetails,
} from "../../modules/appointments";
import {
  markFavourite,
  getFavourites,
  removeFavourite,
  removeFavouriteByRecordId,
} from "../../modules/favouritesData/index";

const mapStateToProps = (state) => {
  const {
    drawer: { visible, loading, data: { type, payload = {} } = {} },
    patients,
    treatments,
    appointments,
    static_templates,
    providers,
    favourites_data = {},
    pages: { favourite_medical_test_ids = [] } = {},
  } = state;
  return {
    visible: visible && type === DRAWER.EDIT_APPOINTMENT,
    loading,
    payload,
    patients,
    appointments,
    treatments,
    static_templates,
    providers,
    favourites_data,
    favourite_medical_test_ids,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    close: () => dispatch(close()),
    updateAppointment: (data) => dispatch(updateAppointment(data)),
    deleteAppointment: (id) => dispatch(deleteAppointment(id)),
    getAppointments: (id) => dispatch(getAppointments(id)),
    getMedications: (id) => dispatch(getMedications(id)),
    getPatientCarePlanDetails: (patientId) =>
      dispatch(getPatientCarePlanDetails(patientId)),
    markFavourite: (payload) => dispatch(markFavourite(payload)),
    getFavourites: ({ type }) => dispatch(getFavourites({ type })),
    removeFavourite: ({ typeId, type }) =>
      dispatch(removeFavourite({ typeId, type })),
    removeFavouriteRecord: (id) => dispatch(removeFavouriteByRecordId(id)),
    getAppointmentsDetails: () => dispatch(getAppointmentsDetails()),

    // editAppointment: data => dispatch(editAppointment(data)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EditAppointmentDrawer)
);
