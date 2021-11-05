import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import AddAppointmentDrawer from "../../Components/Drawer/addAppointment";
import { close } from "../../modules/drawer";
import { DRAWER } from "../../constant";
import { getMedications } from "../../modules/medications";
import {
  getAppointments,
  addAppointment,
  addCarePlanAppointment,
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
    care_plans,
    static_templates,
    providers,
    favourites_data = {},
    pages: { favourite_medical_test_ids = [] } = {},
  } = state;
  return {
    visible: visible && type === DRAWER.ADD_APPOINTMENT,
    loading,
    payload,
    treatments,
    patients,
    care_plans,
    static_templates,
    providers,
    favourites_data,
    favourite_medical_test_ids,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    close: () => dispatch(close()),
    addAppointment: (data) => dispatch(addAppointment(data)),
    addCarePlanAppointment: (data, carePlanId) =>
      dispatch(addCarePlanAppointment(data, carePlanId)),
    getMedications: (id) => dispatch(getMedications(id)),
    getAppointmentsDetails: () => dispatch(getAppointmentsDetails()),
    getAppointments: (id) => dispatch(getAppointments(id)),
    markFavourite: (payload) => dispatch(markFavourite(payload)),
    getFavourites: ({ type }) => dispatch(getFavourites({ type })),
    removeFavourite: ({ typeId, type }) =>
      dispatch(removeFavourite({ typeId, type })),
    removeFavouriteRecord: (id) => dispatch(removeFavouriteByRecordId(id)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AddAppointmentDrawer)
);
