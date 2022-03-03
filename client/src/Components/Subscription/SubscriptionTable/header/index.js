import React from "react";

import { TABLE_COLUMN } from "../helper";
// import messages from "../messages";
import Duration from "../datacolumn/duration";
import Name from "../datacolumn/name";
import Status from "../datacolumn/status";
import Fees from "../datacolumn/fees";
import MyTasks from "../datacolumn/myTasks";
import Edit from "../datacolumn/edit";

export default (props) => {
  // const { formatMessage } = props || {};

  return [
    {
      // title: formatMessage(messages.pid),
      title: "Subscription/Service",
      ...TABLE_COLUMN.NAME,
      render: (data) => {
        return <Name {...data} />;
      },
    },
    {
      title: "Status",
      ...TABLE_COLUMN.STATUS,
      render: (data) => <Status {...data} />,
    },
    {
      title: "Duration",
      ...TABLE_COLUMN.DURATION,
      render: (data) => <Duration {...data} />,
    },
    {
      title: "Fees",
      ...TABLE_COLUMN.FEES,
      render: (data) => <Fees {...data} />,
    },
    {
      title: "My tasks",
      ...TABLE_COLUMN.TASKS,
      render: (data) => <MyTasks {...data} />,
    },
    {
      title: "Edit/Renew",
      ...TABLE_COLUMN.EDIT,
      render: (data) => <Edit {...data} />,
    },
  ];
};
