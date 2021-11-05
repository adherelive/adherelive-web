import { connect } from "react-redux";
import TemplatePageCreateDrawer from "../../Components/Drawer/allTemplatesPageCreateTemplate";
import { DRAWER } from "../../constant";
import { close } from "../../modules/drawer";
import {
  createCareplanTemplate,
  getAllTemplatesForDoctor,
} from "../../modules/carePlanTemplates";

// import { createReminder, updateReminder } from "../../modules/reminder"; // write to add to database
const mapStateToProps = (state) => {
  const {
    auth: { authPermissions = [], authenticated_category } = {},
    drawer: { visible, loading, data: { type, payload = {} } = {} },
    vital_templates,
    repeat_intervals,
    exercise_contents = {},
  } = state;

  return {
    authPermissions,
    authenticated_category,
    visible: visible && type === DRAWER.CREATE_CAREPLAN_TEMPLATE,
    loading,
    payload,
    vital_templates,
    repeat_intervals,
    exercise_contents,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    close: () => dispatch(close()),
    createCareplanTemplate: (payload) =>
      dispatch(createCareplanTemplate(payload)),
    getAllTemplatesForDoctor: () => dispatch(getAllTemplatesForDoctor()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TemplatePageCreateDrawer);
