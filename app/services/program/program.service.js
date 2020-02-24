const _ = require("lodash");
const programModel = require("../../models/program");
const userModel = require("../../models/user");
const hospitalService = require("../hospital/hospital.service");

const NAME = "Name";
const LOCATION = "Location";
const DATEADDED = "DateAdded";
const ALL = "All";
const ENROLLED = "Enrolled";
const INACTIVE = "Inactive";
const DISCHARGED = "Discharged";
const SURVEY_SENT_DATE = "Survey Sent Date";

class ProgramService {
  constructor() {}

  async addProgram(data) {
    try {
      let program = await programModel.create(data);
      return program;
    } catch (err) {
      throw err;
    }
  }

  async getProgram(data) {
    try {
      let program = await programModel.findOne(data);
      return program;
    } catch (err) {
      throw err;
    }
  }

  async getPrograms(data) {
    try {
      let program = await programModel.find(data).lean();
      return program;
    } catch (err) {
      throw err;
    }
  }

  async getProgramsById(programId) {
    try {
      if (programId.length > 0) {
        const programs = await programModel
          .find({ _id: { $in: programId } })
          .lean();
        return programs;
      }
    } catch (err) {
      throw err;
    }
  }

  async getProgramProducts(programId) {
    try {
      if (programId.length > 0) {
        const programs = await programModel.find(
          { _id: { $in: programId } },
          { products: 1 }
        );
        return programs;
      }
    } catch (err) {
      throw err;
    }
  }

  async getProgramDoctors(programId) {
    try {
      let doctors = await userModel.find({
        category: "doctor",
        programId: programId
      });
      return doctors;
    } catch (err) {
      throw err;
    }
  }

  async getProgramDoctorsData(programId) {
    try {
      const doctors = await programModel
        .find({ _id: programId }, { doctors: 1 })
        .lean();
      return doctors;
    } catch (err) {
      throw err;
    }
  }

  async getProgramPatients(programId, filterBy, sortBy) {
    try {
      // let patients = await userModel.find({
      //   category: "patient",
      //   programId: programId
      // });
      let patients = {};
      switch (filterBy) {
        case ALL: {
          if (sortBy === NAME) {
            patients = await userModel
              .find({
                category: "patient",
                programId: programId
              })
              .sort({
                name: 1
              });
            // console.log("=====patients=====>", patients)
            return patients;
          } else if (sortBy === LOCATION) {
            patients = await userModel
              .find({
                category: "patient",
                programId: programId
              })
              .sort({
                createdAt: -1
              });
            // console.log("=====patients=====>", patients)
            return patients;
          } else if (sortBy === DATEADDED) {
            patients = await userModel
              .find({
                category: "patient",
                programId: programId
              })
              .sort({
                createdAt: -1
              });
            // console.log("=====patients=====>", patients)
            return patients;
          }
          break;
        }

        case ENROLLED: {
          if (sortBy === NAME) {
            patients = await userModel
              .find({
                category: "patient",
                programId: programId,
                status: "ENROLLED"
              })
              .sort({
                name: 1
              });
            // console.log("=====patients=====>", patients)
            return patients;
          } else if (sortBy === LOCATION) {
            patients = await userModel
              .find({
                category: "patient",
                programId: programId
              })
              .sort({
                createdAt: -1
              });
            // console.log("=====patients=====>", patients)
            return patients;
          } else if (sortBy === DATEADDED) {
            patients = await userModel
              .find({
                category: "patient",
                programId: programId
              })
              .sort({
                createdAt: -1
              });
            // console.log("=====patients=====>", patients)
            return patients;
          }
          break;
        }

        case INACTIVE: {
          if (sortBy === NAME) {
            patients = await userModel
              .find({
                category: "patient",
                programId: programId,
                status: "INACTIVE"
              })
              .sort({
                name: 1
              });
            // console.log("=====patients=====>", patients)
            return patients;
          } else if (sortBy === LOCATION) {
            patients = await userModel
              .find({
                category: "patient",
                programId: programId
              })
              .sort({
                createdAt: -1
              });
            // console.log("=====patients=====>", patients)
            return patients;
          } else if (sortBy === DATEADDED) {
            patients = await userModel
              .find({
                category: "patient",
                programId: programId
              })
              .sort({
                createdAt: -1
              });
            // console.log("=====patients=====>", patients)
            return patients;
          }
          break;
        }

        case DISCHARGED: {
          if (sortBy === NAME) {
            patients = await userModel
              .find({
                category: "patient",
                programId: programId,
                status: "DISCHARGED"
              })
              .sort({
                name: 1
              });
            // console.log("=====patients=====>", patients)
            return patients;
          } else if (sortBy === LOCATION) {
            patients = await userModel
              .find({
                category: "patient",
                programId: programId
              })
              .sort({
                createdAt: -1
              });
            // console.log("=====patients=====>", patients)
            return patients;
          } else if (sortBy === DATEADDED) {
            patients = await userModel
              .find({
                category: "patient",
                programId: programId
              })
              .sort({
                createdAt: -1
              });
            // console.log("=====patients=====>", patients)
            return patients;
          }
          break;
        }

        default:
          break;
      }
      return patients;
    } catch (err) {
      throw err;
    }
  }

