import Database from "../../../libs/mysql";
import { QueryTypes } from "sequelize";
import { Op } from "sequelize";

import { TABLE_NAME } from "../../models/carePlan";
import { TABLE_NAME as patientTableName } from "../../models/patients";
import { TABLE_NAME as doctorTableName } from "../../models/doctors";
import { TABLE_NAME as carePlanAppointmentTableName } from "../../models/carePlanAppointments";
import { TABLE_NAME as carePlanMedicationTableName } from "../../models/carePlanMedications";
// import { TABLE_NAME as userRoleTableName } from "../../models/userRoles";
// import {TABLE_NAME as carePlanVitalTableName} from "../../models/carePlanVitals";

import { TABLE_NAME as medicationTableName } from "../../models/medicationReminders";
import { TABLE_NAME as medicineTableName } from "../../models/medicines";
import { TABLE_NAME as userRolesTableName } from "../../models/userRoles";
import { TABLE_NAME as carePlanSecondaryDoctorMappingsTableName } from "../../models/carePlanSecondaryDoctorMappings";
import { USER_CATEGORY } from "../../../constant";

const DEFAULT_ORDER = [["created_at", "DESC"]];

class CarePlanService {
  async getAll() {
    try {
      const careplans = await Database.getModel(TABLE_NAME).findAll();
      return careplans;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  getCarePlanByData = async (data) => {
    try {
      const { user_role_id = null, ...rest } = data || {};

      let secondaryDoctorQuery = [];
      if (user_role_id) {
        secondaryDoctorQuery.push(
          {
            "$careplan_secondary_doctor_mappings.secondary_doctor_role_id$":
              user_role_id,
          },
          {
            user_role_id,
          }
        );
      }

      const carePlan = await Database.getModel(TABLE_NAME).findAll({
        where: {
          [Op.or]: [
            {
              ...rest,
            },
            ...secondaryDoctorQuery,
          ],
        },
        include: [
          Database.getModel(patientTableName),
          Database.getModel(doctorTableName),
          Database.getModel(carePlanAppointmentTableName),
          Database.getModel(userRolesTableName),
          {
            model: Database.getModel(carePlanMedicationTableName),
            include: {
              model: Database.getModel(medicationTableName),
              include: {
                model: Database.getModel(medicineTableName),
                required: true,
              },
              // required: true
            },
          },
          {
            model: Database.getModel(carePlanSecondaryDoctorMappingsTableName),
            required: false,
          },
        ],
      });
      return carePlan;
    } catch (error) {
      throw error;
    }
  };

  getOnlyCarePlanByData = async (data) => {
    try {
      const { user_role_id = null, ...rest } = data || {};

      const carePlan = await Database.getModel(TABLE_NAME).findAll({
        where: data,
      });
      return carePlan;
    } catch (error) {
      throw error;
    }
  };

  getCarePlanById = async (id) => {
    try {
      const carePlan = await Database.getModel(TABLE_NAME).findOne({
        where: { id },
        include: [
          Database.getModel(patientTableName),
          Database.getModel(doctorTableName),
          Database.getModel(carePlanAppointmentTableName),
          Database.getModel(userRolesTableName),
          {
            model: Database.getModel(carePlanMedicationTableName),
            include: {
              model: Database.getModel(medicationTableName),
              include: {
                model: Database.getModel(medicineTableName),
                required: true,
              },
              // required: true
            },
          },
          {
            model: Database.getModel(carePlanSecondaryDoctorMappingsTableName),
            required: false,
          },
        ],
      });
      console.log("\n\n getCarePlanById with Secondary Doctor \n");
      console.log(carePlan.careplan_secondary_doctor_mappings);
      console.log("\n\n");
      return carePlan;
    } catch (error) {
      throw error;
    }
  };

  getSingleCarePlanByData = async (data, order = [["created_at", "ASC"]]) => {
    try {
      const carePlan = await Database.getModel(TABLE_NAME).findOne({
        where: data,
        include: [
          Database.getModel(patientTableName),
          Database.getModel(doctorTableName),
          Database.getModel(carePlanAppointmentTableName),
          Database.getModel(userRolesTableName),
          {
            model: Database.getModel(carePlanMedicationTableName),
            include: {
              model: Database.getModel(medicationTableName),
              include: {
                model: Database.getModel(medicineTableName),
                required: true,
              },
              // required: true
            },
          },
          {
            model: Database.getModel(carePlanSecondaryDoctorMappingsTableName),
            required: false,
          },
        ],
        order,
      });
      return carePlan;
    } catch (error) {
      throw error;
    }
  };

  getMultipleCarePlanByData = async (data) => {
    try {
      const { user_role_id = null, ...rest } = data || {};

      let secondaryDoctorQuery = [];
      if (user_role_id) {
        secondaryDoctorQuery.push(
          {
            "$careplan_secondary_doctor_mappings.secondary_doctor_role_id$":
              user_role_id,
          },
          {
            user_role_id,
          }
        );
      }
      console.log(rest);

      const carePlan = await Database.getModel(TABLE_NAME).findAll({
        where: {
          [Op.or]: [
            {
              ...rest,
            },
            // ...secondaryDoctorQuery,
          ],
        },
        include: [
          Database.getModel(patientTableName),
          Database.getModel(doctorTableName),
          Database.getModel(carePlanAppointmentTableName),
          Database.getModel(userRolesTableName),
          {
            model: Database.getModel(carePlanMedicationTableName),
            include: {
              model: Database.getModel(medicationTableName),
              include: {
                model: Database.getModel(medicineTableName),
                required: true,
              },
              // required: true
            },
          },
          {
            model: Database.getModel(carePlanSecondaryDoctorMappingsTableName),
            required: false,
          },
          // {
          //   model: Database.getModel(carePlanVitalTableName),
          //   raw: true,
          //   attributes: ["vital_id"]
          // }
        ],
        order: [["created_at", "DESC"]],
      });
      return carePlan;
    } catch (error) {
      throw error;
    }
  };

  updateCarePlan = async (data, id) => {
    console.log("update care plan called", { data, id });
    const transaction = await Database.initTransaction();
    try {
      const carePlan = await Database.getModel(TABLE_NAME).update(data, {
        where: {
          id,
        },
        transaction,
      });
      await transaction.commit();
      return carePlan;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  addCarePlan = async (data) => {
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
        attributes: ["patient_id"],
      });
      return carePlan;
    } catch (error) {
      throw error;
    }
  };

  getAllDoctors = async (data) => {
    try {
      const carePlan = await Database.getModel(TABLE_NAME).findAll({
        where: data,
        attributes: ["doctor_id"],
      });
      return carePlan;
    } catch (error) {
      throw error;
    }
  };

  getDistinctPatientCounts = async (
    userRoleId,
    careplanIdsAsSecondaryDoctor = []
  ) => {
    try {
      const carePlan = await Database.getModel(TABLE_NAME).count({
        where: {
          [Op.or]: [
            {
              user_role_id: userRoleId,
            },
            {
              id: {
                [Op.in]: careplanIdsAsSecondaryDoctor,
              },
            },
          ],
        },
        distinct: true,
        col: "patient_id",
      });
      return carePlan;
    } catch (error) {
      throw error;
    }
  };

  getWatchlistedDistinctPatientCounts = async (
    watchlistPatientIds,
    userRoleId,
    careplanIdsAsSecondaryDoctor = []
  ) => {
    try {
      const carePlan = await Database.getModel(TABLE_NAME).count({
        where: {
          patient_id: watchlistPatientIds,
          [Op.or]: [
            {
              user_role_id: userRoleId,
            },
            {
              id: {
                [Op.in]: careplanIdsAsSecondaryDoctor,
              },
            },
          ],
        },
        distinct: true,
        col: "patient_id",
      });
      return carePlan;
    } catch (error) {
      throw error;
    }
  };

  getPaginatedDataOfPatients = async (data) => {
    const {
      offset,
      limit,
      doctorId,
      watchlistPatientIds,
      watchlist,
      sortByName,
      createdAtOrder,
      nameOrder,
      userRoleId,
      secondary_careplan_ids = null,
    } = data;
    const sortBy = sortByName
      ? `t3.first_name ${nameOrder ? "desc" : "asc"}`
      : `t3.created_at ${createdAtOrder ? "desc" : "asc"}`;
    // sortByName = 1 --> a-z , created_at = 1 --> latest top
    try {
      let query = "";
      if (watchlist) {
        query = `select t1.id as care_plan_id, t1.details as care_plan_details, 
        t1.created_at as care_plan_created_at, t1.expired_on as care_plan_expired_on, 
        t3.* from ${TABLE_NAME} as t1 join 
        (select MAX(created_at) as created_at,patient_id from ${TABLE_NAME}
        where patient_id in (${watchlistPatientIds}) and ( user_role_id=${userRoleId} OR id in ( ${
          secondary_careplan_ids ? secondary_careplan_ids : null
        } ) ) 
         group by patient_id) as t2
         on t1.patient_id = t2.patient_id and t1.created_at = t2.created_at
         join ${patientTableName} as t3
         on t1.patient_id = t3.id
         where 
         t1.patient_id in (${watchlistPatientIds}) and
         (t1.user_role_id = ${userRoleId} OR t1.id in (${
          secondary_careplan_ids ? secondary_careplan_ids : null
        }) )
         order by ${sortBy}
         limit ${limit}
         offset ${offset};`;
      } else {
        query = `select t1.id as care_plan_id, t1.details as care_plan_details, 
        t1.created_at as care_plan_created_at, t1.expired_on as care_plan_expired_on, 
        t3.* from ${TABLE_NAME} as t1 join 
        (select MAX(created_at) as created_at,patient_id from ${TABLE_NAME} where ( user_role_id=${userRoleId} OR id in ( ${
          secondary_careplan_ids ? secondary_careplan_ids : null
        } ) ) group by patient_id) as t2
         on t1.patient_id = t2.patient_id and t1.created_at = t2.created_at
         join ${patientTableName} as t3
         on t1.patient_id = t3.id
         where (t1.doctor_id = ${doctorId} and  t1.user_role_id = ${userRoleId}) OR t1.id in ( ${
          secondary_careplan_ids ? secondary_careplan_ids : null
        } )
         order by ${sortBy}
         limit ${limit}
         offset ${offset};`;
      }

      const [patients, metaData] = await Database.performRawQuery(query);

      // console.log("32746625346324364812329999123",{patients,metaData});

      return patients;
    } catch (err) {
      throw err;
    }
  };

  searchDiagnosisType = async (searchDisagnosisType) => {
    try {
      const intType = parseInt(searchDisagnosisType);
      const query = `SELECT id AS careplan_id , JSON_UNQUOTE(JSON_EXTRACT(details,'$.diagnosis.type')) AS  diagnosis 
        FROM adhere.care_plans
        WHERE JSON_EXTRACT(details, "$.diagnosis.type") = "${intType}";`;

      const [careplans, metaData] = await Database.performRawQuery(query);

      return careplans;
    } catch (err) {
      throw err;
    }
  };

  searchDiagnosisDescription = async (seachDiagnosisText) => {
    try {
      const query = `SELECT id AS careplan_id , JSON_UNQUOTE(JSON_EXTRACT(details,'$.diagnosis.description')) AS  diagnosis 
        FROM adhere.care_plans
        WHERE JSON_EXTRACT(details, "$.diagnosis.description") like "%${seachDiagnosisText}%" ;`;

      const [careplans, metaData] = await Database.performRawQuery(query);

      return careplans;
    } catch (err) {
      throw err;
    }
  };

  searchtreatmentIds = async (treatmentIds) => {
    try {
      const query = `SELECT id AS careplan_id , JSON_UNQUOTE(JSON_EXTRACT(details,'$.treatment_id')) AS  diagnosis 
        FROM adhere.care_plans
        WHERE JSON_EXTRACT(details, "$.treatment_id") in (${treatmentIds});`;

      const [careplans, metaData] = await Database.performRawQuery(query);

      console.log("35732432542730078783246722 === = ==========>>>", {
        careplans,
      });

      return careplans;
    } catch (err) {
      throw err;
    }
  };

  getPaginatedPatients = async ({
    doctor_id,
    order,
    filter,
    offset,
    limit,
    watchlist,
    user_role_id,
    secondary_careplan_ids = null,
  }) => {
    // const patientWatchlistedIds = watchlistPatientIds.length ? watchlistPatientIds.toString() : null ;

    // console.log("7456278467234627429384221",{offset,limit,watchlistPatientIds,patientWatchlistedIds});

    let finalFilter = filter
      ? `${filter} AND carePlan.user_role_id = ${user_role_id}`
      : `carePlan.user_role_id = ${user_role_id}`;

    if (secondary_careplan_ids && secondary_careplan_ids.length) {
      finalFilter = filter
        ? `${filter} AND (carePlan.user_role_id = ${user_role_id} OR carePlan.id in (${secondary_careplan_ids}) )`
        : `carePlan.user_role_id = ${user_role_id} OR carePlan.id in (${secondary_careplan_ids})  `;
    }

    const finalOrder = order ? order : `patient.created_at DESC`;
    let query = "";

    query = `
    SELECT  carePlan.id AS care_plan_id, carePlan.details AS care_plan_details, carePlan.created_at AS care_plan_created_at,
      carePlan.expired_on AS care_plan_expired_on, carePlan.activated_on AS care_plan_activated_on, carePlan.user_role_id AS care_plan_user_role_id ,   patient.* FROM ${TABLE_NAME} AS carePlan
      JOIN 
        (SELECT MAX(created_at) AS created_at, patient_id from ${TABLE_NAME} WHERE ( user_role_id=${user_role_id} OR id in (${
      secondary_careplan_ids ? secondary_careplan_ids : null
    }) ) GROUP BY patient_id)
      AS carePlan2 ON carePlan.patient_id = carePlan2.patient_id AND carePlan.created_at = carePlan2.created_at
      JOIN ${patientTableName} as patient ON carePlan.patient_id = patient.id
        WHERE ${finalFilter} ${watchlist}
      ORDER BY ${finalOrder}
      LIMIT ${limit}
      OFFSET ${offset};`;

    const countQuery = `
    SELECT carePlan.id AS care_plan_id, carePlan.details AS care_plan_details, carePlan.created_at AS care_plan_created_at,
      carePlan.expired_on AS care_plan_expired_on, carePlan.activated_on AS care_plan_activated_on, patient.* FROM ${TABLE_NAME} AS carePlan
      JOIN 
        (SELECT MAX(created_at) AS created_at, patient_id from ${TABLE_NAME} WHERE ( user_role_id=${user_role_id} OR id in (${
      secondary_careplan_ids ? secondary_careplan_ids : null
    }) ) GROUP BY patient_id)
      AS carePlan2 ON carePlan.patient_id = carePlan2.patient_id AND carePlan.created_at = carePlan2.created_at
      JOIN ${patientTableName} as patient ON carePlan.patient_id = patient.id
        WHERE ${finalFilter} ${watchlist}
      ORDER BY ${finalOrder};
      `;
    // }

    try {
      const carePlans = await Database.performRawQuery(query, {
        raw: true,
        type: QueryTypes.SELECT,
      });

      const carePlanCount =
        (await Database.performRawQuery(countQuery, {
          raw: true,
          type: QueryTypes.SELECT,
        })) || [];

      // console.log("910238102 carePlanCount", carePlanCount);
      return [carePlanCount.length, carePlans];

      // return carePlans;
      // return await Database.getModel(TABLE_NAME).findAll({
      //   where: {
      //     doctor_id
      //   },
      //     include: [
      //       {
      //         model: Database.getModel(patientTableName),
      //         where: ""
      //       },
      //     ],
      //     order: [["first_name", "ASC"]],
      //     raw: true,
      //   });
    } catch (error) {
      throw error;
    }
  };

  findAndCountAll = async ({
    where,
    order = DEFAULT_ORDER,
    attributes,
    userRoleId,
  }) => {
    try {
      return await Database.getModel(TABLE_NAME).findAndCountAll({
        where: {
          [Op.or]: [
            {
              ...where,
            },
            {
              "$careplan_secondary_doctor_mappings.secondary_doctor_role_id$":
                userRoleId,
            },
          ],
        },
        include: [
          Database.getModel(patientTableName),
          Database.getModel(doctorTableName),
          Database.getModel(carePlanAppointmentTableName),
          Database.getModel(userRolesTableName),
          {
            model: Database.getModel(carePlanMedicationTableName),
            include: {
              model: Database.getModel(medicationTableName),
              include: {
                model: Database.getModel(medicineTableName),
                required: true,
              },
              // required: true
            },
          },
          {
            model: Database.getModel(carePlanSecondaryDoctorMappingsTableName),
            required: false,
          },
          // {
          //   model: Database.getModel(carePlanVitalTableName),
          //   raw: true,
          //   attributes: ["vital_id"]
          // }
        ],
        order,
        attributes,
        raw: true,
      });
    } catch (error) {
      throw error;
    }
  };
}

export default new CarePlanService();
