import { withRouter } from "react-router-dom";
import Validation from "../../Components/Validation";
import { verifyUser } from "../../modules/auth";
import { connect } from "react-redux";

const mapStateToProps = (state) => {};

const mapDispatchToProps = (dispatch) => {
  return {
    verifyUser: (link) => dispatch(verifyUser(link)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Validation)
);
