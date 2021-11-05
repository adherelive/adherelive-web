import React from "react";

export default (props) => {
  const {
    template_vital_ids,
    vitalsData = {},
    vital_templates = {},
    repeat_intervals = {},
  } = props;

  let vitals = [];
  let vitalCount = 0;
  let vitalMore = 0;

  for (let key of template_vital_ids) {
    if (vitalCount === 1) {
      vitalMore = template_vital_ids.length - vitalCount;
      break;
    }
    const {
      details: {
        description = "",
        duration = "",
        repeat_days = [],
        repeat_interval_id = "",
      } = {},
      basic_info: {
        care_plan_template_id = "",
        id = "",
        vital_template_id = "",
      } = {},
    } = vitalsData[key];

    const { basic_info: { name: vital_name = "" } = {} } =
      vital_templates[vital_template_id] || {};
    const repeatObj = repeat_intervals[repeat_interval_id];
    const vital_repeat = repeatObj["text"];

    vitals.push(
      <div className="flex wp100 align-center " key={key}>
        <div className="flex direction-column mb10">
          <div className="flex align-center">
            <div className="fs18 fw600">{vital_name}</div>
          </div>
          <div className="flex direction-column">{vital_repeat}</div>
          <div className="flex direction-column">{`Repeat: ${repeat_days}`}</div>
        </div>
      </div>
    );

    vitalCount += 1;
  }

  if (vitalMore > 0) {
    vitals.push(<div className="fs16 fw700">{`+ ${vitalMore} more`}</div>);
  }

  return vitals;
};
