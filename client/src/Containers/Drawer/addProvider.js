import { connect } from "react-redux";
import addProviderDrawer from "../../Components/Drawer/addProvider";
import { addProvider } from "../../modules/providers";
import { uploadDocument } from "../../modules/auth";
import { DRAWER } from "../../constant";
import { close } from "../../modules/drawer";

const mapStateToProps = (state) => {
  const {
    drawer: { visible, loading, data: { type, payload = {} } = {} },
  } = state;

  return {
    visible: visible && type === DRAWER.ADD_PROVIDER,
    loading,
    payload,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addProvider: (data) => dispatch(addProvider(data)),
    uploadDocument: (file) => dispatch(uploadDocument(file)),
    close: () => dispatch(close()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(addProviderDrawer);