  async addCareCoachToProgram(data) {
    const { careCoachId, programId } = data;
    try {
      const result = await programModel.update(
        { _id: programId },
        { $push: { careCoaches: { id: careCoachId, patients: [] } } }
      );
      return result;
    } catch (err) {
      throw err;
    }
  }

  async addDoctorToProgram(data) {
    const { doctorId, programId } = data;

    try {
      const result = await programModel.update(
        { _id: programId },
        { $push: { doctors: { _id: doctorId, patients: [] } } }
      );
      return result;
    } catch (err) {
      throw err;
    }
  }

  //db.programs.update({"_id":ObjectId("343430303030303030303030"),"doctors.id":ObjectId("5c3662419360d90acd21641f")},{"$push":{"doctors.$.patients":ObjectId("5c36618e9360d90acd21642d")}},{upsert:true})

  //see upsert mongodb , nested array using position($) operator

  async addCareCoachPatient(data) {
    const { programId, careCoachId, patientId } = data;

    try {
      const result = await programModel.update(
        { _id: programId, "careCoaches.id": careCoachId },
        { $push: { "careCoaches.$.patients": patientId } },
        { upsert: true }
      );
      return result;
    } catch (err) {
      throw err;
    }
  }

  async addDoctorPatient(data) {
    const { programId, doctorId, patientId } = data;

    try {
      const result = await programModel.update(
        { _id: programId, "doctors.id": doctorId },
        { $push: { "doctors.$.patients": patientId } },
        { upsert: true }
      );
      return result;
    } catch (err) {
      throw err;
    }
  }

  async addPatientToProgram(data) {
    const { programId, doctorId, patientId, hospitalId } = data;

    try {
      if (doctorId) {
        const result = await programModel.update(
          {
            _id: programId,
            "doctors._id": doctorId
          },
          {
            $push: {
              "doctors.$.patients": {
                _id: patientId,
                hospital: hospitalId ? hospitalId : undefined
              }
            }
          },
          { upsert: true }
        );
        return result;
      }
    } catch (err) {
      throw err;
    }
  }

  async updateProgram(searchField, updateField) {
    try {
      let program = await programModel.update(searchField, updateField);
      return program;
    } catch (err) {
      throw err;
    }
  }

  async addtoArray(searchField, updateField, updateData) {
    try {
      let program = await programModel.update(searchField, {
        $push: { [updateField]: { $each: updateData } }
      });
      return program;
    } catch (err) {
      throw err;
    }
  }

