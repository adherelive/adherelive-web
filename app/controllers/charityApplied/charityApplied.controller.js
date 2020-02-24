const charityService = require("../../services/charity");
const { validationResult } = require("express-validator/check");
const Response = require("../../helper/responseFormat");
const Log = require("../../../libs/log")("charityController");
const userService = require("../../services/user/user.service");
const hospitalService = require("../../services/hospital/hospital.service");
const cityCountryService = require("../../services/cityCountry/cityCountry.service");
const programService = require("../../services/program/program.service");
const medicationService = require("../../services/medication/medication.service");
const productService = require("../../services/product/product.service");
const medicalConditionService = require("../../services/medicalCondition/medicalCondition.service");
const hospitalizationService = require("../../services/hospitalization/hospitalization.service");
const medicalService = require("../../services/medicalCondition/medicalCondition.service");
const insuranceService = require("../../services/insurance/insurance.service");
const programKeyValueService = require("../../services/programKeyValue/programKeyValue.service");
const charityDocumentService = require("../../services/charityDocuments");
const charitiesAppliedService = require("../../services/charitiesApplied/charitiesApplied.service");
const contributionService = require("../../services/contributions/contribution.service");
const benefitPlanService = require("../../services/benefitPlan/benefitPlan.service");
const { NotificationSdk } = require("../../notificationSdk");
const dispensationService = require("../../services/dispensation/dispensation.service");
const moment = require("moment");

const errMessage = require("../../../config/messages.json").errMessages;
const _ = require("lodash");
const { ObjectId } = require("mongodb");
import { forEach } from "async";
import get from "lodash/get";
import programWrapper from "../../services/program/programHelper";
import {
  USER_CATEGORY,
  BENEFITPLAN_STATUS,
  NOTIFICATION_VERB,
  EVENT_IS
} from "../../../constant";
import { getUserProgramDetails } from "../user/userControllerHelper";

const PATIENT = "patient";

// const contributionRequests = {
//   11111111: {
//     _id: "11111111",
//     benefitPlanId: "222222222",
//     charityId: "313030303030303030303031",
//     patientId: "5cf8adc32d5e270027146b51",
//     status: "Pending",
//     currentLevel: ["Level-1"],
//     levelApprovals: {
//       "Level-1": "Pending",
//       "Level-2": "Pending"
//     },
//     charityDocs: {
//       "313030303030303030303131": {
//         docs: [
//           {
//             file: "6bf5/544da81188494cc2dc6eb6c93a90Collections Interaction.jpg"
//           },
//           {
//             file:
//               "6bf5/544da81188494cc2dc6eb6c93a90Collections Interaction (1).jpg"
//           }
//         ],
//         comment: "",
//         shouldReupload: "",
//         uploadedOn: "1574335433967.0"
//       },
//       "313030303030303030303231": {
//         docs: [{ file: "6bf5/544da81188494cc2dc6eb6c93a90B286939C.PNG" }],
//         comment: "",
//         shouldReupload: "",
//         uploadedOn: "1574335433987.0"
//       },
//       "313030303030303030303331": {
//         docs: [
//           {
//             file:
//               "6bf5/544da81188494cc2dc6eb6c93a90Collections Interaction (1).jpg"
//           }
//         ],
//         comment: "",
//         shouldReupload: "",
//         uploadedOn: "1574335433987.0"
//       }
//     }
//   },
//   11111112: {
//     _id: "11111112",
//     benefitPlanId: "222222223",
//     charityId: "313030303030303030303031",
//     patientId: "5d2819725742dc002732de64",
//     status: "Pending",
//     currentLevel: ["Level-1", "Level-2"],
//     levelApprovals: {
//       "Level-1": "Approved",
//       "Level-2": "Pending"
//     }
//   },
//   11111113: {
//     _id: "11111113",
//     benefitPlanId: "222222224",
//     charityId: "313030303030303030303031",
//     patientId: "5cf8adc32d5e270027146b51",
//     status: "Pending",
//     currentLevel: ["Level-1"],
//     levelApprovals: {
//       "Level-1": "Pending",
//       "Level-2": "Pending"
//     }
//   },
//   11111114: {
//     _id: "11111114",
//     benefitPlanId: "222222225",
//     charityId: "313030303030303030303031",
//     patientId: "5d2819725742dc002732de64",
//     status: "Pending",
//     currentLevel: ["Level-1"],
//     levelApprovals: {
//       "Level-1": "Pending",
//       "Level-2": "Pending"
//     }
//   }
// };

