import { connect } from "react-redux";
import AddMedicationReminder from "../../Components/Drawer/addMedicationReminder/medicationsReminder";
import { DRAWER } from "../../constant";
import { close } from "../../modules/drawer";
import {
  getMedications,
  addMedicationReminder,
  addCarePlanMedicationReminder,
} from "../../modules/medications";
import { getMedicationDetails } from "../../modules/otherDetails";
import { getAppointments } from "../../modules/appointments";
import { searchMedicine, addMedicine } from "../../modules/medicines";
import {
  markFavourite,
  getFavourites,
  removeFavourite,
} from "../../modules/favouritesData/index";

const mapStateToProps = (state) => {
  const { auth } = state;
  const { authenticated_user, authenticated_category } = auth;
  const {
    drawer: { visible, loading, data: { type, payload = {} } = {} },
    other_details: { medication_details = {} } = {},
    medicines,
    doctors = {},
    favourites_data = {},
    pages: { favourite_medicine_ids = [] } = {},
  } = state;

  return {
    visible: visible && type === DRAWER.ADD_MEDICATION_REMINDER,
    loading,
    payload,
    medication_details,
    medicines,
    doctors,
    authenticated_category,
    authenticated_user,
    favourites_data,
    favourite_medicine_ids,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    close: () => dispatch(close()),
    addMedicationReminder: (data) => dispatch(addMedicationReminder(data)),
    addCarePlanMedicationReminder: (data, carePlanId) =>
      dispatch(addCarePlanMedicationReminder(data, carePlanId)),
    getMedicationDetails: (patientId) =>
      dispatch(getMedicationDetails(patientId)),
    searchMedicine: (data) => dispatch(searchMedicine(data)),
    getMedications: (id) => dispatch(getMedications(id)),
    getAppointments: (id) => dispatch(getAppointments(id)),
    addNewMedicine: (data) => dispatch(addMedicine(data)),
    markFavourite: (payload) => dispatch(markFavourite(payload)),
    getFavourites: ({ type }) => dispatch(getFavourites({ type })),
    removeFavourite: ({ typeId, type }) =>
      dispatch(removeFavourite({ typeId, type })),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddMedicationReminder);
