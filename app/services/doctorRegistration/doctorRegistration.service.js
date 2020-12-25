import Database from "../../../libs/mysql";
import {TABLE_NAME} from "../../models/doctorRegistrations";

class DoctorRegistrationService {
    constructor() {}

    addRegistration = async data => {
        try {

            const doctorRegistration = await Database.getModel(TABLE_NAME).create(data);
            return doctorRegistration;
        } catch(error) {
            throw error;
        }
    };

    getRegistrationByDoctorId = async doctor_id => {
        try {
            const doctorRegistration = await Database.getModel(TABLE_NAME).findAll({
                where: {
                    doctor_id,
                    deleted_at:null
                }
            });
            return doctorRegistration;
        } catch(error) {
            throw error;
        }
    };


    getRegistrationById = async id => {
        try {
            const doctorRegistration = await Database.getModel(TABLE_NAME).findOne({
                where: {
                    id,
                    deleted_at:null
                }
            });
            return doctorRegistration;
        } catch(error) {
            throw error;
        }
    };

    updateRegistration = async (data,id) => {
        try {
            const doctorRegistration = await Database.getModel(TABLE_NAME).update(data,{
                where: {
                    id,
                    deleted_at:null
                }
            });
            return doctorRegistration;
        } catch(error) {
            throw error;
        }
    };

    getRegistrationByData = async (number,council,year,expiry_date)=> {
        try {
            const doctorRegistration = await Database.getModel(TABLE_NAME).findOne({
                where: {
                    number,
                    council,
                    expiry_date,
                    year,
                    deleted_at:null
                }
            });
            return doctorRegistration;
        } catch(error) {
            throw error;
        }
    };


}

export default new DoctorRegistrationService();