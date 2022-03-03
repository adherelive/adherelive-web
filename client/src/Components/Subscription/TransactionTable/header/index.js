import React from "react";

import { TABLE_COLUMN, getTransactionFilters } from "../helper";
import messages from "../messages";
import TransactionId from "../dataColumn/id";
import Doctor from "../dataColumn/doctor";
import Patient from "../dataColumn/patient";
import Subscription from "../dataColumn/subscription";
import Duration from "../dataColumn/duration";
import Payment from "../dataColumn/payment";
import PaymentProduct from "../dataColumn/paymentProduct";
import Amount from "../dataColumn/amount";
import Status from "../dataColumn/status";
import Date from "../dataColumn/date";
import { USER_CATEGORY } from "../../../../constant";

export default (props) => {
  const { formatMessage, authenticated_category } = props || {};

  return [
    {
      title: formatMessage(messages.transaction_id),
      ...TABLE_COLUMN.ID,
      render: (data) => {
        // const { transactionData } = data || {};
        return <TransactionId />;
      },
    },
    {
      title: formatMessage(messages.doctor_header),
      ...TABLE_COLUMN.DOCTOR,
      render: (data) => {
        // const { transactionData } = data || {};
        return <Doctor />;
      },
    },
    {
      title: formatMessage(messages.patient_header),
      ...TABLE_COLUMN.PATIENT,
      render: (data) => {
        const { patientData } = data || {};
        return <Patient />;
      },
    },
    {
      title: formatMessage(messages.subscription_header),
      ...TABLE_COLUMN.SUBSCRIPTION,
      render: (data) => {
        const { patientData } = data || {};
        return <Subscription />;
      },
    },
    {
      title: formatMessage(messages.duration_header),
      ...TABLE_COLUMN.DURATION,
      render: (data) => {
        const { patientData } = data || {};
        return <Duration />;
      },
    },
    // {
    //   title: formatMessage(messages.paymentProduct_header),
    //   ...TABLE_COLUMN.PAYMENT_PRODUCT,
    //   render: (data) => {
    //     const { paymentProductData } = data || {};
    //     return <PaymentProduct paymentProductData={paymentProductData} />;
    //   },
    // },
    {
      title: formatMessage(messages.amount_header),
      ...TABLE_COLUMN.AMOUNT,
      render: (data) => {
        const { transactionData, transaction_ids } = data;
        return (
          <Amount
          // transactionData={transactionData}
          // transaction_ids={transaction_ids}
          />
        );
      },
    },
    {
      title: formatMessage(messages.status_header),
      ...TABLE_COLUMN.STATUS,
      render: (data) => {
        // const { transactionData, transaction_ids } = data;
        return (
          <Status
          // transactionData={transactionData}
          // transaction_ids={transaction_ids}
          />
        );
      },

      filters: getTransactionFilters() || [],
      onFilter: (value, record) => {
        const { transactionData: { status } = {} } =
          record[TABLE_COLUMN.STATUS.dataIndex] || {};
        return value === status;
      },
    },
    {
      title: formatMessage(messages.date_header),
      ...TABLE_COLUMN.DATE,
      render: (data) => {
        // const { transactionData, transaction_ids } = data;
        return (
          <Date
          // transactionData={transactionData}
          // transaction_ids={transaction_ids}
          />
        );
      },
    },
    {
      title: formatMessage(messages.payment_header),
      ...TABLE_COLUMN.PAYMENT,
      render: (data) => {
        // const { transactionData, transaction_ids } = data;
        return (
          <Payment
          // transactionData={transactionData}
          // transaction_ids={transaction_ids}
          />
        );
      },
    },
  ];
};
