export const TABLE_COLUMN = {
  PID: {
    key: "PID",
    dataIndex: "PID",
    width: 200,
    fixed: "left"
  },
  CONDITION: {
    key: "CONDITION",
    dataIndex: "CONDITION"
  },
  TREATMENT: {
    key: "TREATMENT",
    dataIndex: "TREATMENT"
  },
  SEVERITY: {
    key: "SEVERITY",
    dataIndex: "SEVERITY"
  },
  AGE: {
    key: "AGE",
    dataIndex: "AGE"
  },
  START_DATE: {
    key: "START_DATE",
    dataIndex: "START_DATE"
  },
  DOCTOR: {
    key: "DOCTOR",
    dataIndex: "DOCTOR"
  },
  PROVIDER: {
    key: "PROVIDER",
    dataIndex: "PROVIDER"
  },
  NEW_SYMPTOMS: {
    key: "NEW_SYMPTOMS",
    dataIndex: "NEW_SYMPTOMS"
  }
};

export const formatPatientTableData = data => {
  let { id, patients, doctors, providers, treatments, chats, chat_ids, users, care_plans } =
    data || {};

    console.log('CARE PLANSSSSS=================>',id,patients,care_plans);

  let patientData = patients[id] || {};
  let treatment='';
  let condition='';
  let severity='';

  let carePlanData =  {};
  for(let carePlan of Object.values(care_plans)){
    let{basic_info={}}=carePlan;
    let{patient_id:patientId=1,id:carePlanId=1}=basic_info;
    console.log('CARE PLANSSSSS222=================>',patientId,patientId==id);
    if(patientId==id){
    const{treatment:cTreatment='',condition:cCondition='',severity:cSeverity=''}=carePlan;
    // console.log('CARE PLANSSSSS3333=================>',cTreatment,cCondition,cSeverity,basic_info);
    treatment=cTreatment;
    condition=cCondition;
    severity=cSeverity
    carePlanData=care_plans[carePlanId];
    }
  }
  patientData = {...patients[id],treatment,condition,severity};

  const {basic_info: {doctor_id, name: carePlanName} = {}, activated_on} = care_plans["1"] || {}; // todo: constant for now as careplan runs from seeder as design is not finalized

  console.log("2363645 patientData --> ", patientData);
  const { basic_info: {user_id}, treatment_id, provider_id, chats: patientChatIds = [] } =
    patientData || {};

    const {basic_info: {first_name, middle_name, last_name} = {}} = doctors[doctor_id] || {};

    const {} = users[user_id] || {};
  let chatData = {};

  console.log(
    "293423 chats, chat_ids, patientChatIds --> ",
    chats,
    chat_ids,
    patientChatIds
  );

  chat_ids.forEach(id => {
    const { doctor_id: chatDoctorId } = chats[id] || {};
    if (doctor_id === chatDoctorId) {
      chatData = { ...chats[id] };
    }
  });

  const treatmentData = treatments[treatment_id] || {};
  const doctorData = doctors[doctor_id] || {};
  const providerData = providers[provider_id] || {};
  return {
    patientData,
    doctorData,
    providerData,
    treatmentData,
    chatData,
    carePlanData
  };
};
