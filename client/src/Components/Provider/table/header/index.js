import React from "react";

import { TABLE_COLUMN } from "../helper";
import messages from "../messages";
import Name from "../dataColumn/name";
import Address from "../dataColumn/address";
import ContactDetails from "../dataColumn/contactDetails";
import Edit from "../dataColumn/edit";

export default (props) => {
  const { formatMessage } = props || {};

  return [
    {
      title: formatMessage(messages.name),
      ...TABLE_COLUMN.NAME,
      render: (providerData) => <Name {...providerData} />,
    },
    {
      title: formatMessage(messages.address),
      ...TABLE_COLUMN.ADDRESS,
      render: (providerData) => <Address {...providerData} />,
    },
    {
      title: formatMessage(messages.contact_details),
      ...TABLE_COLUMN.CONTACT_DETAILS,
      render: (userData) => <ContactDetails {...userData} />,
    },
    {
      title: "",
      ...TABLE_COLUMN.EDIT,
      render: (data) => {
        const { providerData, openEditProviderDrawer } = data;
        return (
          <Edit
            {...providerData}
            openEditProviderDrawer={openEditProviderDrawer}
          />
        );
      },
    },
  ];
};