class CharityAppliedController {
  // async getCharityByCharityAdminId(req, res) {
  //   try {
  //     const { charityAdminId } = req.params;
  //     const charityResponse = await charityService.getCharityByCharityAdminId(
  //       charityAdminId
  //     );
  //     //console.log("Charity in controller: ", charityResponse);
  //     let { _id } = charityResponse || {};
  //     let charity = {};
  //     if (_id) {
  //       charity[_id] = charityResponse;
  //     }
  //     let response = new Response(true, 200);
  //     response.setData({ charity });
  //     response.setMessage("Charity Fetched successfully!");
  //     return res.status(response.getStatusCode()).send(response.getResponse());
  //   } catch (err) {
  //     console.log(err);
  //     let response = new Response(false, 500);
  //     response.setError(errMessage.INTERNAL_SERVER_ERROR);
  //     return res.status(500).json(response.getResponse());
  //   }
  // }

  async getBenefitContributionRequestByCharityAdmin(req, res) {
    try {
      const {
        userId: charityAdminId,
        userData: { charity: charityId } = {}
      } = req.userDetails;

      // Find charity by Charity Id
      const charityDetails = await charityService.getCharityById(charityId);
      let { charityAdmin } = charityDetails;
      let { level = "" } = charityAdmin[charityAdminId];

      // Only those requests should be fetched where level of charity Admin is present in currentLevel of charitiesApplied document
      let fetchedContributionRequests = await charitiesAppliedService.getContributionRequestsByCharity(
        charityId,
        level
      );

      let contributionRequests = {};
      fetchedContributionRequests.forEach(cr => {
        contributionRequests[cr._id] = cr;
      });

      const patientList = [];
      for (let request in contributionRequests) {
        const { patientId } = contributionRequests[request];
        patientList.push(patientId);
      }

      const charity = await charityService.getCharityById(charityId);

      let charityObj = {};
      charityObj[charity._id] = charity;

      const charityDocuments = await charityDocumentService.getCharityDocuments();
      let charityDocumentsObj = {};
      charityDocuments.forEach(cd => {
        charityDocumentsObj[cd._id] = cd;
      });

      const users = await userService.getBulkUsers(patientList);
      console.log("Users in getbenefitrequest: ", users);
      let userObj = {};
      users.forEach(user => {
        const { basicInfo: { _id } = {} } = user;
        userObj[_id] = user;
      });

      const programs = await programService.getPrograms({
        "careCoaches.patients": { $in: patientList }
      });

      let programObj = {};
      programs.forEach(program => {
        const { _id } = program;
        programObj[_id] = program;
      });
      let hospitalsIds = new Set();

      for (let user in userObj) {
        let userData = userObj[user];
        const { basicInfo: { _id: patientId } = {} } = userData;
        let doctorData = await programService.getDoctorOfUser(
          patientId,
          userData.programId[0]
        );
        let hospitalId;
        let doctorId;
        let programIds = [];
        if (
          doctorData != null &&
          doctorData.length != null &&
          doctorData.length > 0
        ) {
          const details = doctorData[0].doctors[0];
          const { patients, _id: doctor } = details;
          doctorId = doctor;
          forEach(patients, function(patient) {
            if (JSON.stringify(patient._id) === JSON.stringify(patientId)) {
              hospitalId = patient.hospital;
              hospitalsIds.add(ObjectId(hospitalId));
            }
          });
        }
        programIds.push({
          id: userData.programId[0],
          doctor: doctorId,
          hospitalId: hospitalId
        });
        userObj = {
          ...userObj,
          [user]: { ...userData, programIds }
        };
      }

      let hospitals = {};
      const hospitalsData = await hospitalService.getHospitalDetails({
        _id: {
          $in: [...hospitalsIds]
        }
      });
      hospitalsData.forEach(hospital => {
        const { hospitalId, city } = hospital;
        hospitals = { ...hospitals, [hospitalId]: hospital };
      });

      let response = new Response(true, 200);
      response.setData({
        contributionRequests,
        charity: charityObj,
        users: userObj,
        programs: programObj,
        hospitals,
        charityDocuments: charityDocumentsObj
      });
      response.setMessage("Benefit Requests Fetched successfully!");
      return res.status(response.getStatusCode()).send(response.getResponse());
    } catch (err) {
      console.log(err);
      let response = new Response(false, 500);
      response.setError(errMessage.INTERNAL_SERVER_ERROR);
      return res.status(500).json(response.getResponse());
    }
  }

