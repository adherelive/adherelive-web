// import React,{ Component }  from "react";
// // import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";
import { getName } from "../../../../Helper/validation";
import React, { Component } from "react";
import { injectIntl } from "react-intl";
// import Icon from "antd/es/rate";
import message from "antd/es/message";
import { getFullName } from "../../../../Helper/common";
import { Icon } from "antd";

class Watchlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdded: false
    };
  }

  componentDidMount() {
    const {
      patientData: { basic_info: { id } = {} } = {},
      doctorData: { watchlist_patient_ids = [] } = {},
      removePatientFromWatchlist
    } = this.props || {};

    if (watchlist_patient_ids.includes(id)) {
      this.setState({ isAdded: true });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      patientData: { basic_info: { id: prev_id } = {} } = {},
      doctorData: {
        watchlist_patient_ids: prev_watchlist_patient_ids = []
      } = {},
      removePatientFromWatchlist: prev_removePatientFromWatchlist
    } = prevProps || {};

    const {
      patientData: { basic_info: { id } = {} } = {},
      doctorData: { watchlist_patient_ids = [] } = {},
      removePatientFromWatchlist
    } = this.props || {};

    if (
      prev_watchlist_patient_ids.length !== watchlist_patient_ids.length &&
      !watchlist_patient_ids.includes(id)
    ) {
      this.setState({
        isAdded: watchlist_patient_ids.includes(id)
      });
    }
  }

  addThisToWatchlist = e => {
    e.preventDefault();
    const {
      patientData: {
        basic_info: { id, first_name, middle_name, last_name } = {}
      } = {},
      addToWatchlist
    } = this.props || {};

    addToWatchlist(id).then(response => {
      const { status, message: errMessage } = response || {};
      if (status === true) {
        message.success(
          `${getFullName({
            first_name,
            middle_name,
            last_name
          })} added to watchlist`
        );
      } else {
        message.warn(errMessage);
      }
    });

    this.setState({
      isAdded: true
    });
  };

  removeFromWatchlist = e => {
    e.preventDefault();
    const {
      patientData: {
        basic_info: { id, first_name, middle_name, last_name } = {}
      } = {},
      addToWatchlist,
      removePatientFromWatchlist
    } = this.props || {};

    removePatientFromWatchlist(id).then(response => {
      const { status, message: errMessage } = response || {};
      if (status === true) {
        message.success(
          `${getFullName({
            first_name,
            middle_name,
            last_name
          })} removed from watchlist`
        );
      } else {
        message.warn(errMessage);
      }
    });

    this.setState({
      isAdded: false
    });
  };

  stopEventBubbling = e => {
    e.stopPropagation();
  };

  render() {
    const { isAdded } = this.state;
    const {
      patientData: {
        basic_info: { first_name, middle_name, last_name, id } = {}
      } = {},
      chatData: { messages: { unread = "0" } = {} } = {},
      onRowClick
    } = this.props || {};

    const { patientData: { basic_info: { age, gender = "" } = {} } = {} } =
      this.props || {};

    return (
      <div
        className="wp100 p10 flex align-center justify-space-between"
        onClick={onRowClick(id)}
      >
        <div className="wp100 p10 flex direction-column align-left ">
          <div className="fw600 tab-color ">
            {`${first_name}  ${getName(middle_name)} ${getName(last_name)}`}
          </div>
          <div className="flex direction-row  align-left">
            <div>{age ? `${age} ,  ` : "-- , "}</div>

            <div>{gender ? gender.toUpperCase() : "--"}</div>
          </div>
        </div>
        {unread === "0" ? (
          ""
        ) : (
          <div className="br50 w20 h20 bg-red text-white text-center ml10">
            {unread}
          </div>
        )}

        <div
          className=" flex align-center justify-space-between"
          onClick={this.stopEventBubbling}
        >
          {isAdded ? (
            <Icon
              type="eye"
              className="fs24"
              value={isAdded}
              onClick={this.removeFromWatchlist}
            />
          ) : (
            <Icon
              type="eye-invisible"
              theme="filled"
              className="fs24"
              value={isAdded}
              onClick={this.addThisToWatchlist}
            />
          )}
        </div>
      </div>
    );
  }
}

export default injectIntl(Watchlist);

// export default props => {
//   const {
//     patientData: { basic_info: { first_name, middle_name, last_name,id } = {} } = {},
//     chatData: { messages: { unread = "0" } = {} } = {},
//       onRowClick,
//   } = props || {};

//   return (
//     <div className="wp100 p10 flex align-center justify-space-between" onClick={onRowClick(id)}>
//       <div className="fw600 tab-color ">

//         {`${first_name}  ${getName(middle_name)} ${getName(last_name)}`}</div>

//       {unread === "0" ? (
//         ""
//       ) : (
//         <div className="br50 w20 h20 bg-red text-white text-center ml10">
//           {unread}
//         </div>
//       )}
//     </div>
//   );
// };
