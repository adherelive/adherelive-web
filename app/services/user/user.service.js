const userModel = require("../../models/user");
const path = require("path");
const ObjectId = require("mongodb").ObjectID;
import { formatUserData, getDecryptedValue } from "./helper";
import { USER_CATEGORY } from "../../../constant";

const NAME = "Name";
const ALL = "All";
const ENROLLED = "Enrolled";
const INACTIVE = "Inactive";
const DISCHARGED = "Discharged";

class UserService {
  constructor() {}
  async addUser(data) {
    try {
      let user = await userModel.create(data);
      return user;
    } catch (err) {
      throw err;
    }
  }

  async getUser(data) {
    try {
      const user = await userModel.findOne(data);
      //console.log("insideeee getttt userrrrrrr:************* ", user);
      if (user) {
        const fmd = formatUserData(user);
        //console.log("fmddddddddddd: ", fmd);
        let tempUser = {};
        tempUser.settings = fmd.settings;
        tempUser.insurance = fmd.insurance;
        tempUser.status = fmd.status;
        tempUser.programId = fmd.programId;
        tempUser.documents = fmd.documents;
        tempUser.visitingHospitals = fmd.visitingHospitals;
        tempUser.isProfileCompleted = fmd.isProfileCompleted;
        tempUser.isConsentFormUploaded = fmd.isConsentFormUploaded;
        tempUser.isIdProofUploaded = fmd.isIdProofUploaded;
        tempUser.calendar = fmd.calendar;
        const {
          _id,
          name,
          profilePicLink,
          category,
          createdAt
        } = fmd.basicInfo;
        tempUser._id = _id;
        tempUser.name = name;
        tempUser.profilePicLink = user.profilePicLink;
        tempUser.category = category;
        tempUser.createdAt = createdAt;
        tempUser.work = fmd.work;
        const {
          contactNo,
          email,
          dob,
          gender,
          contacts,
          homeAddress,
          pharmacy,
          referralDate,
          education,
          segmentation,
          risk,
          height,
          weight,
          therapyInitiationDate,
          nationality,
          tempContactNo
        } = fmd.personalInfo;
        tempUser.contactNo = contactNo;
        tempUser.tempContactNo = tempContactNo;
        tempUser.email = email;
        tempUser.dob = dob;
        tempUser.gender = gender;
        tempUser.contacts = contacts;
        tempUser.homeAddress = homeAddress;
        tempUser.pharmacy = pharmacy;
        tempUser.referralDate = referralDate;
        tempUser.education = education;
        tempUser.segmentation = segmentation;
        tempUser.risk = risk;
        tempUser.height = height;
        tempUser.weight = weight;
        tempUser.therapyInitiationDate = therapyInitiationDate;
        tempUser.nationality = nationality;
        tempUser.password = user.password;
        tempUser.charity = user.charity;
        return tempUser;
      } else {
        return null;
      }
      // Reformat and return
      // return fmd;
    } catch (err) {
      throw err;
    }
  }

  getUserById = async id => {
    try {
      const user = await userModel.findOne({ _id: id }, { password: 0 });
      return formatUserData(user);
    } catch (err) {
      throw err;
    }
  };

  async updateUser(searchField, updateField, upsert = false) {
    try {
      let third = {};
      if (upsert) {
        third = { upsert: true };
      }
      let user = await userModel.findOneAndUpdate(
        searchField,
        { $set: updateField },
        third
      );
      return user;
    } catch (err) {
      throw err;
    }
  }

  async addConsentForm(userID, consentForm) {
    try {
      let user = await userModel.update(
        { _id: userID },
        {
          $set: {
            isConsentFormUploaded: true
          },
          $push: {
            "documents.consentForm": { file: consentForm }
          }
        }
      );
      return user;
    } catch (err) {
      throw err;
    }
  }

