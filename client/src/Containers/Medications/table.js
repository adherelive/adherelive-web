import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import MedicationTable from "../../Components/Medications/table";

import { open } from "../../modules/drawer";
import { getMedications } from "../../modules/medications";
import { DRAWER } from "../../constant";

const mapStateToProps = (state) => {
  const {
    medications = {},
    auth: { auth_role = null } = {},
    pages: { medication_ids = [] } = {},
    care_plans = {},
    medicines = {},
  } = state;

  return {
    medications,
    medication_ids,
    care_plans,
    medicines,
    auth_role,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPatientMedications: (id) => () => dispatch(getMedications(id)),
    editMedicationDrawer: (payload) =>
      dispatch(open({ type: DRAWER.EDIT_MEDICATION, payload })),
    medicationResponseDrawer: (payload) =>
      dispatch(open({ type: DRAWER.MEDICATION_RESPONSE_TIMELINE, payload })),
    getMedications: (id) => dispatch(getMedications(id)),
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {
    medications,
    // medication_ids,
    care_plans,
    medicines,
    auth_role,
  } = stateProps;

  const {
    getPatientMedications,
    editMedicationDrawer,
    medicationResponseDrawer,
  } = dispatchProps;

  const { patientId, carePlanId } = ownProps;
  const { medication_ids = [] } = care_plans[carePlanId];

  return {
    patientId,
    medications,
    medication_ids,
    care_plans: care_plans[carePlanId],
    getPatientMedications: getPatientMedications(patientId),
    editMedicationDrawer,
    medicationResponseDrawer,
    medicines,
    auth_role,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(MedicationTable)
);
