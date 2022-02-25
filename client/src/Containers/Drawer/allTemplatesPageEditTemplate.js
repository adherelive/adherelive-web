import { connect } from "react-redux";
import TemplatePageEditDrawer from "../../Components/Drawer/allTemplatesPageEditTemplate";
import { DRAWER } from "../../constant";
import { close } from "../../modules/drawer";
import {
  createCareplanTemplate,
  deleteCareplanTemplateRelated,
  updateCareplanTemplate,
} from "../../modules/carePlanTemplates";
import { getAllTemplatesForDoctor } from "../../modules/carePlanTemplates";

// import { createReminder, updateReminder } from "../../modules/reminder"; // write to add to database
const mapStateToProps = (state) => {
  const {
    auth: {
      authPermissions = [],
      authenticated_user = 1,
      authenticated_category,
    } = {},
    drawer: { visible, loading, data: { type, payload = {} } = {} },
    doctors = {},
    care_plan_templates = {},
    template_appointments = {},
    template_medications = {},
    template_diets = {},
    template_workouts = {},
    template_vitals = {},
    vital_templates = {},
    medicines = {},
    pages: { care_plan_template_ids = [] } = {},
    repeat_intervals = {},
    exercise_contents = {},
  } = state;

  return {
    authPermissions,
    visible: visible && type === DRAWER.EDIT_CAREPLAN_TEMPLATE,
    loading,
    payload,
    authenticated_user,
    authenticated_category,
    doctors,
    care_plan_templates,
    template_appointments,
    template_medications,
    template_diets,
    template_workouts,
    template_vitals,
    vital_templates,
    medicines,
    care_plan_template_ids,
    repeat_intervals,
    exercise_contents,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    close: () => dispatch(close()),
    createCareplanTemplate: (payload) =>
      dispatch(createCareplanTemplate(payload)),
    deleteCareplanTemplateRelated: ({
      careplan_template_id,
      other_id,
      other_type,
    }) =>
      dispatch(
        deleteCareplanTemplateRelated({
          careplan_template_id,
          other_id,
          other_type,
        })
      ),
    updateCareplanTemplate: (id, payload) =>
      dispatch(updateCareplanTemplate(id, payload)),
    getAllTemplatesForDoctor: () => dispatch(getAllTemplatesForDoctor()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TemplatePageEditDrawer);
