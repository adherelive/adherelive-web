const medicalConditionModel = require("../../models/medicalCondition");
const moment = require("moment");

class MedicalConditionService {
  async createUserMedicalData(userId) {
    try {
      const medicalCondition = {
        userId: userId,
        basicCondition: "",
        vitals: [],
        clinicalReading: {
          active: [],
          readings: []
        }
      };
      const response = await medicalConditionModel.create(medicalCondition);
      return response;
    } catch (err) {
      throw err;
    }
  }

  async isUserNew(userId) {
    try {
      const user = await medicalConditionModel.find({ userId: userId });
      let response = true;
      if (user.length > 0) {
        response = false;
      }
      return response;
    } catch (err) {
      throw err;
    }
  }

  async addUser(data) {
    try {
      const {
        userId,
        basicCondition,
        vitals,
        clinicalReadings,
        updatedAt
      } = data;

      const response = await medicalConditionModel.create(data);
      return response;
    } catch (err) {
      throw err;
    }
  }

  async updateUser(data) {
    try {
      const {
        userId,
        basicCondition,
        vitals,
        clinicalReadings,
        updatedAt
      } = data;

      const basicAndVital = await medicalConditionModel.findOneAndUpdate(
        { userId: userId },
        {
          $set: {
            basicCondition: basicCondition
          },
          $push: { vitals: vitals }
        }
      );

      const clinicalReading = await this.pushClinicalReading(
        clinicalReadings,
        userId
      );
      // tests.map(async(test) => {
      //   const query = `clinicalReadings.${[test]}`;
      //   const data  = clinicalReadings[test];
      //   const reading = await medicalConditionModel.findOneAndUpdate(
      //     {userId: userId},
      //     {
      //       $push : { [query] : data}
      //     },
      //     {new : true}
      //   )
      //   return reading;
      // })

      return clinicalReading;
    } catch (err) {
      throw err;
    }
  }

  async pushClinicalReading(clinicalReadings, userId) {
    const tests = Object.keys(clinicalReadings);
    let readings = [];
    for await (let test of tests) {
      const query = `clinicalReadings.readings.${[test]}`;
      const data = clinicalReadings[test];

      const reading = await medicalConditionModel.findOneAndUpdate(
        { userId: userId },
        {
          $push: { [query]: data }
        },
        { new: true }
      );
      readings.push(reading);
    }
    return readings;
  }

  //params data = {}
  // async addMedicalCondition(data) {
  //   try {

  //     const user = await medicalConditionModel.find({ userId: userId });
  //     let response = "";

  //     const vital = {...vitals}
  //     const updateAt = moment().format();
  //      vital.updatedAt = updateAt ;

  //     if (user.length > 0) {

  //      if(!testReadings){
  //       clinicalReadings.map((reading) => {
  //             const tests = Object.keys(reading);
  //             const testReading = reading[tests[0]]
  //             testReading.updatedAt = updateAt
  //             let readings =  clinicalReading["ABI_TEST"]
  //             readings.push(testReading)
  //             clinicalReading["ABI_TEST"] = readings

  //          })

  //      }

  //       response = await medicalConditionModel.findOneAndUpdate(
  //         { userId: userId },
  //         {
  //           $set: {
  //             basicCondition: basicCondition,
  //             clinicalReadings: clinicalReadings,
  //             updatedAt: updatedAt
  //           },
  //           $push: { vitals: vital }
  //         }
  //       );
  //       return response;
  //     }
  //        response = await medicalConditionModel.create(data);
  //     ("response-----",response, "----------------------------")
  //     return response;
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  async updateBasicCondition(medicalConditionId, data) {
    try {
      const response = await medicalConditionModel.findOneAndUpdate(
        { _id: medicalConditionId },
        { $set: { basicCondition: data } },
        { new: true }
      );

      return response;
    } catch (err) {
      throw err;
    }
  }

  async addVitals(medicalConditionId, data) {
    try {
      const response = await medicalConditionModel.findOneAndUpdate(
        { _id: medicalConditionId },
        { $push: { vitals: data } },
        { new: true }
      );

      return response;
    } catch (err) {
      throw err;
    }
  }

  async addClinicalReading(medicalConditionId, data) {
    try {
      const test = Object.keys(data[0]);
      const updateAt = moment().format();

      const testValue = {};
      testValue.data = data[0][test];
      testValue.updatedAt = updateAt;
      const query = `clinicalReadings.readings.${[test]}`;
      const active_key = `clinicalReadings.active`;
      const response = await medicalConditionModel.findOneAndUpdate(
        { _id: medicalConditionId },
        { $push: { [query]: testValue, [active_key]: test } },
        { new: true }
      );

      return response;
    } catch (err) {
      throw err;
    }
  }

  async updateClinicalReading(medicalConditionId, data, is_new = false) {
    try {
      const test = Object.keys(data[0]);
      const updateAt = moment().format();

      const testValue = {};
      testValue.data = data[0][test];
      testValue.updatedAt = updateAt;
      const query = `clinicalReadings.readings.${[test]}`;

      const response = await medicalConditionModel.findOneAndUpdate(
        { _id: medicalConditionId },
        { $push: { [query]: testValue } },
        { new: true }
      );

      return response;
    } catch (err) {
      throw err;
    }
  }

  async removeClinicalReading(medicalConditionId, test) {
    try {
      const active_key = `clinicalReadings.active`;
      const response = await medicalConditionModel.findOneAndUpdate(
        { _id: medicalConditionId },
        { $pull: { [active_key]: test } },
        { new: true }
      );

      return response;
    } catch (err) {
      throw err;
    }
  }

  //params forUser = {userId:_id of user}
  async getMedicalsDetails(forUser) {
    try {
      const response = await medicalConditionModel
        .find(forUser)
        .sort({ $natural: -1 })
        .limit(1);
      return response === null ? [] : response;
    } catch (err) {
      throw err;
    }
  }

  async getMedicalDetailsForId(medicalConditionId) {
    try {
      const response = await medicalConditionModel
        .find({ _id: medicalConditionId })
        .lean();
      return response === null ? [] : response;
    } catch (err) {
      throw err;
    }
  }

  async updateOthers(medicalConditionId, data) {
    try {
      const response = await medicalConditionModel.findOneAndUpdate(
        { _id: medicalConditionId },
        { $set: { others: data } },
        { new: true }
      );
      return response;
    } catch (error) {
      throw err;
    }
  }
}

module.exports = new MedicalConditionService();
