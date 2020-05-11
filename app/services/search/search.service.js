import { USER_CATEGORY } from "../../../constant";

const userModel = require("../../models/user");
const programModel = require("../../models/program");
const path = require("path");
const MedicalConditionService = require("../medicalCondition/medicalCondition.service");
const ProgramService = require("../program/program.service");
const CityCountryService = require("../cityCountry/cityCountry.service");
const HospitalService = require("../hospital/hospital.service");
const { getDecryptedValue, formatUserData } = require("../user/helper");

class SearchService {
  constructor() {}

  async getUsers(query, text) {
    let projectedFields = {
      name: 1,
      dob: 1,
      gender: 1,
      homeAddress: 1,
      work: 1,
      profilePicLink: 1,
      category: 1,
      visitingHospitals: 1,
      programId: 1,
      createdAt: 1
    };

    const allUsers = await userModel.find(query, projectedFields);
    //console.log("ALL USERS**************** :", allUsers);
    let regex = new RegExp(`${text}`, "i");

    let users = [];
    allUsers.forEach(user => {
      const fmd = formatUserData(user);
      let userName = fmd.basicInfo.name;

      //let userName = user.name;
      if (regex.test(userName)) {
        //user.name = userName;
        users.push(fmd);
      }
    });
    //console.log("USERS ############# :", users);
    //return { result: users };

    /******* PREVIOUS CODE ********************/

    let userdata = [];

    const promises = users.map(async user => {
      if (
        user.basicInfo.category === USER_CATEGORY.PATIENT ||
        user.basicInfo.category === USER_CATEGORY.DOCTOR
      ) {
        return this.getExtraInfo(user);
      }
      return Promise.resolve([]);
    });
    const extraInfo = await Promise.all(promises);
    users.forEach(user => {
      // const {
      //   profilePicLink,
      //   name,
      //   category,
      //   dob,
      //   gender,
      //   homeAddress,
      //   work,
      //   _id,
      //   createdAt
      // } = user;
      const {
        basicInfo: { profilePicLink, _id, name, category, createdAt } = {},
        personalInfo: { dob, gender, homeAddress } = {},
        work
      } = user;

      let temp = {};
      temp._id = _id;
      temp.name = name;
      temp.createdAt = createdAt;
      temp.profilePicLink = profilePicLink
        ? "http://" + path.join(process.config.IMAGE_HOST, profilePicLink)
        : profilePicLink;
      temp.category = category;
      if (category === USER_CATEGORY.PATIENT) {
        temp.dob = dob;
        temp.gender = gender;
        temp.homeAddress = homeAddress;
        const index = extraInfo.findIndex(x => {
          return JSON.stringify(x.userId) === JSON.stringify(_id);
        });
        temp.disease = extraInfo[index].disease;
        temp.city = extraInfo[index].cities;
        temp.country = extraInfo[index].countryName;
        temp.hospital = extraInfo[index].hospitalName;
        temp.doctor = extraInfo[index].doctorName;
      } else {
        temp.speciality = work ? work.speciality : "Speciality";
        const index = extraInfo.findIndex(x => {
          return JSON.stringify(x.userId) === JSON.stringify(_id);
        });
        temp.hospital = extraInfo[index].hospitalName;
      }
      userdata.push(temp);
    });

    const result = users === null ? [] : userdata;

    return { result };
  }

  async getPrograms(id, query) {
    const result = await programModel
      .find({
        name: { $regex: `${query}`, $options: "$i" },
        _id: { $in: id }
      })
      .lean();

    return result === null ? [] : result;
  }

  async getExtraInfo(user) {
    // const {
    //   category,
    //   _id: userid,
    //   homeAddress: { city, country } = {},
    //   visitingHospitals = [],
    //   programId
    // } = user;
    const {
      basicInfo: { _id: userid, category } = {},
      personalInfo: { homeAddress: { city, country } = {} } = {},
      visitingHospitals = [],
      programId
    } = user;
    const userId = userid;

    if (category === USER_CATEGORY.PATIENT) {
      const medicalCondition = await MedicalConditionService.getMedicalsDetails(
        { userId }
      );
      const hospitaldata = await this.getPatitentHospital(userId, programId);
      let chiefComplaint = "";
      const cities = city ? await CityCountryService.getCityById(city) : [];
      const countries = country
        ? await CityCountryService.getCountryById(country)
        : [];
      const countryName = countries.length > 0 ? countries.name : "";
      const hospitalName = hospitaldata.hospitalName;
      const doctorName = hospitaldata.doctorName;
      if (medicalCondition.length !== 0) {
        let { basicCondition: { chiefComplaint: diseases } = {} } =
          medicalCondition[0] || {};
        chiefComplaint = diseases;
      }

      return {
        userId,
        chiefComplaint,
        cities,
        countryName,
        hospitalName,
        doctorName
      };
    }
    let hospitalName = "";
    if (visitingHospitals.length > 0) {
      const hospital = await HospitalService.getHospitalInfoById(
        visitingHospitals[0]
      );
      hospitalName = hospital.name;
    }
    return { userId, hospitalName };
  }

  async getPatitentHospital(userId, programId) {
    const doctorData = await ProgramService.getDoctorOfUser(userId, programId);

    let hospitals = [];
    let doctorId = "";
    if (doctorData.length > 0) {
      doctorId = doctorData[0].doctors[0]._id;
      hospitals = doctorData[0].doctors[0].patients;
    }
    let hospitalId = "";
    hospitals.forEach(hospital => {
      if (JSON.stringify(hospital._id) == JSON.stringify(userId)) {
        hospitalId = hospital.hospital;
      }
    });

    let doctorName = "";
    if (doctorId) {
      const doctor = await userModel.find({ _id: doctorId });
      doctorName = doctor[0].name;
    }
    let hospitalName = "";
    if (hospitalId) {
      const hospital = await HospitalService.getHospitalInfoById(hospitalId);
      hospitalName = hospital[hospitalId].name;
    }

    return { doctorName, hospitalName };
  }

  async getDoctorsPatient(doctorId, programId) {
    const doctorData = await ProgramService.getPatientOfDoctor(
      doctorId,
      programId
    );
    const doctorPatients = [];
    if (doctorData.length > 0) {
      const { patients = [] } = doctorData[0].doctors[0] || {};
      patients.forEach(patient => {
        const { _id } = patient;
        doctorPatients.push(_id);
      });
    }
    return doctorPatients;
  }
}

module.exports = new SearchService();
