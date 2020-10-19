import React,{ Component }  from "react";
// import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";
import {getName} from "../../../../Helper/validation";







export default props => {
  const {
    patientData: { basic_info: { first_name, middle_name, last_name,id } = {} } = {},
    chatData: { messages: { unread = "0" } = {} } = {},
      onRowClick,
  } = props || {};

  return (
    <div className="wp100 p10 flex align-center justify-space-between" onClick={onRowClick(id)}>
      <div className="fw600 tab-color ">
      
        {`${first_name}  ${getName(middle_name)} ${getName(last_name)}`}</div>

      {unread === "0" ? (
        ""
      ) : (
        <div className="br50 w20 h20 bg-red text-white text-center ml10">
          {unread}
        </div>
      )}
    </div>
  );
};