  async getContributionRequest(req, res) {
    try {
      const { requestId } = req.params;
      if (requestId) {
        // TO DO Fetch single contribution request as per request ID

        let contributionRequest = await charitiesAppliedService.getContributionRequest(
          requestId
        );
        //let contributionRequest = contributionRequests[requestId];

        let contributionRequestObj = {};
        contributionRequestObj[requestId] = contributionRequest;

        const { benefitPlanId, dispensationId } = contributionRequest;
        let benefitplan = await benefitPlanService.getBenefitPlanById(
          benefitPlanId
        );
        let benefitplanObj = {};
        benefitplanObj[benefitplan._id] = benefitplan;

        let dispensation = await dispensationService.getDispensationById(
          dispensationId
        );
        let dispensationObj = {};
        dispensationObj[dispensation._id] = dispensation;

        let charity = await charityService.getCharityById(
          contributionRequest.charityId
        );

        let charityObj = {};
        charityObj[charity._id] = charity;

        let users = {};
        let data = {};
        let countryCities = {};
        let programIds = [];
        const { patientId: id } = contributionRequest;
        const userData = await userService.getUserById(id);
        if (userData) {
          const {
            basicInfo,
            work = {},
            personalInfo,
            settings,
            insurance = {},
            status,
            programId,
            documents,
            visitingHospitals,
            isConsentFormUploaded,
            isIdProofUploaded,
            isProfileCompleted
          } = userData;

          let citiesId = new Set([
            get(personalInfo, "homeAddress.city", null),
            get(work, "officeAddress.city", null)
          ]);

          const charityDocuments = await charityDocumentService.getCharityDocuments();
          let charityDocumentsObj = {};
          _.map(charityDocuments, cd => {
            charityDocumentsObj[cd._id] = cd;
          });

          const { category, _id } = basicInfo;
          if (category === PATIENT) {
            let insuranceData;
            let medicalConditionData = {};
            const { provider } = insurance;
            if (provider) {
              const insuranceProviderDetail = await insuranceService.getInsuranceProviderById(
                provider
              );
              insuranceData = {
                [provider]: insuranceProviderDetail
              };
            }

            const medicalCondition = await medicalConditionService.getMedicalsDetails(
              {
                userId: id
              }
            );
            if (medicalCondition.length > 0) {
              const {
                basicCondition,
                vitals,
                clinicalReadings = {},
                _id: medicalConditionId,
                others
              } = medicalCondition[0];

              const { active = [], readings = {} } = clinicalReadings;
              const clinicalReading = {};
              if (clinicalReadings) {
                active.forEach(test => {
                  const testData = readings[test];
                  clinicalReading[test] = testData[testData.length - 1];
                });
              }

              medicalConditionData._id = medicalConditionId;
              medicalConditionData.basicCondition = basicCondition;
              medicalConditionData.vitals = vitals[vitals.length - 1];
              medicalConditionData.clinicalReadings = clinicalReading;
              medicalConditionData.others = others;
            }

            const programKeyValue = await programKeyValueService.getTest(
              programId
            );
            let clinicalTestTemplates = [];
            if (programKeyValue.length > 0) {
              const { values: { test } = {} } = programKeyValue[0];
              clinicalTestTemplates = test;
            }

            const medications = await medicationService.getMedications({
              userId: id
            });

            let medication = {};
            if (medications.length > 0) {
              const { medicine, userId: patientId } = medications[0];
              const latestMedicine = medicine[medicine.length - 1];
              medication.userId = patientId;
              medication.medicine = latestMedicine;
              //
            }

            // Get Hospitalization details

            const hospitalizationData = await hospitalizationService.getHospitalizationByUserId(
              id
            );
            let hospitalization = {};
            if (hospitalizationData) {
              const { hospitalization: hospData = [] } = hospitalizationData;
              hospitalization[id] = hospData;
            }

            const productId = await programService.getProgramProducts(
              programId
            );
            let products_data = [];
            if (productId !== null && productId && productId.length > 0) {
              products_data = await productService.getProductById(
                productId[0].products
              );
            }
            let products = {};
            if (products_data.length > 0) {
              products_data.map(product => {
                const { _id } = product;
                products[_id] = product;
              });
            }

            let programs = {};
            let hospitals = {};
            if (programId !== null && programId && programId.length > 0) {
              const program = await programWrapper(programId[0]);
              if (program) {
                const programData = program.getBasicInfo();

                let programKeyValues = {};

                if (category === USER_CATEGORY.PATIENT) {
                  programKeyValues = program.getProgramKeyValues();
                }

                let insuranceData = {};
                const { insuranceProviders = [] } = programData;
                const insuranceProvidersData = await insuranceService.getInsuranceProvidersById(
                  insuranceProviders
                );
                if (insuranceProvidersData.length > 0) {
                  insuranceProvidersData.forEach((ip, key) => {
                    insuranceData[ip._id] = ip;
                  });
                }

                programs = {
                  [programId[0]]: {
                    ...programData,
                    programKeyValues,
                    insuranceProviders: insuranceData
                  }
                };
              }

              const userProgramData = await getUserProgramDetails({
                userId: id,
                programs: programId[0],
                programService: programService,
                category: category
              });

              const {
                doctor: doctorId,
                careCoach: careCoachId,
                hospitalId
              } = userProgramData;

              programIds.push({
                id: programId[0],
                doctor: doctorId,
                careCoach: careCoachId,
                hospitalId: hospitalId
              });

              if (doctorId) {
                const doctorData = await userService.getUserById(doctorId);
                users[doctorId] = {
                  basicInfo: doctorData.basicInfo,
                  personalInfo: doctorData.personalInfo,
                  work: doctorData.work
                };
                citiesId.add(
                  get(doctorData.personalInfo, "homeAddress.city", null)
                );
                citiesId.add(get(doctorData.work, "officeAddress.city", null));
              }

              if (careCoachId) {
                const careCoachData = await userService.getUserById(
                  careCoachId
                );
                users[careCoachId] = {
                  basicInfo: careCoachData.basicInfo,
                  personalInfo: careCoachData.personalInfo,
                  work: careCoachData.work
                };
                citiesId.add(
                  get(careCoachData.personalInfo, "homeAddress.city", null)
                );
                citiesId.add(
                  get(careCoachData.work, "officeAddress.city", null)
                );
                citiesId.add(
                  get(careCoachData.work, "officeAddress.city", null)
                );
              }

              if (hospitalId) {
                hospitals = await hospitalService.getHospitalInfoById(
                  userProgramData.hospitalId
                );
              }
            }

            users[_id] = {
              basicInfo,
              personalInfo,
              settings,
              insurance,
              documents,
              isProfileCompleted,
              isConsentFormUploaded,
              isIdProofUploaded,
              programId,
              programIds,
              status
            };
            countryCities = await cityCountryService.getCityCountryByIds([
              ...citiesId
            ]);

            data = {
              users: users,
              programs: programs,
              hospitals: hospitals,
              countryCities: countryCities,
              insuranceProviders: insuranceData,
              medicalsData: { [id]: medicalConditionData },
              medication: { [id]: medication },
              clinicalTestTemplates: { [programId]: clinicalTestTemplates },
              products: products,
              hospitalization,
              dispensation: dispensationObj,
              benefitPlan: benefitplanObj
            };
          }
          let response = new Response(true, 200);
          response.setData({
            ...data,
            contributionRequests: contributionRequestObj,
            charity: charityObj,
            charityDocuments: charityDocumentsObj
          });
          response.setMessage("Request Fetched successfully!");
          return res
            .status(response.getStatusCode())
            .send(response.getResponse());
        } else {
          console.log("No such user found");
          let response = new Response(false, 500);
          response.setError(errMessage.INTERNAL_SERVER_ERROR);
          return res.status(500).json(response.getResponse());
        }
      } else {
        console.log("Request id not passed");
        let response = new Response(false, 500);
        response.setError(errMessage.INTERNAL_SERVER_ERROR);
        return res.status(500).json(response.getResponse());
      }
    } catch (err) {
      console.log(err);
      let response = new Response(false, 500);
      response.setError(errMessage.INTERNAL_SERVER_ERROR);
      return res.status(500).json(response.getResponse());
    }
  }

