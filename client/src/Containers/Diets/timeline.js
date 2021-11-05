import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import DietTimeline from "../../Components/Diets/timeline";
import { getDietTimeline } from "../../modules/diets";

const mapStateToProps = (state) => {
  const {
    diets = {},
    schedule_events = {},
    upload_documents = {},
    pages: { diet_response_ids = [] } = {},
    diet_responses = {},
  } = state;

  return {
    diets,
    schedule_events,
    upload_documents,
    diet_response_ids,
    diet_responses,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getDietTimeline: (id) => dispatch(getDietTimeline(id)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DietTimeline)
);
