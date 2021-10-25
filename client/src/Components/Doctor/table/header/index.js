import React from "react";

import { TABLE_COLUMN } from "../helper";
import messages from "../messages";
import Name from "../dataColumn/name";
import Verified from "../dataColumn/verified";
import Speciality from "../dataColumn/speciality";
import Address from "../dataColumn/address";
import ContactDetails from "../dataColumn/contactDetails";
import Active from "../dataColumn/active";

export default (props) => {
  const { formatMessage } = props || {};

  return [
    {
      title: formatMessage(messages.name),
      ...TABLE_COLUMN.NAME,
      render: (data) => {
        const { doctorData, userData, formatMessage } = data || {};
        return (
          <Name
            doctorData={doctorData}
            userData={userData}
            formatMessage={formatMessage}
          />
        );
      },
    },
    {
      title: formatMessage(messages.verified),
      ...TABLE_COLUMN.VERIFIED,
      render: (doctorData) => <Verified {...doctorData} />,
    },
    {
      title: formatMessage(messages.speciality),
      ...TABLE_COLUMN.SPECIALITY,
      render: (doctorData) => <Speciality {...doctorData} />,
    },
    {
      title: formatMessage(messages.address),
      ...TABLE_COLUMN.ADDRESS,
      render: (doctorData) => <Address {...doctorData} />,
    },
    {
      title: formatMessage(messages.contact_details),
      ...TABLE_COLUMN.CONTACT_DETAILS,
      render: (userData) => <ContactDetails {...userData} />,
    },
  ];
};
