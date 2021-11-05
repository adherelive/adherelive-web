import { connect } from "react-redux";
import updateProviderDrawer from "../../Components/Drawer/updateProvider";
import { updateProvider } from "../../modules/providers";
import { uploadDocument } from "../../modules/auth";
import { DRAWER } from "../../constant";
import { close } from "../../modules/drawer";

const mapStateToProps = (state) => {
  const {
    drawer: { visible, loading, data: { type, payload = {} } = {} },
    providers = {},
    users = {},
    account_details = {},
  } = state;

  return {
    visible: visible && type === DRAWER.EDIT_PROVIDER,
    loading,
    payload,
    providers,
    users,
    account_details,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateProvider: (id, data) => dispatch(updateProvider(id, data)),
    uploadDocument: (file) => dispatch(uploadDocument(file)),
    close: () => dispatch(close()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(updateProviderDrawer);
