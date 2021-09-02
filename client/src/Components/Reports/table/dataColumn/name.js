import React from "react";

export default ({ uploaderData, reportData }) => {
  const { basic_info: { name } = {} } = reportData || {};

  const { basic_info: { full_name } = {} } = uploaderData || {};

  return (
    <div>
      <div className="fs18 fw700 black-85">{name}</div>
      <div className="fs14 fw600 brown-grey">{full_name}</div>
    </div>
  );
};
