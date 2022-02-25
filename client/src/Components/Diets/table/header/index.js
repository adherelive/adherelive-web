import React from "react";

import { TABLE_COLUMN } from "../helper";
import messages from "../messages";
import Name from "../dataColumn/name";
import Duration from "../dataColumn/duration";
import RepeatDays from "../dataColumn/repeatDays";
import Calories from "../dataColumn/calories";
import Edit from "../dataColumn/edit";
import TimelineButton from "../dataColumn/timelineButton";

export default (props) => {
  const { formatMessage } = props || {};

  return [
    {
      title: formatMessage(messages.name),
      ...TABLE_COLUMN.NAME,
      render: (data) => {
        const { dietData, formatMessage } = data || {};
        return <Name dietData={dietData} formatMessage={formatMessage} />;
      },
    },
    {
      title: formatMessage(messages.duration),
      ...TABLE_COLUMN.DURATION,

      render: ({ dietData }) => <Duration dietData={dietData} />,
    },
    {
      title: formatMessage(messages.repeat_days),
      ...TABLE_COLUMN.REPEAT_DAYS,

      render: ({ dietData }) => <RepeatDays dietData={dietData} />,
    },
    {
      title: formatMessage(messages.calories),
      ...TABLE_COLUMN.CALORIES,
      render: ({ dietData }) => <Calories dietData={dietData} />,
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

      render: ({
        openEditDrawer,
        formatMessage,
        id,
        dietData,
        canViewDetails,
      }) => (
        <Edit
          formatMessage={formatMessage}
          id={id}
          action={openEditDrawer}
          dietData={dietData}
          canViewDetails={canViewDetails}
        />
      ),
    },
  ];
};
