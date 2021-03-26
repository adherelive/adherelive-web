import React , {Fragment} from "react";

import { TABLE_COLUMN } from "../helper";
import messages from "../messages";
import PID from "../datacolumn/pid";
import Diagnosis from "../datacolumn/diagnosis";
import Treatment from "../datacolumn/treatment";
import Severity from "../datacolumn/severity";
import StartDate from "../datacolumn/startDate";
import CreatedAt from "../datacolumn/createdAt";
import moment from "moment";
import { FINAL , PROBABLE} from "../../../../constant";

export default props => {
  const { formatMessage , 
    tabChanged
   } = props || {};


  return [
    {
      title: "Patient",
      ...TABLE_COLUMN.PID,
      
      render: data => {
        const { patientData, addToWatchlist ,doctorData, onRowClick,removePatientFromWatchlist ,
           currentTab,handleGetPatients,tabChanged , offset , paginated_patient_ids} = data || {};
           
        return <PID onRowClick={onRowClick} patientData={patientData}
          addToWatchlist={addToWatchlist} doctorData={doctorData}
          removePatientFromWatchlist={removePatientFromWatchlist}
          currentTab={currentTab}
          handleGetPatients={handleGetPatients}
          tabChanged={tabChanged}
          offset={offset}
          paginated_patient_ids={paginated_patient_ids}
          />;
      },
      sorter: (a, b) => {
        
        
        const {patientData : {first_name : aFirstName} = {}} = a[TABLE_COLUMN.PID.dataIndex] || {};
        const {patientData : {first_name : bFirstName} = {}} = b[TABLE_COLUMN.PID.dataIndex] || {};
        



        if(aFirstName.localeCompare(bFirstName) === -1) {
          return 1;
        } else {
          return -1;
        }
  
      },
      [tabChanged && "sortOrder"]:tabChanged && null
      
    },
    {
      title: formatMessage(messages.diagnosis),
      ...TABLE_COLUMN.DIAGNOSIS,
      render: patientData => <Diagnosis {...patientData} />,
      // filters: [
      //   {
      //     text: "Final",
      //     value: FINAL,
      //   },
      //   {
      //     text: 'Probable',
      //     value: PROBABLE,
      //   },
      // ],
      // onFilter: (value, record) => {
      //   const {patientData: { care_plan_details : { diagnosis : { type = '', descritpion = '' } = {} } = {} } = {} } = record.DIAGNOSIS || {};
      //   return (value === type);
      // },
    },
    {
      title: formatMessage(messages.treatment),
      ...TABLE_COLUMN.TREATMENT,
      render: data => {
        const { patientData, treatmentData, carePlanData } = data;
        return (
          <Treatment patientData={patientData} treatmentData={treatmentData} carePlanData={carePlanData} />
        );
      }
    },
    {
      title: formatMessage(messages.severity),
      ...TABLE_COLUMN.SEVERITY,
      render: treatmentData => <Severity {...treatmentData} />
    },
    {
      title: formatMessage(messages.start_date),
      ...TABLE_COLUMN.START_DATE,
      render: carePlanData => <StartDate {...carePlanData} />
    },
    {
      title: "Created At",
      ...TABLE_COLUMN.CREATED_AT,
      render: patientData => <CreatedAt {...patientData} />,
      sorter: (a, b) => {
        
        
        const {patientData : {created_at : aCreatedAt} = {}} = a[TABLE_COLUMN.CREATED_AT.dataIndex] || {};
        const {patientData : {created_at : bCreatedAt} = {}} = b[TABLE_COLUMN.CREATED_AT.dataIndex] || {};
        
        if(moment(aCreatedAt).isBefore(moment(bCreatedAt))) {
          return 1;
        } else {
          return -1;
        }
  
      },
      [tabChanged && "sortOrder"]:tabChanged && null
    }
  ];
};
