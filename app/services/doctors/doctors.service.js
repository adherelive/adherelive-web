import database from "../../../libs/mysql";

const {doctors: Doctor, speciality: Speciality} = database.models;

class DoctorsService {
  constructor() {}

  addDoctor = async data => {
    const transaction = await database.transaction();
    try {
      const doctor = await Doctor.create(data, { transaction });

      await transaction.commit();
      return doctor;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  getDoctorByUserId = async user_id => {
    try {
      const doctor = await Doctor.findOne({
        where: {
          user_id,
        },
        include: Speciality
      });
      return doctor;
    } catch (error) {
      throw error;
    }
  };

  updateDoctor = async (data, id) => {
    const transaction = await database.transaction();
    try {
      const doctor = await Doctor.update(data, {
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

  getDoctorByData = async data => {
    try {
      console.log("DATA --> ", data);
      const doctor = await Doctor.findAll({
        where: data
      });
      console.log("DOCTOR ----> ", doctor);
      return doctor;
    } catch (error) {
      throw error;
    }
  };
}

export default new DoctorsService();
