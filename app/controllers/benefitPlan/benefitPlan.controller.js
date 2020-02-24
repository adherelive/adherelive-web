const { validationResult } = require("express-validator/check");
const Log = require("../../../libs/log")("benefitPLanController");
const errMessage = require("../../../config/messages.json").errMessages;
const minioService = require("../../services/minio/minio.service");
const benefitPlanService = require("../../services/benefitPlan/benefitPlan.service");
const dipensationService = require("../../services/dispensation/dispensation.service");
const contributionService = require("../../services/contributions/contribution.service");
const charityAppliedservice = require("../../services/charitiesApplied/charitiesApplied.service");
const { NotificationSdk } = require("../../notificationSdk");
const charityService = require("../../services/charity");
const userService = require("../../services/user/user.service");
const { ObjectId } = require("mongodb");

const Response = require("../../helper/responseFormat");
const _ = require("lodash");
const { Proxy_Sdk, EVENTS } = require("../../proxySdk");
import { saveFileIntoUserBucket } from "../user/userControllerHelper";
import {
  NOTIFICATION_VERB,
  EVENT_IS,
  BENEFITPLAN_STATUS,
  USER_CATEGORY
} from "../../../constant";
import { checkIfAllDocVerifed } from "./benefitPlan.controllerhelper";

class BenefitPlanController {
  constructor() {}

