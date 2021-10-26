import React from "react";

import { TABLE_COLUMN } from "../helper";
import messages from "../messages";
import Vital from "../dataColumn/vital";
import Taken from "../dataColumn/taken";
import TimelineButton from "../dataColumn/timelineButton";
import EditButton from "../dataColumn/editButton";
import Description from "../dataColumn/description";

export default (props) => {
  const { formatMessage } = props || {};

  return [
    {
      title: formatMessage(messages.vital_name),
      ...TABLE_COLUMN.VITAL,
      render: (data) => {
        const { vitalTemplateData } = data || {};
        return <Vital vitalTemplateData={vitalTemplateData} />;
      },
    },
    {
      title: formatMessage(messages.taken_vs_total),
      ...TABLE_COLUMN.TAKEN,

      render: ({ vitalData }) => <Taken vitalData={vitalData} />,
    },
    {
      title: formatMessage(messages.description),
      ...TABLE_COLUMN.DESCRIPTION,
      render: ({ vitalData }) => <Description vitalData={vitalData} />,
    },
    {
      title: "Adherence",
      ...TABLE_COLUMN.TIMELINE,

      render: ({ openResponseDrawer, formatMessage, id }) => (
        <TimelineButton
          formatMessage={formatMessage}
          action={openResponseDrawer}
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