  async addIdProof(userID, idProof) {
    try {
      let user = await userModel.update(
        { _id: userID },
        {
          $set: {
            isIdProofUploaded: true
          },
          $push: {
            "documents.idProof": { file: idProof }
          }
        }
      );
      return user;
    } catch (err) {
      throw err;
    }
  }

  async addtoArray(searchField, updateField, updateData) {
    try {
      let result = await userModel.update(searchField, {
        $push: { [updateField]: { $each: updateData } }
      });
      return result;
    } catch (err) {
      throw err;
    }
  }

  async bulkUpdateUsers(updateQueries) {
    try {
      let user = await userModel.bulkWrite(updateQueries);
      return user;
    } catch (err) {
      throw err;
    }
  }

  async getAllUser(
    data,
    selectVal = false,
    filter = false,
    { q, status } = {}
  ) {
    try {
      let users = {};
      let query = {};
      if (status) {
        if (status.startsWith("!")) {
          query = { status: { $not: { $eq: status.slice(1) } } };
        }
      }
      const { programId, category } = data;
      let nameQuery = {};
      if (q) {
        nameQuery = { name: { $regex: `^.*${q}.*`, $options: "$i" } };
      }
      const queryData = {
        ...data,
        //...nameQuery,
        ...query
      };
      // console.log("queryData=========>", queryData);
      if (!filter.filterBy || filter.filterBy === "" || !filter) {
        users = selectVal
          ? await userModel.find(queryData).select(selectVal)
          : await userModel.find(queryData);
      } else {
        const { filterBy, sortBy } = filter;
        switch (filterBy) {
          case ALL: {
            //if (sortBy === NAME) {

            if (sortBy == "name") {
              users = await userModel.find(queryData);
              // .collation({ locale: "en", strength: 2 })
              // .sort({
              //   [sortBy]: 1
              // });
              let regex = new RegExp(`^.*${q}.*`, "i");
              users = users
                .filter(user => regex.test(user.name))
                .sort((a, b) => (a.name < b.name ? -1 : 1));
            } else {
              users = await userModel.find(queryData).sort({
                [sortBy]: -1
              });
            }
            //}
            break;
          }

          case ENROLLED: {
            //if (sortBy === NAME) {
            users = await userModel.find({
              category: "patient",
              programId: programId,
              status: "ENROLLED"
              //name: { $regex: `^.*${q}.*`, $options: "$i" }
            });
            //.collation({ locale: "en" })
            // .sort({
            //   [sortBy]: 1
            // });
            // console.log("=====users=====>", users)
            //}
            let regex = new RegExp(`^.*${q}.*`, "i");
            users = users
              .filter(user => regex.test(user.name))
              .sort((a, b) => (a.name < b.name ? -1 : 1));
            break;
          }

          case INACTIVE: {
            //if (sortBy === NAME) {
            users = await userModel.find({
              category: "patient",
              programId: programId,
              status: "INACTIVE"
              //name: { $regex: `^.*${q}.*`, $options: "$i" }
            });
            // .collation({ locale: "en" })
            // .sort({
            //   [sortBy]: 1
            // });
            // console.log("=====users=====>", users)
            //}
            let regex = new RegExp(`^.*${q}.*`, "i");
            users = users
              .filter(user => regex.test(user.name))
              .sort((a, b) => (a.name < b.name ? -1 : 1));
            break;
          }

          case DISCHARGED: {
            //if (sortBy === NAME) {
            users = await userModel.find({
              category: "patient",
              programId: programId,
              status: "DISCHARGED"
              //name: { $regex: `^.*${q}.*`, $options: "$i" }
            });
            // .collation({ locale: "en" })
            // .sort({
            //   [sortBy]: 1
            // });
            // console.log("=====users=====>", users)
            //}
            let regex = new RegExp(`^.*${q}.*`, "i");
            users = users
              .filter(user => regex.test(user.name))
              .sort((a, b) => (a.name < b.name ? -1 : 1));
            break;
          }

          default:
            users = selectVal
              ? await userModel.find(queryData).select(selectVal)
              : await userModel.find(queryData);
            break;
        }
      }
      // console.log("filter--------------", users, "----------");
      return users.map(value => formatUserData(value));
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async getDoctorDataforBatch(doctorIds) {
    try {
      const doctorsdata = await userModel.find({ _id: { $in: doctorIds } });

      return doctorsdata;
    } catch (err) {
      throw err;
    }
  }

  async getBasicInfo(
    id,
    fields = [
      "_id",
      "profilePicLink",
      "name",
      "category",
      "createdAt",
      "status"
    ]
  ) {
    try {
      if (id === undefined || id == null) return;
      let user = await this.getUser({ _id: id });
      let basicInfo = {};

      for (let field in fields) {
        basicInfo = Object.assign(basicInfo, {
          [fields[field]]: user[fields[field]]
        });
      }

      // console.log("basicInfo: ", basicInfo);
      // if (user.category === "patient") {
      //   basicInfo["name"] = getDecryptedValue(basicInfo["name"]);
      // }

      if (basicInfo.profilePicLink) {
        basicInfo.profilePicLink =
          "http://" +
          path.join(process.config.IMAGE_HOST, basicInfo.profilePicLink);
      }

      return basicInfo;
    } catch (err) {
      throw err;
    }
  }

  async getMedicalCondition(id) {
    try {
      let user = await this.getUser({ _id: id });
      return user.medicalCondition ? user.medicalCondition : {};
    } catch (err) {
      throw err;
    }
  }

  async getClinicalReadings(id) {
    try {
      let user = await this.getUser({ _id: id });
      return user.clinicalReadings ? user.clinicalReadings : {};
    } catch (err) {
      throw err;
    }
  }

  async getWork(id) {
    try {
      let user = await this.getUser({ _id: id });
      return user.work ? user.work : {};
    } catch (err) {
      throw err;
    }
  }

  async getVisitingHospitals(id) {
    try {
      let user = await this.getUser({ _id: id });
      return user.visitingHospitals ? user.visitingHospitals : {};
    } catch (err) {
      throw err;
    }
  }

  async getBulkUsers(ids) {
    try {
      const users = await userModel.find({ _id: { $in: ids } });
      return users.map(value => formatUserData(value));
    } catch (err) {
      throw err;
    }
  }

  async getRelatedMembers({ programIds, category = ["doctor", "patient"] }) {
    try {
      const programIdObjectsArr = programIds.map(id => ObjectId(id));
      const users = await userModel.find({
        programId: { $in: programIdObjectsArr },
        isProfileCompleted: true,
        category: { $in: category },
        status: "ENROLLED"
      });
      return users.map(value => formatUserData(value));
    } catch (err) {
      throw err;
    }
  }

  async getRelatedMembersForPlan({ programIds }) {
    try {
      const users = await userModel.find({
        programId: { $in: programIds },
        isProfileCompleted: true,
        category: "patient",
        status: "ENROLLED",
        isBenefitsApplicable: true
      });
      return users.map(value => formatUserData(value));
    } catch (err) {
      throw err;
    }
  }

  async updateStatus(searchField, updateData) {
    try {
      const { ids, category } = searchField;
      const patientIds = ids.map(id => ObjectId(id));
      const result = await userModel.updateMany(
        { _id: { $in: patientIds }, category: category },
        updateData
      );
    } catch (err) {
      throw err;
    }
  }

  async getUserCategory(user_id) {
    try {
      const result = await userModel.find({ _id: user_id }, { category: 1 });
      return result;
    } catch (error) {
      return error;
    }
  }

  async getTotalPatientsInProgram(programId) {
    try {
      const patientCount = await userModel
        .find({
          category: "patient",
          programId: { $in: programId }
        })
        .count();
      return patientCount;
    } catch (error) {
      throw error;
    }
  }

  async getUserForCharity(charityId) {
    try {
      const user = await userModel
        .find({
          category: USER_CATEGORY.CHARITY_ADMIN,
          charity: charityId
        })
        .lean();
      return user;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService();