  async createBenefit(req, res) {
    try {
      let error = validationResult(req);
      if (!error.isEmpty()) {
        let response = new Response(false, 422);
        response.setError(error.mapped());
        return res.status(422).json(response.getResponse());
      }
      let { _id } = req.userDetails.userData;
      const { data } = req.body;

      console.log("data======================= :", data);
      let plan = await benefitPlanService.createBenefitPlan(data);
      console.log("plan====================== :", plan);
      const { _id: benefitId } = plan;
      const { dispensationNumber = 0, selectedProducts = [], userId } = data;
      let dispensationIds = [];
      let dispensation = {};
      for (let index = 0; index < dispensationNumber; index++) {
        const cycleData = {};
        cycleData.products = {};
        selectedProducts.forEach(product => {
          cycleData.products[product] = {
            packs: 0,
            amount: 0
          };
        });

        cycleData.benefitId = benefitId;
        cycleData.patientId = userId;
        const individualDispensation = await dipensationService.createdispensation(
          cycleData
        );
        const { _id: dispensationId } = individualDispensation;
        dispensationIds.push(dispensationId);
        dispensation[dispensationId] = individualDispensation;
      }
      let planObject = { ...plan._doc, dispensation: dispensationIds };
      // planObject.dispensation = dispensationIds;
      console.log(
        "planObject=================== :",
        dispensationIds,
        planObject,
        plan._doc
      );
      const benefitPlan = { [benefitId]: planObject };
      console.log("benefitPlan---------------- :", benefitPlan);
      let response = new Response(true, 200);
      response.setData({
        benefitPlan,
        dispensation,
        userId,
        benefitId,
        users: {
          [userId]: {
            activePlan: benefitId
          }
        }
      });
      response.setMessage("Benefit Plan created successfully");
      return res.send(response.getResponse());
    } catch (error) {
      Log.debug(error);
      let payload;
      switch (error.message) {
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
      }
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async getBenefitPlanOfUser(req, res) {
    try {
      const { userId } = req.params;
      let fetchedBenefitPlan;
      let benefitPlan = {};
      let activePlan;
      let benefitPlanHistory = [];
      let benefitIds = [];
      fetchedBenefitPlan = await benefitPlanService.getBenefitPlanOfUser(
        userId
      );

      // console.log("fetchedBenefitPlan============== :", fetchedBenefitPlan);
      fetchedBenefitPlan.forEach(plan => {
        const { _id, status } = plan;
        benefitIds.push(_id);
        benefitPlan[_id] = { ...plan };
        benefitPlan[_id].dispensation = [];
        if (status === BENEFITPLAN_STATUS.PENDING) {
          activePlan = _id;
        } else {
          benefitPlanHistory.push(_id);
        }
      });

      const dispensationData = await dipensationService.getdispensationForBenefitIds(
        benefitIds
      );
      let dispensation = {};
      let contributionRequests = {};
      let charity = {};
      if (dispensationData) {
        for (const data of dispensationData) {
          const { _id, benefitId: cycleBenefitId, contributionsId } = data;
          benefitPlan[cycleBenefitId].dispensation.push(_id);
          dispensation[_id] = { ...data };
          const contribution = await contributionService.getContributionById(
            contributionsId
          );

          console.log("dispensationData-------------- :", contribution);
          if (contribution) {
            dispensation[_id].contribution = { ...contribution };
            const { CharityApplied = [] } = contribution;
            for (const id of CharityApplied) {
              const charityAppliedData = await charityAppliedservice.getContributionRequest(
                id
              );
              contributionRequests[id] = charityAppliedData;
              const { charityId } = charityAppliedData;
              const charityData = await charityService.getCharityById(
                charityId
              );
              charity[charityId] = charityData;
            }
          }
        }
      }
      console.log(
        "dispensation=========== :",
        dispensation,
        benefitPlan,
        charity,
        contributionRequests
      );

      let response = new Response(true, 200);
      response.setData({
        benefitPlan,
        dispensation,
        charity,
        contributionRequests,
        users: {
          [userId]: {
            activePlan: activePlan,
            benefitPlanHistory: benefitPlanHistory
          }
        }
      });
      response.setMessage(`BenefitPlan fetched successfully`);
      return res.send(response.getResponse());
    } catch (error) {
      console.log("error=============== :", error);
      Log.debug(error);
      let payload;
      switch (error.message) {
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
      }
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async uploadDoc(req, res) {
    let response;
    try {
      // console.log("req.file---------------- :", req.file);
      const files = await saveFileIntoUserBucket({
        service: minioService,
        file: req.file,
        userId: req.userDetails.userId
      });

      response = new Response(true, 200);
      response.setData({
        files: files
      });
      response.setMessage("Docs uploaded successfully!");
      return res.status(response.getStatusCode()).send(response.getResponse());
    } catch (err) {
      console.log("err-------------------- :", err);
      throw new Error("error in saving document");
    }
  }

  async addBenefitDocuments(req, res) {
    try {
      const { benefitId } = req.params;
      const { data } = req.body;
      const { userId } = req.userDetails;
      const { documentId, files } = data;
      const { _id, category } = req.userDetails.userData;
      const docData = {
        files: files,
        isVerified: category === USER_CATEGORY.CARE_COACH ? true : false,
        uploadedBy: _id
      };

      // checking if after adding this doc if all docs are verifed
      let benefitDocumentsVerified = false;
      const benefitPlan = await benefitPlanService.getBenefitPlanById(
        benefitId
      );
      const { benefitDocs = {}, userId: patientId } = benefitPlan;
      const dataTOcheck = { ...benefitDocs };
      dataTOcheck[documentId] = { ...docData };
      if (patientId) {
        benefitDocumentsVerified = await checkIfAllDocVerifed(
          patientId,
          dataTOcheck,
          null
        );
        if (benefitDocumentsVerified) {
          const notificationData = {
            data: {
              _id: benefitId,
              userId,
              eventType: NOTIFICATION_VERB.BENEFIT_DOCS_VERIFIED
            },
            eventIs: EVENT_IS.APPROVED
          };
          NotificationSdk.execute(patientId, notificationData);
        }
      }
      // console.log(
      //   "benefitDocumentsVerified======== :",
      //   benefitDocumentsVerified
      // );
      //
      const result = await benefitPlanService.updateBenefitDoc({
        benefitId,
        docId: documentId,
        data: docData,
        allDocsVerified: benefitDocumentsVerified
      });
      // console.log("result===================== :", result);
      let response = new Response(true, 200);
      response.setData({
        benefitPlan: { [benefitId]: { ...result } }
      });
      response.setMessage(`BenefitPlan document added successfully`);
      return res.send(response.getResponse());
    } catch (error) {
      Log.debug(error);
      let payload;
      switch (error.message) {
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
      }
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async verifyBenefitDocuments(req, res) {
    try {
      const { benefitId } = req.params;
      const { data } = req.body;
      const { documentId } = data;

      const { userId } = req.userDetails;
      let benefitDocumentsVerified = false;
      const benefitPlan = await benefitPlanService.getBenefitPlanById(
        benefitId
      );
      const { benefitDocs = {}, userId: patientId } = benefitPlan;

      // checking if after adding this doc if all docs are verifed
      if (patientId) {
        benefitDocumentsVerified = await checkIfAllDocVerifed(
          patientId,
          benefitDocs,
          documentId
        );
      }
      // console.log(
      //   "benefitDocumentsVerified======== :",
      //   benefitDocumentsVerified
      // );
      //-----------------------------------
      if (benefitDocumentsVerified) {
        const notificationData = {
          data: {
            _id: benefitId,
            userId,
            eventType: NOTIFICATION_VERB.BENEFIT_DOCS_VERIFIED
          },
          eventIs: EVENT_IS.APPROVED
        };
        NotificationSdk.execute(patientId, notificationData);
      }

      const result = await benefitPlanService.verifyBenefitDoc({
        benefitId,
        docId: documentId,
        allDocsVerified: benefitDocumentsVerified
      });
      console.log("result===================== :", result);
      let response = new Response(true, 200);
      response.setData({
        benefitPlan: { [benefitId]: { ...result } }
      });
      response.setMessage(`BenefitPlan fetched successfully`);
      return res.send(response.getResponse());
    } catch (error) {
      Log.debug(error);
      let payload;
      switch (error.message) {
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
      }
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async editBenefitPlanSummary(req, res) {
    try {
      const { benefitId } = req.params;
      const { data } = req.body;

      console.log("data===================== :", data);
      const benefitPlan = await benefitPlanService.editBenenfitSummary(
        benefitId,
        data
      );
      let response = new Response(true, 200);
      response.setData({
        benefitPlan: { [benefitId]: benefitPlan }
      });
      response.setMessage(`BenefitPlan fetched successfully`);
      return res.send(response.getResponse());
    } catch (error) {
      console.log("error=============== :", error);
      Log.debug(error);
      let payload;
      switch (error.message) {
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
      }
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }
}

module.exports = new BenefitPlanController();
