import React from "react";

import { TABLE_COLUMN } from "../helper";
import messages from "../messages";
import Organizer from "../dataColumn/organizer";
import AppointmentDate from "../dataColumn/appointmentDate";
import Timing from "../dataColumn/timing";
import Description from "../dataColumn/description";

export default props => {
  const { formatMessage } = props || {};

  return [
    {
      title: formatMessage(messages.organizer),
      ...TABLE_COLUMN.VITAL,
      render: data => {
        const { vitalTemplateData } = data || {};
        return (
          <Name vitalTemplateData={vitalTemplateData} />
        );
      }
    },
    {
      title: formatMessage(messages.appointment_date),
      ...TABLE_COLUMN.TAKEN,

      render: vitalData => <Taken vitalData={vitalData} />
    },
    {
      title: formatMessage(messages.timing_text),
      ...TABLE_COLUMN.DESCRIPTION,
      render: vitalData => <Description vitalData={vitalData} />
    },
    {
      title: "",
      ...TABLE_COLUMN.TIMELINE,

      render: ({openResponseDrawer}) => <TimelineButton openResponseDrawer={openResponseDrawer} />
    },
    {
      title: "",
      ...TABLE_COLUMN.EDIT,

      render: ({id}) => <EditButton id={id} />
    }
  ];
};
