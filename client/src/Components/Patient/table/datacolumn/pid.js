import React from "react";
// import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";

export default props => {
  const {
    patientData: { basic_info: { first_name, middle_name, last_name } = {} } = {},
    // openPatientDrawer,
    chatData: { messages: { unread = "0" } = {} } = {}
  } = props || {};

  return (
    <div className="tab-color flex align-center">
      <div className="fw600">{`${first_name} ${middle_name ? `${middle_name} `: ""}${last_name}`}</div>
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
