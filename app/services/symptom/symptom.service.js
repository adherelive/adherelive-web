import { Op } from "sequelize";
import Database from "../../../libs/mysql";
import moment from "moment";

import { TABLE_NAME } from "../../models/symptoms";
import { TABLE_NAME as doctorTableName } from "../../models/doctors";
import { TABLE_NAME as patientTableName } from "../../models/patients";
import { TABLE_NAME as carePlanTableName } from "../../models/carePlan";

import { createLogger } from "../../../libs/log";
const logger = createLogger("WEB > SYMPTOM > SERVICE");

class SymptomService {
  // Create a new symptom record
  create = async (data) => {
    try {
      const symptom = await Database.getModel(TABLE_NAME).create(data);
      return symptom; // Return the created symptom
    } catch (error) {
      logger.error("Error creating symptom:", error); // Log the error for debugging
      throw new Error("Unable to create symptom. Please try again later."); // Throw a user-friendly error
    }
  };

  // Retrieve a symptom based on criteria
  getByData = async (data) => {
    try {
      const symptom = await Database.getModel(TABLE_NAME).findOne({
        where: data,
        include: [
          {
            model: Database.getModel(patientTableName),
          },
          {
            model: Database.getModel(carePlanTableName),
            include: [Database.getModel(doctorTableName)],
          },
        ],
      });
      return symptom; // Return the found symptom
    } catch (error) {
      logger.error("Error fetching symptom by data:", error); // Log the error
      throw new Error(
        "Unable to fetch symptom details. Please check your input."
      ); // User-friendly error
    }
  };

  // Count symptoms created in the last 7 days
  getCount = async (data) => {
    try {
      return await Database.getModel(TABLE_NAME).count({
        where: {
          ...data,
          created_at: {
            [Op.between]: [
              moment().utc().subtract(7, "days").toISOString(),
              moment().utc().toISOString(),
            ],
          },
        },
      });
    } catch (error) {
      logger.error("Error counting symptoms:", error); // Log the error
      throw new Error("Unable to count symptoms. Please try again later."); // User-friendly error
    }
  };

  // Retrieve all symptoms based on criteria
  getAllByData = async (data) => {
    try {
      const symptoms = await Database.getModel(TABLE_NAME).findAll({
        where: data,
        include: [
          {
            model: Database.getModel(patientTableName),
          },
          {
            model: Database.getModel(carePlanTableName),
            include: [Database.getModel(doctorTableName)],
          },
        ],
      });
      return symptoms; // Return the found symptoms
    } catch (error) {
      logger.error("Error fetching all symptoms:", error); // Log the error
      throw new Error(
        "Unable to retrieve symptoms. Please check your criteria."
      ); // User-friendly error
    }
  };

  // Retrieve symptoms for a specific patient within a time range
  getFilteredData = async (data) => {
    try {
      const { patient_id, start_time, end_time } = data || {};
      const symptom = await Database.getModel(TABLE_NAME).findAll({
        where: {
          patient_id,
          created_at: {
            [Op.between]: [start_time, end_time],
          },
        },
        include: [
          {
            model: Database.getModel(patientTableName),
          },
          {
            model: Database.getModel(carePlanTableName),
            include: [Database.getModel(doctorTableName)],
          },
        ],
      });
      return symptom; // Return the found symptoms
    } catch (error) {
      logger.error("Error fetching filtered symptoms:", error); // Log the error
      throw new Error("Unable to filter symptoms. Please check your input."); // User-friendly error
    }
  };

  // Retrieve the most recently updated symptom
  getLastUpdatedData = async (data) => {
    try {
      const symptom = await Database.getModel(TABLE_NAME).findAll({
        where: data,
        limit: 1,
        order: [["updated_at", "DESC"]],
        include: [
          {
            model: Database.getModel(patientTableName),
          },
          {
            model: Database.getModel(carePlanTableName),
            include: [Database.getModel(doctorTableName)],
          },
        ],
      });
      return symptom; // Return the most recently updated symptom
    } catch (error) {
      logger.error("Error fetching last updated symptom:", error); // Log the error
      throw new Error(
        "Unable to retrieve the last updated symptom. Please try again later."
      ); // User-friendly error
    }
  };
}

export default new SymptomService();
