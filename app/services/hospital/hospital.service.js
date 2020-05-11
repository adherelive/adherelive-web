const userModel = require("../../models/user");
const hospitalModel = require("../../models/hospital");
const cityCountryServices = require("../cityCountry/cityCountry.service");
const programModel = require("../../models/program");
const _ = require("lodash");

class HospitalService {
  constructor() {}

  async getHospitals(countryId, cityId) {
    try {
      let data = {};
      let hospitals = await hospitalModel.find({
        countryId: countryId,
        cityId: cityId
      });
      hospitals.forEach(function(hospital) {
        data = Object.assign(data, {
          [hospital._id]: {
            id: hospital._id,
            name: hospital.name,
            countryId: hospital.countryId,
            cityId: hospital.cityId
          }
        });
      });
      return data;
    } catch (err) {
      throw err;
    }
  }

  async getHospitalsForCountry(countryId) {
    try {
      let data = {};
      let hospitals = await hospitalModel.find({
        countryId: countryId
      });
      hospitals.forEach(function(hospital) {
        data = Object.assign(data, {
          [hospital._id]: {
            id: hospital._id,
            name: hospital.name,
            countryId: hospital.countryId,
            cityId: hospital.cityId
          }
        });
      });
      return data;
    } catch (err) {
      throw err;
    }
  }

  async getDoctorHospitals(doctorId) {
    try {
      let data = {};
      let doctor = await userModel
        .findById(doctorId)
        .populate("visitingHospitals")
        .populate("countryId");
      let hospitals = doctor.visitingHospitals;

      hospitals.forEach(function(hospital) {
        data = Object.assign(data, {
          [hospital._id]: {
            id: hospital._id,
            name: hospital.name,
            location: hospital.countryId
          }
        });
      });
      return data;
    } catch (err) {
      throw err;
    }
  }

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

  async getHospitalInfoById(hospitalId) {
    try {
      let data = {};
      const hospital = await hospitalModel.findById(hospitalId);
      if (hospital !== null) {
        data = Object.assign(data, {
          [hospital._id]: { id: hospital._id, name: hospital.name }
        });
      }
      return data;
    } catch (err) {
      throw err;
    }
  }

  async getHospitalDataForBatch(hospitalIds) {
    try {
      let data = {};
      const hospital = await hospitalModel.find({ _id: { $in: hospitalIds } });
      if (hospital !== null && hospital.length > 0) {
        hospital.forEach(hospital => {
          data = Object.assign(data, {
            [hospital._id]: { id: hospital._id, name: hospital.name }
          });
        });
      }
      return data;
    } catch (err) {
      throw err;
    }
  }

  async getHospitalDetails(data) {
    try {
      let hospitalData = await hospitalModel.find(data);

      let hospitals = (await !_.isEmpty(hospitalData))
        ? Promise.all(
            hospitalData.map(async value => {
              let { cityId, countryId, name, _id, contactNo } = value;
              let country = await cityCountryServices.getCountryNameById(
                countryId
              );
              let city = await cityCountryServices.getCityById(cityId);
              return {
                hospitalId: _id,
                name: name,
                city: city || "",
                country: country || "",
                contact: contactNo || ""
              };
            })
          )
        : [];
      return hospitals;
    } catch (err) {
      throw err;
    }
  }

  async getUser(data) {
    try {
      const user = await userModel.findOne(data);
      return user;
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
}

module.exports = new HospitalService();
