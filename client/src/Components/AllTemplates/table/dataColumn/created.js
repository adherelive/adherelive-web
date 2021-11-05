import React from "react";
import moment from "moment";

export default (props) => {
  const { templateData: { created_at = "" } = {} } = props || {};

  return (
    <div className="fs18 fw600">
      {created_at ? moment(created_at).format("MMM Do YY") : "--"}
    </div>
  );
};