  async getBasicInfo(id, fields = ["name", "pharmaCo", "targetLocation"]) {
    try {
      let program = await this.getProgram({ _id: id });
      let basicInfo = {};

      for (let field of fields) {
        basicInfo = Object.assign(basicInfo, {
          [field]: program[field]
        });
      }
      return basicInfo;
    } catch (err) {
      throw err;
    }
  }

  async getInvolvedPatients(actor, userId) {
    try {
      let results = await programModel.find(
        { [[actor].patients]: { $in: [userId] } },
        { [[actor].patients.$]: userId }
      );

      let actorIds = [];
      let tuple;
      for (let result in results) {
        tuple = results[result];
        actorIds.push({
          [tuple._id]: {
            doctor: tuple.doctors[0].ids
          }
        });
      }
      return actorIds;
    } catch (err) {
      throw err;
    }
  }

  //db.programs.find({"_id":ObjectId("343430303030303030303030"),"doctors.id":ObjectId("5c3662419360d90acd21641f"),"doctors.patients":ObjectId("5c366dd5296f340c76a0b41c")},{"_id":1,"doctors.$.id":1}).pretty()

  //see projections and <array>[identifier] in mongodb

  async getCareCoachOfUser(patientId, programId) {
    try {
      const result = await programModel
        .findById(
          {
            _id: programId,
            "careCoaches.patients": patientId
          },
          { _id: 1, "careCoaches.id": 1 }
        )
        .lean();
      return result === null ? [] : result;
    } catch (err) {
      throw err;
    }
  }

  //db.programs.find({"_id":ObjectId("333330303030303030303030"),"doctors.patients._id":ObjectId("5c6eabc42429b40fd91033c3")},{"doctors.patients.$._id":1}).pretty()

  async getDoctorOfUser(patientId, programId) {
    try {
      const result = await programModel
        .find(
          {
            _id: programId,
            "doctors.patients._id": patientId
          },
          { "doctors.patients.$._id": 1 }
        )
        .lean();

      return result === null ? [] : result;
    } catch (err) {
      throw err;
    }
  }

  async getDoctorOfPatient(patientId, programId) {
    try {
      const doctorData = await programModel
        .find(
          {
            _id: programId,
            "doctors.patients._id": patientId
          },
          { "doctors.patients.$._id": 1 }
        )
        .populate("doctors._id");

      let doctors = !_.isEmpty(doctorData)
        ? await Promise.all(
            doctorData.map(async value => {
              let {
                _id: {
                  _id,
                  name,
                  email,
                  contactNo: { countryCode, phoneNumber },
                  visitingHospitals
                }
              } = value.doctors[0];
              let hospital = !_.isEmpty(visitingHospitals)
                ? await hospitalService.getHospitalDetails({
                    _id: { $in: visitingHospitals }
                  })
                : null;
              return {
                doctorId: _id,
                name: name,
                email: email,
                contact: {
                  countryCode: countryCode || "",
                  phoneNumber: phoneNumber || ""
                },
                hospital: hospital || []
              };
            })
          )
        : [];

      return doctors;
    } catch (err) {
      throw err;
    }
  }

  async getPatientOfDoctor(doctorId, programId) {
    try {
      const result = await programModel
        .find(
          {
            _id: programId,
            "doctors._id": doctorId
          },
          { "doctors.patients.$._id": 1 }
        )
        .lean();

      return result === null ? [] : result;
    } catch (err) {
      throw err;
    }
  }

  async updatePatientHospital(patientId, hospitalId, index) {
    try {
      const query = `doctors.$.patients.${index}.hospital`;
      const result = await programModel
        .update(
          {
            // _id: programId,
            "doctors.patients._id": patientId
          },
          {
            $set: {
              [query]: hospitalId
            }
          },
          { new: true }
        )
        .lean();
      return result === null ? [] : result;
    } catch (err) {
      throw err;
    }
  }

  async validProgramForPlan(programIds) {
    try {
      const result = await programModel.find({
        _id: { $in: programIds },
        isBenefitsApplicable: true
      });
      return result === null ? [] : result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new ProgramService();
