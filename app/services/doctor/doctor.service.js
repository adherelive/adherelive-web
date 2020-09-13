import Doctor from "../../models/doctors";
import {database} from "../../../libs/mysql";
import Specialities from "../../models/specialities";

class DoctorService {

    getDoctorByData = async (data) => {
        try {
            const doctor = await Doctor.findOne({
                where: data,
                include: Specialities
            });
            return doctor;
        } catch(error) {
            throw error;
        }
    }

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

    getAllDoctors = async () => {
        try {
            const doctors = await Doctor.findAll({
                include: Specialities
            });
            return doctors;
        } catch(err) {
            throw err;
        }
    };
}

export default new DoctorService();