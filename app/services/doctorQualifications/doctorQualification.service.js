import doctorQualificationModel from "../../models/doctorQualifications";
import { defaultEventBridgePolicies } from "twilio/lib/jwt/taskrouter/util";

class DoctorQualificationService {
    constructor() {}

    addQualification = async data => {
      try {
        
          const doctorQualification = await doctorQualificationModel.create(data);
          return doctorQualification;
      } catch(error) {
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
        try {
            const doctorQualification = await doctorQualificationModel.update(data,{
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