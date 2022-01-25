import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import TemplatePage from "../../../Components/Pages/doctorTemplateSettingsPage";
import { DRAWER } from "../../../constant";
import { open } from "../../../modules/drawer";
import { getVitalOccurence } from "../../../modules/vital_occurence";
import { getAppointmentsDetails } from "../../../modules/appointments";
import { getMedicationDetails } from "../../../modules/otherDetails";
import { searchMedicine } from "../../../modules/medicines";
import { getAllTemplatesForDoctor } from "../../../modules/carePlanTemplates";

const mapStateToProps = (state) => {
  // console.log("3289467832482354723874792384 STATE",state);
  const {
    auth: {
      authPermissions = [],
      authenticated_user = 1,
      authenticated_category,
      doctor_provider_id = "",
    } = {},
    medicines = {},
  } = state;

  console.log("8467528394723989 main page ====>", { state });

  return {
    authenticated_user,
    authenticated_category,
    medicines,
    doctor_provider_id,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllTemplatesForDoctor: () => dispatch(getAllTemplatesForDoctor()),
    openCreateCareplanTemplateDrawer: (payload) =>
      dispatch(open({ type: DRAWER.CREATE_CAREPLAN_TEMPLATE, payload })),
    getVitalOccurence: () => dispatch(getVitalOccurence()),
    getAppointmentsDetails: () => dispatch(getAppointmentsDetails()),
    getMedicationDetails: (id) => dispatch(getMedicationDetails(id)),
    searchMedicine: (value) => dispatch(searchMedicine(value)),
    openEditCareplanTemplateDrawer: (payload) =>
      dispatch(open({ type: DRAWER.EDIT_CAREPLAN_TEMPLATE, payload })),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TemplatePage)
);
