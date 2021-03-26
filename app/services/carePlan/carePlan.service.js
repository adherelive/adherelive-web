import Database from "../../../libs/mysql";

import { TABLE_NAME } from "../../models/carePlan";
import { TABLE_NAME as patientTableName } from "../../models/patients";
import { TABLE_NAME as doctorTableName } from "../../models/doctors";
import { TABLE_NAME as carePlanAppointmentTableName } from "../../models/carePlanAppointments";
import { TABLE_NAME as carePlanMedicationTableName } from "../../models/carePlanMedications";
// import {TABLE_NAME as carePlanVitalTableName} from "../../models/carePlanVitals";

import { TABLE_NAME as medicationTableName } from "../../models/medicationReminders";
import { TABLE_NAME as medicineTableName } from "../../models/medicines";


class CarePlanService {
  getCarePlanByData = async data => {
    try {
      const carePlan = await Database.getModel(TABLE_NAME).findAll({
        where: data,
        include: [
          Database.getModel(patientTableName),
          Database.getModel(doctorTableName),
          Database.getModel(carePlanAppointmentTableName),
          {
            model: Database.getModel(carePlanMedicationTableName),
            include: {
              model: Database.getModel(medicationTableName),
              include: {
                model: Database.getModel(medicineTableName),
                required: true
              },
              // required: true
            }
           }
        ]
      });
      return carePlan;
    } catch (error) {
      throw error;
    }
  };

  getCarePlanById = async id => {
    try {
      const carePlan = await Database.getModel(TABLE_NAME).findOne({
        where: { id },
        include: [
          Database.getModel(patientTableName),
          Database.getModel(doctorTableName),
          Database.getModel(carePlanAppointmentTableName),
          {
           model: Database.getModel(carePlanMedicationTableName),
           include: {
             model: Database.getModel(medicationTableName),
             include: {
               model: Database.getModel(medicineTableName),
               required: true
             },
             // required: true
           }
          }
        ]
      });
      return carePlan;
    } catch (error) {
      throw error;
    }
  };

  getSingleCarePlanByData = async data => {
    try {
      const carePlan = await Database.getModel(TABLE_NAME).findOne({
        where: data,
        include: [
          Database.getModel(patientTableName),
          Database.getModel(doctorTableName),
          Database.getModel(carePlanAppointmentTableName),
          {
            model: Database.getModel(carePlanMedicationTableName),
            include: {
              model: Database.getModel(medicationTableName),
              include: {
                model: Database.getModel(medicineTableName),
                required: true
              },
              // required: true
            }
           }
        ]
      });
      return carePlan;
    } catch (error) {
      throw error;
    }
  };

  getMultipleCarePlanByData = async data => {
    try {
      const carePlan = await Database.getModel(TABLE_NAME).findAll({
        where: data,
        include: [
          Database.getModel(patientTableName),
          Database.getModel(doctorTableName),
          Database.getModel(carePlanAppointmentTableName),
          {
            model: Database.getModel(carePlanMedicationTableName),
            include: {
              model: Database.getModel(medicationTableName),
              include: {
                model: Database.getModel(medicineTableName),
                required: true
              },
              // required: true
            }
           }
          // {
          //   model: Database.getModel(carePlanVitalTableName),
          //   raw: true,
          //   attributes: ["vital_id"]
          // }
        ],
        order: [["created_at", "DESC"]]
      });
      return carePlan;
    } catch (error) {
      throw error;
    }
  };