  async rejectRequest(req, res) {
    try {
      let error = validationResult(req);
      if (!error.isEmpty()) {
        let response = new Response(false, 422);
        response.setError(error.mapped());
        return res.status(422).json(response.getResponse());
      }
      const { id, rejectReason, level } = req.body;
      //const { id, rejectReason, level } = req.body;
      let rejectedContributionRequest = await charitiesAppliedService.rejectContributionRequest(
        id,
        rejectReason,
        level
      );
      let rejectedContributionRequestObj = {};
      rejectedContributionRequestObj[
        rejectedContributionRequest._id
      ] = rejectedContributionRequest;
      let response = new Response(true, 200);
      response.setData({
        contributionRequests: rejectedContributionRequestObj
      });
      response.setMessage("Request Rejected Successfully!!!");
      return res.status(response.getStatusCode()).send(response.getResponse());
    } catch (err) {
      console.log(err);
      let response = new Response(false, 500);
      response.setError(errMessage.INTERNAL_SERVER_ERROR);
      return res.status(500).json(response.getResponse());
    }
  }

  async approveLevelRequest(req, res) {
    try {
      let error = validationResult(req);
      if (!error.isEmpty()) {
        let response = new Response(false, 422);
        response.setError(error.mapped());
        return res.status(422).json(response.getResponse());
      }
      const { id, level } = req.body;
      let nextLevel = "Level-" + (Number(level.split("-")[1]) + 1);
      //
      let approvedRequest = await charitiesAppliedService.approveLevelRequest(
        id,
        level,
        nextLevel
      );
      let approvedRequestObj = {};
      approvedRequestObj[approvedRequest._id] = approvedRequest;
      let response = new Response(true, 200);
      response.setData({
        contributionRequests: approvedRequestObj
      });
      response.setMessage("Request approved Successfully!!!");
      return res.status(response.getStatusCode()).send(response.getResponse());
    } catch (err) {
      console.log(err);
      let response = new Response(false, 500);
      response.setError(errMessage.INTERNAL_SERVER_ERROR);
      return res.status(500).json(response.getResponse());
    }
  }

