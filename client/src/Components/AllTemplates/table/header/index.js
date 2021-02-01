import React from "react";

import { TABLE_COLUMN } from "../helper";
import messages from "../messages";
import Name from "../dataColumn/name";
import Medications from "../dataColumn/medications";
import Appointments from "../dataColumn/appointments";
import Vitals from "../dataColumn/vitals";
import Duplicate from "../dataColumn/duplicate";
import Edit from "../dataColumn/edit";
import CreatedAt from "../dataColumn/created";

export default props => {
  const { formatMessage } = props || {};


  return [
    {
      title:formatMessage(messages.templateName),
      ...TABLE_COLUMN.NAME,
      render: data => {
        const { templateData } = data || {};
        return <Name templateData={templateData}  />;
      }
    },
    {
      title: formatMessage(messages.createdAt),
      ...TABLE_COLUMN.CREATED_AT,
      render: data => {
        const { templateData } = data || {};
        return <CreatedAt templateData={templateData}  />;
      }
    },
    {
      title: "",
      ...TABLE_COLUMN.EDIT,
      render: data => {
        const {  id , duplicateCareplanTemplate, handleOpenEditDrawer , templateData } = data;

        return (
          <Edit id={id} duplicateCareplanTemplate={duplicateCareplanTemplate} 
          handleOpenEditDrawer={handleOpenEditDrawer} 
          templateData={templateData}/>
        );
      }
    },
  ];
};
