import { connect } from "react-redux";
import Symptoms from "../../Components/Symptoms";
import { DRAWER } from "../../constant";
import { getSymptomTimeLine, getHistorySymptom } from "../../modules/symptoms";

const mapStateToProps = (state) => {
  const {
    drawer: { visible, loading, data: { type, payload = {} } = {} },
    other_details: { medication_details = {} } = {},
    medicines,
    upload_documents = {},
  } = state;
  return {
    visible: visible && type === DRAWER.SYMPTOMS,
    loading,
    payload,
    medication_details,
    medicines,
    upload_documents,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getSymptomTimeLine: (patientId) => dispatch(getSymptomTimeLine(patientId)),
    getHistorySymptom: (patientId, days) =>
      dispatch(getHistorySymptom(patientId, days)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Symptoms);
