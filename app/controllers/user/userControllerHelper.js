import { forEach } from "async";
import isEmpty from "lodash/isEmpty";
import moment from "moment";

const DOCTOR = "doctor";
const CARECOACH = "careCoach";
const PATIENT = "patient";
const PROGRAMADMIN = "programAdmin";
const SUPERADMIN = "superAdmin";
const md5 = require("js-md5");

export const addUserInProgramOnSignUp = async data => {
  try {
    const {
      inviter: { category: inviterCategory, id: inviterId },
      invitee: { category: inviteeCategory, id: inviteeId },
      programId,
      programService,
      hospitalId,
      doctorId
    } = data;
    switch (inviterCategory) {
      // as invitee to the program as doctor or carecoach
      case SUPERADMIN:
      case PROGRAMADMIN: {
        if (inviteeCategory === DOCTOR) {
          const result = await programService.addDoctorToProgram({
            doctorId: inviteeId,
            programId
          });
        } else {
          const result = await programService.addCareCoachToProgram({
            careCoachId: inviteeId,
            programId
          });
        }
      }
      //add doctor patient in program
      case DOCTOR: {
        const result = await programService.addDoctorPatient({
          doctorId: inviterId,
          patientId: inviteeId,
          programId
        });
      }
      //add careCoach patient in program
      case CARECOACH: {
        if (inviteeCategory === PATIENT) {
          const response = await programService.addCareCoachPatient({
            programId: programId,
            careCoachId: inviterId,
            patientId: inviteeId
          });
          const result = await programService.addPatientToProgram({
            programId: programId,
            doctorId: doctorId,
            patientId: inviteeId,
            hospitalId: hospitalId
          });
        } else {
          const result = await programService.addDoctorToProgram({
            doctorId: inviteeId,
            programId
          });
        }
      }
    }
  } catch (err) {
    throw err;
  }
};

export const getUserProgramDetails = async data => {
  const { userId, programs, programService, category } = data;
  let programsDetail = {};
  try {
    if (category === PATIENT) {
      //collect doctor and careCoach

      const careCoachData = await programService.getCareCoachOfUser(
        userId,
        programs
      );

      const doctorData = await programService.getDoctorOfUser(userId, programs);
      let hospitalId;
      console.log("doctorData --> ", doctorData);
      if (
        doctorData != null &&
        doctorData.length != null &&
        doctorData.length > 0
      ) {
        console.log("!!!! doctorData ---> ",doctorData);
        let patients = doctorData[0].doctors[0].patients;
        forEach(patients, function(patient) {
          if (JSON.stringify(patient._id) == JSON.stringify(userId)) {
            hospitalId = patient.hospital;
          }
        });
      }
      console.log("careCoachData ? careCoachData.careCoaches[0].id --> ", careCoachData, careCoachData.careCoaches);
      let programDetail = {
        id: programs,
        careCoach: careCoachData.length > 0 ? careCoachData.careCoaches[0].id : null,
        doctor:
          doctorData != null &&
          doctorData.length != null &&
          doctorData.length > 0
            ? doctorData[0].doctors[0]._id
            : null,
        hospitalId: hospitalId ? hospitalId : null
      };
      programsDetail = programDetail;
    }

    // else if (category === DOCTOR || category === CARECOACH) {
    //    //collect patients
    //   programs.forEach((programId, index) => {
    //     let programDetail = {
    //       id: programId,
    //       patients: await programService.getPatientsOfUser(userId, programId)
    //     };
    //     programsDetail[programId] = programDetail;
    //   });
    // }
  } catch (err) {
    console.log("ERROR --> ", err);
    throw err;
  }
  return programsDetail;
};

export const saveFileIntoUserBucket = async ({ service, file, userId }) => {
  try {
    await service.createBucket();
    let hash = md5.create();
    const originalFileName = file.originalname;
    hash.update(userId);
    hash.hex();
    const bucket = String(hash).substring(0, 4);
    hash.update(userId + new Date().getTime());
    hash.hex();
    hash = String(hash);
    const fileBuffer = file.buffer;
    const filename = hash.substring(4);
    let fileUrl = bucket + "/" + filename + originalFileName;
    await service.saveBufferObject(fileBuffer, fileUrl);
    let files = [fileUrl];
    return files;
  } catch (err) {
    throw err;
  }
};

export const formatClinicalReading = async (
  clinicalReadings,
  userMedicalData,
  clinicalTest
) => {
  try {
    let testReadings;
    if (isEmpty(clinicalReadings)) {
      testReadings = clinicalReadings;
    }

    let clinicalReadingFormat = testReadings ? testReadings : {};

    const updateAt = moment().format();
    const tests = Object.keys(clinicalReadings);
    if (clinicalReadings) {
      tests.map(test => {
        let testReading = {};
        testReading.data = clinicalReadings[test];
        testReading.updatedAt = updateAt;

        let readings = [];
        readings.push(testReading);
        clinicalReadingFormat[test] = readings[0];
      });
    }
    return clinicalReadingFormat;
  } catch (err) {
    throw err;
  }
};
