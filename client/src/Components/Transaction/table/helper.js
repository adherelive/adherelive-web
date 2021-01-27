import { USER_CATEGORY } from "../../../constant";

export const TABLE_COLUMN = {
    ID: {
        key: "ID",
        dataIndex: "ID",
        fixed: "left",
    },
    DOCTOR: {
      key: "DOCTOR",
      dataIndex: "DOCTOR",
    //   width: 200
    },
    PATIENT: {
      key: "PATIENT",
      dataIndex: "PATIENT"
    },
    PAYMENT_PRODUCT: {
      key: "PAYMENT_PRODUCT",
      dataIndex: "PAYMENT_PRODUCT"
    },
    AMOUNT: {
      key: "AMOUNT",
      dataIndex: "AMOUNT"
    },
    STATUS: {
      key: "STATUS",
      dataIndex: "STATUS",
      filters: [
        {
          text: 'pending',
          value: 'pending',
        },
        {
          text: 'completed',
          value: 'completed',
        },
      ],
      onFilter: (value, record ) => {
        // console.log("874657483294723463792",{record,value,recordStatus:record.STATUS});
        const {transactionData : {status=''} = {} }  = record.STATUS || {};
        return(status === value);
      },
    },
    DATE: {
      key: "DATE",
      dataIndex: "DATE"
    }
};
  
  export const formatTransactionTableData = data => {
    let {
        id,
        transactions,
        patients,
        doctors,
        payment_products,
        transaction_ids,
        users
    } = data || {};
  
    const transactionData = transactions[id] || {};
    const {requestor = {} , payee = {} , basic_info : { payment_product_id = null } = {} } = transactions[id] || {};
    let doctorId = null;    

    let patientId = null; 
    const { id : requestor_id = null , category : requestor_cat = '' } = requestor;
    const { id : payee_id = null , category : payee_cat = '' } = payee;

    if(requestor_cat === USER_CATEGORY.DOCTOR ){
        doctorId = requestor_id;
        patientId = payee_id;
    }else{
        doctorId = payee_id;
        patientId = requestor_id;
    }


    const patientData = patients[patientId] || {};
    const doctorData = doctors[doctorId] || {} ;
    const paymentProductData = payment_products[payment_product_id] || {};
   
    return {
        transactionData,
        patientData,
        paymentProductData,
        doctorData,
        transaction_ids,
        users
    };
  };