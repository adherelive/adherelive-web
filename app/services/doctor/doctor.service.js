import Database from "../../../libs/mysql";
import {TABLE_NAME} from "../../models/doctors";
import {TABLE_NAME as specialityTableName} from "../../models/specialities";

class DoctorService {

    getDoctorByData = async (data) => {
        try {
            const doctor = await Database.getModel(TABLE_NAME).findOne({
                where: data,
                include: Database.getModel(specialityTableName)
            });
            return doctor;
        } catch(error) {
            throw error;
        }
    }

    addDoctor = async data => {
        const transaction = await Database.initTransaction();
        try {
            const doctor = await Database.getModel(TABLE_NAME).create(data, { transaction });

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
        } catch(err) {
            throw err;
        }
    };
}

export default new DoctorService();