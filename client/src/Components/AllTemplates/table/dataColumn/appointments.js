import React from "react";
import moment from "moment";

export default (props) => {
  const { template_appointment_ids, appointmentsData = {} } = props;

  let appointments = [];
  let apptCount = 0;
  let apptMore = 0;

  for (let key of template_appointment_ids) {
    if (apptCount === 1) {
      apptMore = template_appointment_ids.length - apptCount;
      break;
    }

    const {
      reason = "",
      details: { description = "", date = "", start_time = "" } = {},
      time_gap = "",
    } = appointmentsData[key] || {};

    appointments.push(
      <div className="flex wp100 align-center " key={key}>
        <div className="flex direction-column mb10">
          <div className="flex align-center">
            <div className="fs18 fw600">{reason}</div>
          </div>
          <div className="flex direction-column">
            {date
              ? `After ${moment(date).diff(moment(), "days")} days`
              : time_gap
              ? `After ${time_gap - 1} days`
              : ""}
          </div>
        </div>
      </div>
    );

    apptCount += 1;
  }

  if (apptMore > 0) {
    appointments.push(<div className="fs16 fw700">{`+ ${apptMore} more`}</div>);
  }
  return appointments;
};
