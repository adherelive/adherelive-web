const path = require("path");

export const formatPatientDoctorData = data => {
  try {
    const patientsDoctor = {};
    const doctorsIds = new Set();
    const hospitalId = new Set();
    data.forEach(doctor => {
      const { _id: doctorId, patients } = doctor;
      if (doctorId) {
        doctorsIds.add(doctorId);
      }
      patients.forEach(patient => {
        const { _id: patientId, hospital } = patient;
        if (hospital) {
          hospitalId.add(hospital);
        }
        patientsDoctor[patientId] = {
          doctorId: doctorId,
          hospitalId: hospital
        };
      });
    });
    // console.log("patientsDoctor", patientsDoctor);
    return { patientsDoctor, doctorsIds, hospitalId };
  } catch (err) {
    throw err;
  }
};

export const formatPatientData = (data, patientsDoctor) => {
  try {
    const patients = [];
    const users = {};

    data.forEach(patient => {
      const { _id } = patient;
      patients.push(_id);
      const basicInfo = getBasicInfo(patient);
      const personalInfo = getPersonalInfo(patient);
      const programIds = [{}];
      programIds[0].doctor = patientsDoctor[_id]
        ? patientsDoctor[_id].doctorId
        : "";
      programIds[0].hospitalId = patientsDoctor[_id]
        ? patientsDoctor[_id].hospitalId
        : "";
      programIds[0].id = patient.programId[0];

      users[_id] = { basicInfo, personalInfo, programIds };
    });
    return { patients, users };
  } catch (err) {
    throw err;
  }
};

export const getBasicInfo = (
  user,
  fields = ["_id", "profilePicLink", "name", "category"]
) => {
  try {
    let basicInfo = {};

    for (let field in fields) {
      basicInfo = Object.assign(basicInfo, {
        [fields[field]]: user[fields[field]]
      });
    }

    if (basicInfo.profilePicLink) {
      basicInfo.profilePicLink =
        "http://" +
        path.join(process.config.IMAGE_HOST, basicInfo.profilePicLink);
    }

    return basicInfo;
  } catch (err) {
    throw err;
  }
};

export const getPersonalInfo = (
  user,
  fields = ["contactNo", "dob", "gender", "homeAddress", "contacts"]
) => {
  try {
    let personalInfo = {};

    for (let field in fields) {
      personalInfo = Object.assign(personalInfo, {
        [fields[field]]: user[fields[field]]
      });
    }

    return personalInfo;
  } catch (err) {
    throw err;
  }
};

export const formatDoctorData = doctorData => {
  try {
    let doctors = {};
    doctorData.forEach(doctor => {
      const basicInfo = getBasicInfo(doctor);
      const { _id } = doctor;
      doctors[_id] = { basicInfo: basicInfo };
    });
    return doctors;
  } catch (err) {
    throw err;
  }
};
