import Database from "../../../libs/mysql";
import { Op, QueryTypes } from "sequelize";

import { TABLE_NAME } from "../../models/carePlan";
import { TABLE_NAME as patientTableName } from "../../models/patients";
import { TABLE_NAME as doctorTableName } from "../../models/doctors";
import { TABLE_NAME as carePlanAppointmentTableName } from "../../models/carePlanAppointments";
import { TABLE_NAME as carePlanMedicationTableName } from "../../models/carePlanMedications";
import { TABLE_NAME as medicationTableName } from "../../models/medicationReminders";
import { TABLE_NAME as medicineTableName } from "../../models/medicines";
import { TABLE_NAME as userRolesTableName } from "../../models/userRoles";
import { TABLE_NAME as carePlanSecondaryDoctorMappingsTableName } from "../../models/carePlanSecondaryDoctorMappings";

const DEFAULT_ORDER = [["created_at", "DESC"]];

class CarePlanService {
  async getAll() {
    try {
      const carePlans = await Database.getModel(TABLE_NAME).findAll();
      return carePlans;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  getCarePlanByData = async (data) => {
    console.log("Get Care Plan by Data, has data: ", data);
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
      throw "Get Care Plan by Data, has an error: " + error;
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

  /**
   * This function, getCarePlanById, is designed to retrieve a care plan from a database by its unique identifier (id).
   * The function uses Database.getModel(TABLE_NAME).findOne() to query the database.
   * This query searches for a record in the specified table (TABLE_NAME) where the id matches the provided id.
   *
   * The value of carePlan will be an object representing the care plan record found in the database,
   * along with the related data from the included tables.
   * The structure of this object will include fields from the main table (TABLE_NAME) and nested objects
   * representing the related data from the included tables.
   *
   * @param id
   * @returns {Promise<*>}
   */
  getCarePlanById = async (id) => {
    console.log("Get CarePlan by ID, for ID: ", id);
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
              // TODO: What do we need to do here?
              // required: true
            },
          },
          {
            model: Database.getModel(carePlanSecondaryDoctorMappingsTableName),
            required: false,
          },
        ],
      });
      console.log(
        "getCarePlanById with CarePlan of Secondary Doctor Mapping: \n"
      );
      console.log(carePlan.careplan_secondary_doctor_mappings);
      return carePlan;
    } catch (error) {
      throw "Get Care Plan by ID for Secondary Doctor: " + error;
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
          // TODO: The Vitals has been removed from the Care Plan. Need to check if it will be added later
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
    carePlanIdsAsSecondaryDoctor = []
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
                [Op.in]: carePlanIdsAsSecondaryDoctor,
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
    carePlanIdsAsSecondaryDoctor = []
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
                [Op.in]: carePlanIdsAsSecondaryDoctor,
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
        query = `
                    SELECT t1.id         AS care_plan_id,
                           t1.details    AS care_plan_details,
                           t1.created_at AS care_plan_created_at,
                           t1.expired_on AS care_plan_expired_on,
                           t3.*
                    FROM ${TABLE_NAME} AS t1
                             JOIN (SELECT MAX(created_at) AS created_at,
                                          patient_id
                                   FROM ${TABLE_NAME}
                                   WHERE patient_id IN (${watchlistPatientIds})
                                     AND (user_role_id = ${userRoleId} OR id IN (${
          secondary_careplan_ids ? secondary_careplan_ids : null
        }))
                                   GROUP BY patient_id) AS t2
                                  ON t1.patient_id = t2.patient_id AND t1.created_at = t2.created_at
                             JOIN
                         ${patientTableName} AS t3 ON t1.patient_id = t3.id
                    WHERE t1.patient_id IN (${watchlistPatientIds})
                      AND (t1.user_role_id = ${userRoleId} OR t1.id IN (${
          secondary_careplan_ids ? secondary_careplan_ids : null
        }))
                    ORDER BY ${sortBy} LIMIT ${limit}
                    OFFSET ${offset};
                `;
      } else {
        query = `
                    SELECT t1.id         AS care_plan_id,
                           t1.details    AS care_plan_details,
                           t1.created_at AS care_plan_created_at,
                           t1.expired_on AS care_plan_expired_on,
                           t3.*
                    FROM ${TABLE_NAME} AS t1
                             JOIN (SELECT MAX(created_at) AS created_at,
                                          patient_id
                                   FROM ${TABLE_NAME}
                                   WHERE (user_role_id = ${userRoleId} OR id IN (${
          secondary_careplan_ids ? secondary_careplan_ids : null
        }))
                                   GROUP BY patient_id) AS t2
                                  ON t1.patient_id = t2.patient_id AND t1.created_at = t2.created_at
                             JOIN
                         ${patientTableName} AS t3 ON t1.patient_id = t3.id
                    WHERE (t1.doctor_id = ${doctorId} AND t1.user_role_id = ${userRoleId})
                       OR t1.id IN (${
                         secondary_careplan_ids ? secondary_careplan_ids : null
                       })
                    ORDER BY ${sortBy} LIMIT ${limit}
                    OFFSET ${offset};
                `;
      }

      const [patients, metaData] = await Database.performRawQuery(query);
      console.log("Patients Metadata, Get Paginated data of Patients: \n", {
        patients,
        metaData,
      });
      return patients;
    } catch (err) {
      throw err;
    }
  };

  searchDiagnosisType = async (searchDiagnosisType) => {
    try {
      const intType = parseInt(searchDiagnosisType);
      const query = `SELECT id                                                      AS careplan_id,
                                  JSON_UNQUOTE(JSON_EXTRACT(details, '$.diagnosis.type')) AS diagnosis
                           FROM adhere.care_plans
                           WHERE JSON_EXTRACT(details, "$.diagnosis.type") = "${intType}";`;

      const [carePlans, metaData] = await Database.performRawQuery(query);
      console.log("Patients Metadata, Get Paginated data of Patients: \n", {
        metaData,
      });
      return carePlans;
    } catch (err) {
      throw err;
    }
  };

  searchDiagnosisDescription = async (seachDiagnosisText) => {
    try {
      const query = `SELECT id                                                             AS careplan_id,
                                  JSON_UNQUOTE(JSON_EXTRACT(details, '$.diagnosis.description')) AS diagnosis
                           FROM adhere.care_plans
                           WHERE JSON_EXTRACT(details, "$.diagnosis.description") like "%${seachDiagnosisText}%";`;

      const [carePlans, metaData] = await Database.performRawQuery(query);
      console.log("Patients Metadata, Get Paginated data of Patients: \n", {
        metaData,
      });
      return carePlans;
    } catch (err) {
      throw err;
    }
  };

  searchTreatmentIds = async (treatmentIds) => {
    try {
      const query = `SELECT id AS careplan_id, JSON_UNQUOTE(JSON_EXTRACT(details, '$.treatment_id')) AS diagnosis
                           FROM adhere.care_plans
                           WHERE JSON_EXTRACT(details, "$.treatment_id") in (${treatmentIds});`;

      const [carePlans, metaData] = await Database.performRawQuery(query);
      console.log("Patients Metadata, Get Paginated data of Patients: \n", {
        metaData,
      });
      console.log("Patient Care Plans: ", { carePlans });

      return carePlans;
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
            SELECT carePlan.id           AS care_plan_id,
                   carePlan.details      AS care_plan_details,
                   carePlan.created_at   AS care_plan_created_at,
                   carePlan.expired_on   AS care_plan_expired_on,
                   carePlan.activated_on AS care_plan_activated_on,
                   carePlan.user_role_id AS care_plan_user_role_id,
                   patient.*
            FROM ${TABLE_NAME} AS carePlan
                     JOIN
                 (SELECT MAX(created_at) AS created_at, patient_id
                  from ${TABLE_NAME}
                  WHERE (user_role_id = ${user_role_id} OR id in (${
      secondary_careplan_ids ? secondary_careplan_ids : null
    }))
                  GROUP BY patient_id)
                     AS carePlan2
                 ON carePlan.patient_id = carePlan2.patient_id AND carePlan.created_at = carePlan2.created_at
                     JOIN ${patientTableName} as patient ON carePlan.patient_id = patient.id
            WHERE ${finalFilter} ${watchlist}
            ORDER BY ${finalOrder}
                LIMIT ${limit}
            OFFSET ${offset};`;

    const countQuery = `
            SELECT carePlan.id           AS care_plan_id,
                   carePlan.details      AS care_plan_details,
                   carePlan.created_at   AS care_plan_created_at,
                   carePlan.expired_on   AS care_plan_expired_on,
                   carePlan.activated_on AS care_plan_activated_on,
                   patient.*
            FROM ${TABLE_NAME} AS carePlan
                     JOIN
                 (SELECT MAX(created_at) AS created_at, patient_id
                  from ${TABLE_NAME}
                  WHERE (user_role_id = ${user_role_id} OR id in (${
      secondary_careplan_ids ? secondary_careplan_ids : null
    }))
                  GROUP BY patient_id)
                     AS carePlan2
                 ON carePlan.patient_id = carePlan2.patient_id AND carePlan.created_at = carePlan2.created_at
                     JOIN ${patientTableName} as patient ON carePlan.patient_id = patient.id
            WHERE ${finalFilter} ${watchlist}
            ORDER BY ${finalOrder};
        `;

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

      // console.log("carePlanCount inside getPaginatedPatients: ", carePlanCount);
      return [carePlanCount.length, carePlans];

      // TODO: Why is this code here?
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
