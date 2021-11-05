import React from "react";

import { TABLE_COLUMN } from "../helper";
import messages from "../message";
import Name from "../dataColumn/name";
import Edit from "../dataColumn/edit";
import Date from "../dataColumn/date";
import ReportDocuments from "../dataColumn/reportDocuments";

export default (props) => {
  const { formatMessage } = props || {};

  return [
    {
      title: formatMessage(messages.report_name),
      ...TABLE_COLUMN.NAME,
      render: (props) => {
        // const { vitalTemplateData } = data || {};
        return <Name {...props} />;
      },
    },
    {
      title: formatMessage(messages.time),
      ...TABLE_COLUMN.TIME,

      render: (props) => <Date {...props} />,
    },
    {
      title: formatMessage(messages.report_documents),
      ...TABLE_COLUMN.REPORT_DOCUMENTS,
      render: (props) => <ReportDocuments {...props} />,
    },
    {
      title: "",
      ...TABLE_COLUMN.EDIT,
      render: (props) => <Edit {...props} />,
    },
  ];
};
