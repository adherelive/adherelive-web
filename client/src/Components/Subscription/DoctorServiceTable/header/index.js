import React from "react";

import { TABLE_COLUMN } from "../helper";
// import messages from "../messages";
import Amount from "../datacolumn/amount";
import Name from "../datacolumn/name";
import Type from "../datacolumn/type";
import Delete from "../datacolumn/deleteButton";
import Edit from "../datacolumn/edit";

export default (props) => {
  // const { formatMessage } = props || {};

  return [
    {
      // title: formatMessage(messages.pid),
      title: "Service Offering Name",
      ...TABLE_COLUMN.NAME,
      render: (data) => {
        return <Name {...data} />;
      },
    },
    {
      title: "Service Type",
      ...TABLE_COLUMN.TYPE,
      render: (data) => <Type {...data} />,
    },
    {
      title: "Amount",
      ...TABLE_COLUMN.AMOUNT,
      render: (data) => <Amount {...data} />,
    },
    {
      title: "",
      ...TABLE_COLUMN.EDIT,
      render: (data) => <Edit {...data} />,
    },
    {
      title: "",
      ...TABLE_COLUMN.DELETE,
      render: (data) => <Delete {...data} />,
    },
  ];
};
