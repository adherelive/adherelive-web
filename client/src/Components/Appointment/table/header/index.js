import React from "react";

import { TABLE_COLUMN } from "../helper";
import messages from "../messages";
import Organizer from "../dataColumn/organizer";
import AppointmentDate from "../dataColumn/appointmentDate";
import Timing from "../dataColumn/timing";
import Description from "../dataColumn/description";

export default (props) => {
  const { formatMessage } = props || {};

  return [
    {
      title: formatMessage(messages.organizer),
      ...TABLE_COLUMN.ORGANIZER,
      render: (data) => {
        const { appointmentData, userData } = data || {};
        return (
          <Organizer appointmentData={appointmentData} userData={userData} />
        );
      },
    },
    {
      title: formatMessage(messages.appointment_date),
      ...TABLE_COLUMN.DATE,

      ellipsis: true,
      render: (appointmentData) => <AppointmentDate {...appointmentData} />,
    },
    {
      title: formatMessage(messages.timing_text),
      ...TABLE_COLUMN.TIMING,
      render: (appointmentData) => <Timing appointmentData={appointmentData} />,
    },
    {
      title: formatMessage(messages.description),
      ...TABLE_COLUMN.DESCRIPTION,

      ellipsis: true,
      render: (appointmentData) => <Description {...appointmentData} />,
    },
  ];
};