  async uploadPOAndApproveRequest(req, res) {
    try {
      let error = validationResult(req);
      if (!error.isEmpty()) {
        let response = new Response(false, 422);
        response.setError(error.mapped());
        return res.status(422).json(response.getResponse());
      }
      const {
        userId,
        userData: { category }
      } = req.userDetails;
      console.log("req.body============= :", req.body);
      const {
        amount,
        date,
        po,
        poNumber,
        poType,
        products,
        prevProducts = {},
        data: { id: requestId, level }
      } = req.body;
      //console.log("AmounttTT: ", amount, date, po, data);

      const now = moment.now();
      let poDocs = [];
      po.forEach(poDoc => {
        poDocs.push({ file: poDoc, uploadedOn: now });
      });
      let poObject = {};
      let dispensation = {};
      poObject["amount"] = amount;
      poObject["generatedOn"] = date;
      poObject["uploadedBy"] = userId;
      poObject["docs"] = poDocs;
      poObject["poNumber"] = poNumber;
      poObject["poType"] = poType;
      poObject["products"] = products;
      let approvedRequest;
      if (category == USER_CATEGORY.CARE_COACH) {
        let contributionRequest = await charitiesAppliedService.getContributionRequest(
          requestId
        );
        const { levelApprovals } = contributionRequest;
        let numOfLevelApprovals = Object.keys(levelApprovals).length;
        let newCurrentLevel = [];
        let newLevelApprovals = {};
        for (let i = 1; i <= numOfLevelApprovals; i++) {
          let key = "Level-" + i;
          newCurrentLevel.push(key);
          newLevelApprovals[key] = "Approved";
        }

        approvedRequest = await charitiesAppliedService.uploadPOAndApproveRequestByCarecoach(
          {
            poObject,
            requestId,
            currentLevel: newCurrentLevel,
            levelApprovals: newLevelApprovals
          }
        );
        if (approvedRequest) {
          const { dispensationId } = approvedRequest;
          const dispensationData = await dispensationService.getDispensationById(
            dispensationId
          );
          const { products: dispensationProduct } = dispensationData;
          const dispensationProductsIds = Object.keys(dispensationProduct);
          const newProducts = {};
          dispensationProductsIds.forEach(id => {
            const { amount: dispensationAmount, packs: dispensationPacks } =
              dispensationProduct[id] || {};
            const { amount: prevAmount = 0, packs: prevPacks = 0 } =
              prevProducts[id] || {};
            const { amount: currentAmount = 0, packs: currentPacks = 0 } =
              products[id] || {};
            const newAmount =
              dispensationAmount -
              parseInt(prevAmount) +
              parseInt(currentAmount);
            const newPacks =
              dispensationPacks - parseInt(prevPacks) + parseInt(currentPacks);
            newProducts[id] = {
              amount: newAmount,
              packs: newPacks
            };
          });
          dispensation = await dispensationService.updateProducts(
            dispensationId,
            newProducts
          );
        }
      } else {
        approvedRequest = await charitiesAppliedService.uploadPOAndApproveRequest(
          {
            poObject,
            requestId,
            level
          }
        );
        if (approvedRequest) {
          const { dispensationId } = approvedRequest;
          const dispensationData = await dispensationService.getDispensationById(
            dispensationId
          );
          const { products: dispensationProduct } = dispensationData;
          const dispensationProductsIds = Object.keys(dispensationProduct);
          const newProducts = {};
          dispensationProductsIds.forEach(id => {
            const { amount: dispensationAmount, packs: dispensationPacks } =
              dispensationProduct[id] || {};
            const { amount: prevAmount = 0, packs: prevPacks = 0 } =
              prevProducts[id] || {};
            const { amount: currentAmount = 0, packs: currentPacks = 0 } =
              products[id] || {};
            const newAmount =
              dispensationAmount -
              parseInt(prevAmount) +
              parseInt(currentAmount);
            const newPacks =
              dispensationPacks - parseInt(prevPacks) + parseInt(currentPacks);
            newProducts[id] = {
              amount: newAmount,
              packs: newPacks
            };
          });
          dispensation = await dispensationService.updateProducts(
            dispensationId,
            newProducts
          );

          const { patientId, benefitId } = dispensation;

          const userData = await userService.getUserById(patientId);
          console.log("userData-------------- :", userData);
          const {
            basicInfo: { name } = {},
            personalInfo: { contactNo = {} } = {},
            programId = []
          } = userData;

          const userCareCoach = await programService.getCareCoachOfUser(
            patientId,
            programId[0]
          );
          const { careCoaches } = userCareCoach;
          const careCoachId = careCoaches[0].id || "";
          console.log("careCoachId----- :", careCoachId);
          const notificationData = {
            data: {
              _id: requestId,
              userId,
              eventType: NOTIFICATION_VERB.CHARITY_APPROVAL
            },
            eventIs: EVENT_IS.APPROVED
          };
          NotificationSdk.execute(careCoachId, notificationData);
        }
      }

      const { dispensationId } = approvedRequest;
      let approvedRequestObj = {};
      approvedRequestObj[approvedRequest._id] = approvedRequest;
      let response = new Response(true, 200);
      response.setData({
        contributionRequests: approvedRequestObj,
        dispensation: { [dispensationId]: dispensation }
      });
      response.setMessage("Request approved and PO Uploaded Successfully!!!");
      return res.status(response.getStatusCode()).send(response.getResponse());
    } catch (err) {
      console.log(err);
      let response = new Response(false, 500);
      response.setError(errMessage.INTERNAL_SERVER_ERROR);
      return res.status(500).json(response.getResponse());
    }
  }

