import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import DietResponseDrawer from "../../Components/Drawer/dietResponses";

import { close } from "../../modules/drawer";
import { DRAWER } from "../../constant";

const mapStateToProps = (state) => {
  const {
    drawer: {
      visible,
      data: { type, payload: { diet_id, diet_name, loading } = {} } = {},
    },
    diets = {},
    schedule_events = {},
    upload_documents = {},
    pages: { diet_response_ids = [] } = {},
    diet_responses = {},
  } = state;

  return {
    diet_id,
    diet_name,
    loading,
    visible: visible && type === DRAWER.DIET_RESPONSE,
    diets,
    schedule_events,
    upload_documents,
    diet_response_ids,
    diet_responses,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    close: () => dispatch(close()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DietResponseDrawer)
);