  updateCarePlan = async (data, id) => {
    const transaction = await Database.initTransaction();
    try {
      const carePlan = await Database.getModel(TABLE_NAME).update(data, {
        where: {
          id
        },
        transaction
      });
      await transaction.commit();
      return carePlan;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  addCarePlan = async data => {
    try {
      const carePlan = await Database.getModel(TABLE_NAME).create(data);
      return carePlan;
    } catch (error) {
      throw error;
    }
  };

  getAllPatients = async (data) => {
    try {
      const carePlan = await Database.getModel(TABLE_NAME).findAll({
        where: data,
        attributes: ["patient_id"]
      });
      return carePlan;
    } catch (error) {
      throw error;
    }
  }

  getDistinctPatientCounts = async(doctorId) => {
    try {
      const carePlan = await Database.getModel(TABLE_NAME).count({
        where: {
          doctor_id: doctorId
        },
        distinct: true,
        col: 'patient_id'
      });
      return carePlan;
    } catch (error) {
      throw error;
    }
  }

  getWatchlistedDistinctPatientCounts = async(doctorId, watchlistPatientIds) => {
    try {
      const carePlan = await Database.getModel(TABLE_NAME).count({
        where: {
          doctor_id: doctorId,
          patient_id: watchlistPatientIds
        },
        distinct: true,
        col: 'patient_id'
      });
      return carePlan;
    } catch (error) {
      throw error;
    }
  }

  getPaginatedDataOfPatients = async(data) => {
    const {offset, limit, doctorId, watchlistPatientIds, watchlist, sortByName,createdAtOrder,nameOrder} = data;
    const sortBy = sortByName? `t3.first_name ${nameOrder ? "asc" : "desc" }`: `t3.created_at ${createdAtOrder ? "desc" : "asc" }`;
    // sortByName = 1 --> a-z , created_at = 1 --> latest top
    try {
      let query = "";
      if(watchlist) {
        query = `select t1.id as care_plan_id, t1.details as care_plan_details, 
        t1.created_at as care_plan_created_at, t1.expired_on as care_plan_expired_on, 
        t3.* from ${TABLE_NAME} as t1 join 
        (select MAX(created_at) as created_at,patient_id from ${TABLE_NAME}
        where patient_id in (${watchlistPatientIds}) and doctor_id=${doctorId} 
         group by patient_id) as t2
         on t1.patient_id = t2.patient_id and t1.created_at = t2.created_at
         join ${patientTableName} as t3
         on t1.patient_id = t3.id
         where t1.doctor_id = ${doctorId} and
         t1.patient_id in (${watchlistPatientIds})
         order by ${sortBy}
         limit ${limit}
         offset ${offset};`
      } else {
        query = `select t1.id as care_plan_id, t1.details as care_plan_details, 
        t1.created_at as care_plan_created_at, t1.expired_on as care_plan_expired_on, 
        t3.* from ${TABLE_NAME} as t1 join 
        (select MAX(created_at) as created_at,patient_id from ${TABLE_NAME} where doctor_id=${doctorId} group by patient_id) as t2
         on t1.patient_id = t2.patient_id and t1.created_at = t2.created_at
         join ${patientTableName} as t3
         on t1.patient_id = t3.id
         where t1.doctor_id = ${doctorId}
         order by ${sortBy}
         limit ${limit}
         offset ${offset};`
      }


      const [patients, metaData] = await Database.performRawQuery(query);

      // console.log("32746625346324364812329999123",{patients,metaData});
      
      return patients;
    } catch (err) {
      throw err;
    }
  }

  searchDiagnosisType = async(searchDisagnosisType) => {
    try {
        const intType = parseInt(searchDisagnosisType);
        const query = `SELECT id AS careplan_id , JSON_UNQUOTE(JSON_EXTRACT(details,'$.diagnosis.type')) AS  diagnosis 
        FROM adhere.care_plans
        WHERE JSON_EXTRACT(details, "$.diagnosis.type") = "${intType}";`
 

      const [careplans,metaData] = await Database.performRawQuery(query);

      
      return careplans;
    } catch (err) {
      throw err;
    }
  }

  searchDiagnosisDescription = async(seachDiagnosisText) => {
    try {
        
        const query = `SELECT id AS careplan_id , JSON_UNQUOTE(JSON_EXTRACT(details,'$.diagnosis.description')) AS  diagnosis 
        FROM adhere.care_plans
        WHERE JSON_EXTRACT(details, "$.diagnosis.description") like "%${seachDiagnosisText}%" ;`
 

      const [careplans,metaData] = await Database.performRawQuery(query);

      
      return careplans;
    } catch (err) {
      throw err;
    }
  }

  searchtreatmentIds = async(treatmentIds) => {
    try {
        const query = `SELECT id AS careplan_id , JSON_UNQUOTE(JSON_EXTRACT(details,'$.treatment_id')) AS  diagnosis 
        FROM adhere.care_plans
        WHERE JSON_EXTRACT(details, "$.treatment_id") in (${treatmentIds});`
 

      const [careplans,metaData] = await Database.performRawQuery(query);

      console.log("35732432542730078783246722 === = ==========>>>",{careplans});

      
      return careplans;
    } catch (err) {
      throw err;
    }
  }



}

export default new CarePlanService();
