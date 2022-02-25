import { connect } from "react-redux";
import TransactionTable from "../../../Components/Transaction/table/index";
import { withRouter } from "react-router-dom";
import { getAllTransactions } from "../../../modules/providers";

const mapStateToProps = (state) => {
  const {
    transactions = {},
    doctors = {},
    patients = {},
    payment_products = {},
    pages: { transaction_ids = [] } = {},
    users = {},
    auth = {},
    user_roles = {},
  } = state;

  const { authenticated_user, authenticated_category } = auth;

  return {
    transactions,
    transaction_ids,
    doctors,
    patients,
    payment_products,
    authenticated_user,
    authenticated_category,
    users,
    user_roles,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllTransactions: () => dispatch(getAllTransactions()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TransactionTable)
);
