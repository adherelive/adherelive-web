import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import AddCareplanDrawer from "../../Components/Drawer/addCareplan";
import { close } from "../../modules/drawer";
import { DRAWER } from "../../constant";
import { getInitialData } from "../../modules/auth";
import { getMedications } from "../../modules/medications";
import {
  getAppointments,
  addAppointment,
  addCarePlanAppointment,
} from "../../modules/appointments";
import { searchMedicine } from "../../modules/medicines";
import { searchTreatment } from "../../modules/treatments";
import { searchCondition } from "../../modules/conditions";
import { searchSeverity } from "../../modules/severity";
import { addCareplanForPatient } from "../../modules/patients";
// AKSHAY NEW CODE IMPLEMENTATIONS FOR CDSS
import {
  getDiagnosisList,
  addDiagnosis,
  diagnosisSearch,
} from "../../modules/cdss";

const mapStateToProps = (state) => {
  const {
    drawer: { visible, loading, data: { type, payload = {} } = {} },
    treatments = {},
    conditions = {},
    severity = {},
    patients,
    doctors,
    care_plans,
  } = state;
  return {
    visible: visible && type === DRAWER.ADD_CAREPLAN,
    loading,
    payload,
    care_plans,
    // static_templates,
    // providers,
    treatments,
    conditions,
    severity,
    patients,
    doctors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    close: () => dispatch(close()),
    getMedications: (id) => dispatch(getMedications(id)),
    getInitialData: () => dispatch(getInitialData()),
    searchMedicine: (value) => dispatch(searchMedicine(value)),
    searchCondition: (value) => dispatch(searchCondition(value)),
    searchTreatment: (value) => dispatch(searchTreatment(value)),
    searchSeverity: (value) => dispatch(searchSeverity(value)),
    addCareplanForPatient: (patient_id, data) =>
      dispatch(addCareplanForPatient(patient_id, data)),
    // AKSHAY NEW CODE IMPLEMENTATIONS FOR CDSS
    getDiagnosisList: (payload) => dispatch(getDiagnosisList(payload)),
    addDiagnosis: (payload) => dispatch(addDiagnosis(payload)),
    diagnosisSearch: (payload) => dispatch(diagnosisSearch(payload)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AddCareplanDrawer)
);
