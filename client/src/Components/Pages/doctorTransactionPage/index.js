import React, { Component } from "react";
import { injectIntl } from "react-intl";
// import TransactionTable from "../../../Containers/Transaction/table/index";
import TransactionTable from "../../../Components/Subscription/TransactionTable";
import messages from "./messages";

class doctorTransactionPage extends Component {
  constructor(props) {
    super(props);
  }

  formatMessage = (data) => this.props.intl.formatMessage(data);

  render() {
    return (
      <div className="wp100 flex direction-column">
        <div className="p18 fs30 fw700 ">
          {this.formatMessage(messages.transaction_table_header)}
        </div>
        <div className="wp100 pl14 pr14 flex align-center justify-center transaction_table">
          <TransactionTable />
        </div>
      </div>
    );
  }
}

export default injectIntl(doctorTransactionPage);
