import React, { Component } from "react";
import { injectIntl } from "react-intl";
import Rate from "antd/es/rate";
import message from "antd/es/message";
import {getFullName} from "../../../../Helper/common";

class Watchlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdded: false
    };
  }

  componentDidMount() {
    const {
      patientData: {
        basic_info: { id } = {}
      } = {},
      doctorData: { watchlist_patient_ids = [] } = {},
      removePatientFromWatchlist
    } = this.props || {};

    if (watchlist_patient_ids.includes(id)) {
      this.setState({ isAdded: true });
    }
  }

  addThisToWatchlist = () => {
    const { patientData: { basic_info: { id, first_name, middle_name, last_name } = {} } = {}, addToWatchlist } =
      this.props || {};

    addToWatchlist(id).then(response => {
      const {status, message: errMessage} = response || {};
      if(status === true) {
        message.success(`${getFullName({first_name, middle_name, last_name})} added to watchlist`);
      } else {
        message.warn(errMessage);
      }
    });

    this.setState({
      isAdded: true
    });
  };

  removeFromWatchlist = () => {
    const { patientData: { basic_info: { id, first_name, middle_name, last_name } = {} } = {}, addToWatchlist ,removePatientFromWatchlist} =
      this.props || {};
    removePatientFromWatchlist(id).then(response => {
      const {status, message: errMessage} = response || {};
      if(status === true) {
        message.success(`${getFullName({first_name, middle_name, last_name})} removed from watchlist`);
      } else {
        message.warn(errMessage);
      }
    });


    this.setState({
      isAdded: false
    });

    
  };

  render() {
    const { isAdded } = this.state;
    return (
      <div className=" flex align-center justify-space-between">
          {/* <Rate count={1} value={isAdded ? 1 : 0} onChange={this.addThisToWatchlist}/> */}
        {isAdded ? (
          <Rate  count={1}  value={isAdded} 
          onChange={this.removeFromWatchlist} 
          />
        ) : (
          <Rate count={1}  value={isAdded} 
           onChange={this.addThisToWatchlist}
         />
        )}
      </div>
    );
  }
}

export default injectIntl(Watchlist);
