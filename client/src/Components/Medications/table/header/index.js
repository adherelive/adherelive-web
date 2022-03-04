import React from "react";

import { TABLE_COLUMN } from "../helper";
import messages from "../messages";
import Medicine from "../dataColumn/medicine";
import Intake from "../dataColumn/intake";
import TimelineButton from "../dataColumn/timelineButton";
import EditButton from "../dataColumn/editButton";
import Duration from "../dataColumn/duration";
import Taken from "../dataColumn/taken";

export default (props) => {
  const { formatMessage } = props || {};

  return [
    {
      title: formatMessage(messages.medicine_name),
      ...TABLE_COLUMN.MEDICINE,
      render: (data) => {
        const { medicationData, medicationTemplateData } = data || {};
        return (
          <Medicine
            medicationTemplateData={medicationTemplateData}
            medicationData={medicationData}
          />
        );
      },
    },
    {
      title: formatMessage(messages.taken_vs_total),
      ...TABLE_COLUMN.TAKEN,

      render: ({ medicationData }) => <Taken medicationData={medicationData} />,
    },
    {
      title: formatMessage(messages.intake),
      ...TABLE_COLUMN.INTAKE,

      render: ({ medicationData }) => (
        <Intake medicationData={medicationData} />
      ),
    },
    {
      title: formatMessage(messages.duration),
      ...TABLE_COLUMN.DURATION,
      render: ({ medicationData }) => (
        <Duration medicationData={medicationData} />
      ),
    },
    {
      title: "Adherence",
      ...TABLE_COLUMN.TIMELINE,

      render: ({ openResponseDrawer, formatMessage, id }) => (
        <TimelineButton
          formatMessage={formatMessage}
          openResponseDrawer={openResponseDrawer}
          id={id}
        />
      ),
    },
    {
      title: "",
      ...TABLE_COLUMN.EDIT,

      render: ({ openEditDrawer, formatMessage, id, canViewDetails }) => (
        <EditButton
          formatMessage={formatMessage}
          id={id}
          action={openEditDrawer}
          canViewDetails={canViewDetails}
        />
      ),
    },
  ];
};