  async requestReupload(req, res) {
    try {
      let error = validationResult(req);
      if (!error.isEmpty()) {
        let response = new Response(false, 422);
        response.setError(error.mapped());
        return res.status(422).json(response.getResponse());
      }
      const { comment, requestId, selectedDocId } = req.body;
      let contributionRequest = await charitiesAppliedService.requestReupload({
        comment,
        requestId,
        selectedDocId
      });
      let contributionRequestObj = {};
      contributionRequestObj[contributionRequest._id] = contributionRequest;
      let response = new Response(true, 200);
      response.setData({
        contributionRequests: contributionRequestObj
      });
      response.setMessage("Reupload request raised Successfully!!!");
      return res.status(response.getStatusCode()).send(response.getResponse());
    } catch (err) {
      console.log(err);
      let response = new Response(false, 500);
      response.setError(errMessage.INTERNAL_SERVER_ERROR);
      return res.status(500).json(response.getResponse());
    }
  }

  async addCharityApplied(req, res) {
    try {
      const { dispensationId } = req.params;
      const {
        selectedCharity,
        docs,
        userId,
        contributionsId,
        benefitId
      } = req.body;
      console.log("req.body===== :", req.body);

      const { Generic = {}, Charity = {} } = docs;
      const charityAppliedIds = [];
      const contributionRequestObj = {};
      for (const id of selectedCharity) {
        const data = {};
        data.charityId = id;
        data.patientId = userId;
        data.benefitPlanId = benefitId;
        data.dispensationId = dispensationId;
        data.status = BENEFITPLAN_STATUS.PENDING;
        data.currentLevel = ["Level-1"];
        data.levelApprovals = {};
        const users = await userService.getUserForCharity(id);
        users.forEach((user, index) => {
          data.levelApprovals[`Level-${index + 1}`] =
            BENEFITPLAN_STATUS.PENDING;
        });
        let charityDocs = { ...Generic };

        if (Charity[id]) {
          charityDocs = { ...charityDocs, ...Charity[id] };
        }
        let docIds = Object.keys(charityDocs);
        docIds.forEach(id => {
          charityDocs[id].shouldReupload = false;
          charityDocs[id].uploadedOn = moment.now();
        });

        data.charityDocs = charityDocs;
        // data.charityDocs = {
        //   docs: docs[id],
        //   shouldReupload: false,
        //   uploadedOn: moment().toISOString()
        // };
        console.log("data================ :", data);

        const contributionRequest = await charitiesAppliedService.createContributionRequest(
          data
        );
        const { _id } = contributionRequest;
        contributionRequestObj[_id] = contributionRequest;
        charityAppliedIds.push(_id);
      }
      console.log("charityAppliedIds----------------- :", charityAppliedIds);

      let dispensation = {};
      let contribution = {};
      if (charityAppliedIds.length > 0) {
        contribution = await contributionService.addCharityApplied(
          contributionsId,
          charityAppliedIds
        );
        dispensation = await dispensationService.addGenericDocs(
          dispensationId,
          Generic
        );
      }
      // let contributionRequest = await charitiesAppliedService.requestReupload({
      //   comment,
      //   requestId,
      //   selectedDocId
      // });
      let newDispensation = dispensation;
      newDispensation.contribution = contribution;
      let response = new Response(true, 200);
      response.setData({
        contributionRequests: contributionRequestObj,
        dispensation: { [dispensationId]: newDispensation }
      });
      response.setMessage("Successfully applied for charities!!!");
      return res.status(response.getStatusCode()).send(response.getResponse());
    } catch (err) {
      console.log(err);
      let response = new Response(false, 500);
      response.setError(errMessage.INTERNAL_SERVER_ERROR);
      return res.status(500).json(response.getResponse());
    }
  }

