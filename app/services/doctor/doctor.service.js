import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/doctors";
import { TABLE_NAME as watchlistTableName } from "../../models/doctor_patient_watchlist";
import { TABLE_NAME as specialityTableName } from "../../models/specialities";

class DoctorService {
  getDoctorByData = async data => {
    try {
      const doctor = await Database.getModel(TABLE_NAME).findOne({
        where: data,
        include: Database.getModel(specialityTableName)
      });
      return doctor;
    } catch (error) {
      throw error;
    }
  };

  getAllDoctorByData = async data => {
    try {
      const doctor = await Database.getModel(TABLE_NAME).findAll({
        where: data,
        include: Database.getModel(specialityTableName)
      });
      return doctor;
    } catch (error) {
      throw error;
    }
  };

  addDoctor = async data => {
    const transaction = await Database.initTransaction();
    try {
      const doctor = await Database.getModel(TABLE_NAME).create(data, {
        transaction
      });

      await transaction.commit();
      return doctor;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  updateDoctor = async (data, id) => {
    const transaction = await Database.initTransaction();
    try {
      const doctor = await Database.getModel(TABLE_NAME).update(data, {
        where: {
          id
        },
        transaction
      });
      await transaction.commit();
      return doctor;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  getAllDoctors = async () => {
    try {
      const doctors = await Database.getModel(TABLE_NAME).findAll({
        include: Database.getModel(specialityTableName)
      });
      return doctors;
    } catch (err) {
      throw err;
    }
  };

  createNewWatchlistRecord = async watchlist_data => {
    const transaction = await Database.initTransaction();
    try {
      const newWatchlistRecord = await Database.getModel(
        watchlistTableName
      ).create(watchlist_data, { transaction });

      await transaction.commit();
      return newWatchlistRecord;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  getAllWatchlist = async data => {
    try {
      const watchlistRecord = await Database.getModel(
        watchlistTableName
      ).findAll({
        where: data,
        raw: true
      });
      return watchlistRecord;
    } catch (error) {
      throw error;
    }
  };

  deleteWatchlistRecord = async watchlist_data => {
    const transaction = await Database.initTransaction();
    try {
      const { patient_id, doctor_id } = watchlist_data;
      const deletedWatchlistDetails = await Database.getModel(
        watchlistTableName
      ).destroy({
        where: {
          patient_id,
          doctor_id
        }
      });
      await transaction.commit();
      return deletedWatchlistDetails;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  getDoctorByUserId = async user_id => {
    try {
      const doctor = await Database.getModel(TABLE_NAME).findOne({
        where: {
          user_id
        },
        include: Database.getModel(specialityTableName)
      });
      return doctor;
    } catch (error) {
      throw error;
    }
  };
}

export default new DoctorService();
