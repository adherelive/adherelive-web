import database from "../../../libs/mysql";

const {doctor_qualifications: doctorQualificationModel} = database.models;

class DoctorQualificationService {
    constructor() {}

    addQualification = async data => {
        const transaction = await database.transaction();
      try {
          console.log("data --> ", data);
          const doctorQualification = await doctorQualificationModel.create(data, {transaction});
          await transaction.commit();
          return doctorQualification;
      } catch(error) {
          console.log("error --> ", error);
          await transaction.rollback();
          throw error;
      }
    };

    getQualificationsByDoctorId = async doctor_id => {
        try {
            const doctorQualification = await doctorQualificationModel.findAll({
                where: {
                    doctor_id,
                    deleted_at:null
                }
            });
            return doctorQualification;
        } catch(error) {
            throw error;
        }
    };


    getQualificationById = async id => {
        try {
            const doctorQualification = await doctorQualificationModel.findOne({
                where: {
                    id,
                    deleted_at:null
                }
            });
            return doctorQualification;
        } catch(error) {
            throw error;
        }
    };

    updateQualification = async (data,id) => {
        const transaction = await database.transaction();
        try {
            const doctorQualification = await doctorQualificationModel.update(data,{
                where: {
                    id,
                    deleted_at:null
                },
                transaction
            });
            await transaction.commit();
            return doctorQualification;
        } catch(error) {
            await transaction.rollback();
            throw error;
        }
    };

    getQualificationsByDoctorId = async doctor_id => {
        try {
            const doctorQualification = await doctorQualificationModel.findAll({
                where: {
                    doctor_id,
                    deleted_at:null
                }
            });
            return doctorQualification;
        } catch(error) {
            throw error;
        }
    };

    getQualificationByData = async (doctor_id,degree,college,year)=> {
        try {
            const doctorQualification = await doctorQualificationModel.findOne({
                where: {
                    doctor_id,
                    degree,
                    college,
                    year,
                    deleted_at:null
                }
            });
            return doctorQualification;
        } catch(error) {
            throw error;
        }
    };

   
}

export default new DoctorQualificationService();