  async addInvoiceToContributionRequest(req, res) {
    try {
      const { invoiceData } = req.body;
      const { requestId } = req.params;
      const { userId } = req.userDetails;
      invoiceData.uploadedBy = userId;
      const result = await charitiesAppliedService.uploadInvoice({
        invoiceData,
        requestId
      });

      console.log("result====================== :", result);
      // const { _id: dispensationId, benefitId } = result;

      let response = new Response(true, 200);
      response.setData({
        contributionRequests: { [requestId]: result }
      });
      response.setMessage("Dispensation Added Successfully!!!");
      return res.status(response.getStatusCode()).send(response.getResponse());
    } catch (err) {
      console.log("err------------------- :", err);
      let response = new Response(false, 500);
      response.setError(errMessage.INTERNAL_SERVER_ERROR);
      return res.status(500).json(response.getResponse());
    }
  }

  async reuploadDocsOfContributionRequest(req, res) {
    try {
      const { docs, docId } = req.body;
      const { requestId } = req.params;
      const result = await charitiesAppliedService.ReUploadDoc({
        docs,
        docId,
        requestId
      });

      console.log("result====================== :", result);
      // const { _id: dispensationId, benefitId } = result;

      let response = new Response(true, 200);
      response.setData({
        contributionRequests: { [requestId]: result }
      });
      response.setMessage("Document Re-uploaded Successfully!!!");
      return res.status(response.getStatusCode()).send(response.getResponse());
    } catch (err) {
      console.log("err------------------- :", err);
      let response = new Response(false, 500);
      response.setError(errMessage.INTERNAL_SERVER_ERROR);
      return res.status(500).json(response.getResponse());
    }
  }
}

module.exports = new CharityAppliedController();
