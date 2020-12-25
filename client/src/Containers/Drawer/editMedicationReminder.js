import { connect } from "react-redux";
import EditMedicationReminder from "../../Components/Drawer/editMedicationReminder/medicationsReminder";
import { DRAWER } from "../../constant";
import { close } from "../../modules/drawer";
import {getMedications, updateMedication, deleteMedication} from "../../modules/medications";
import {getMedicationDetails} from "../../modules/otherDetails";
import {searchMedicine} from "../../modules/medicines";
import {getPatientCarePlanDetails} from "../../modules/carePlans";
const mapStateToProps = state => {
  const {
    drawer: { visible, loading, data: { type, payload = {} } = {} },
    other_details: {medication_details = {}} = {},
    medications,
    medicines,
    patients,
  } = state;


  return {
    visible: visible && type === DRAWER.EDIT_MEDICATION,
    loading,
    payload,
    medication_details,
    medications,
    medicines,
    patients,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    close: () => dispatch(close()),
    updateMedicationReminder: data => dispatch(updateMedication(data)),
    getMedicationDetails: (id) => dispatch(getMedicationDetails(id)),
    searchMedicine: data => dispatch(searchMedicine(data)),
    // deleteMedication: id => dispatch(deleteMedication(id)),
    getMedications: (id) => dispatch(getMedications(id)),
    getPatientCarePlanDetails:(patientId)=>dispatch(getPatientCarePlanDetails(patientId)),
    
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditMedicationReminder);
