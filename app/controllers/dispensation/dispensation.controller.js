const uuid = require("uuid/v4");
const dispensationService = require("../../services/dispensation/dispensation.service");
const contributionService = require("../../services/contributions/contribution.service");
const userService = require("../../services/user/user.service");
const programService = require("../../services/program/program.service");
const errMessage = require("../../../config/messages.json").errMessages;
const Log = require("../../../libs/log")("charityDocumentsController");
import {
  prepareMRLUserData,
  prepareMRLContributionData
} from "./dispensation.controllerHelper";

const Response = require("../../helper/responseFormat");
const cityCountryService = require("../../services/cityCountry/cityCountry.service");
const medicalConditionService = require("../../services/medicalCondition/medicalCondition.service");
const benefitPlanService = require("../../services/benefitPlan/benefitPlan.service");
const charityService = require("../../services/charity");
const charityAppliedservice = require("../../services/charitiesApplied/charitiesApplied.service");
const productService = require("../../services/product/product.service");
const insuranceService = require("../../services/insurance/insurance.service");
const { NotificationSdk } = require("../../notificationSdk");
import get from "lodash/get";
import {
  BENEFITPLAN_STATUS,
  NOTIFICATION_VERB,
  EVENT_IS
} from "../../../constant";

const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const { saveFileIntoUserBucket } = require("../user/userControllerHelper");
const minioService = require("../../services/minio/minio.service");
const md5 = require("js-md5");
const _ = require("lodash");
const moment = require("moment");
const mrlService = require("../../services/mrl/mrl.service");

class DispensationController {
  async editDispensation(req, res) {
    try {
      const { dispensationId } = req.params;
      const { dispensationData, contribution } = req.body;

      console.log("req.body------------------------- :", req.body);

      const result = await dispensationService.editDispensation(
        dispensationId,
        dispensationData
      );

      console.log("result====================== :", result);
      const { contributionsId } = result;
      const contributions = await contributionService.editContribution(
        contributionsId,
        contribution
      );

      console.log("contributions====================== :", contributions);
      let regenerateMRL = false;
      const { MRL = [] } = result;
      if (MRL.length > 0) {
        regenerateMRL = true;
        await dispensationService.makeRegenerateMRLTrue(dispensationId);
      }
      let response = new Response(true, 200);
      response.setData({
        dispensation: {
          [dispensationId]: {
            ...result,
            regenerateMRL,
            contribution: { ...contributions }
          }
        }
      });
      response.setMessage("Dispensation Edited Successfully!!!");
      return res.status(response.getStatusCode()).send(response.getResponse());
    } catch (err) {
      console.log("err------------------- :", err);
      let response = new Response(false, 500);
      response.setError(errMessage.INTERNAL_SERVER_ERROR);
      return res.status(500).json(response.getResponse());
    }
  }

  async createDispensation(req, res) {
    try {
      const { dispensationData, contribution = {} } = req.body;

      const result = await dispensationService.createdispensation(
        dispensationData,
        contribution
      );

      console.log("result====================== :", result);
      const { _id: dispensationId, benefitId, contributionsId } = result;
      const contributions = await contributionService.getContributionById(
        contributionsId
      );

      let response = new Response(true, 200);
      response.setData({
        dispensation: {
          [dispensationId]: { ...result._doc, contribution: contributions }
        },
        benefitId,
        dispensationId
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

  async addInvoiceToDispensation(req, res) {
    try {
      const { invoiceData, contributionType, dispensationId } = req.body;
      const { contributionsId } = req.params;
      const { userId } = req.userDetails;
      invoiceData.uploadedBy = userId;
      const result = await contributionService.addContributionInvoice({
        invoiceData,
        contributionType,
        contributionsId
      });

      console.log("result====================== :", dispensationId, result);
      // const { _id: dispensationId, benefitId } = result;

      let response = new Response(true, 200);
      response.setData({
        contribution: result,
        dispensationId: dispensationId
      });
      response.setMessage("Invoice Uploaded Successfully!!!");
      return res.status(response.getStatusCode()).send(response.getResponse());
    } catch (err) {
      console.log("err------------------- :", err);
      let response = new Response(false, 500);
      response.setError(errMessage.INTERNAL_SERVER_ERROR);
      return res.status(500).json(response.getResponse());
    }
  }

  async fetchMRLGenerationData(req, res) {
    try {
      const { dispensationId } = req.params;
      const code = uuid();
      const codeArray = code.split("-");
      const mrlCode = codeArray[0].toUpperCase();
      const dispensation = await dispensationService.getDispensationById(
        dispensationId
      );
      const { products = {}, benefitId, contributionsId } = dispensation;
      const userRelatedData = await prepareMRLUserData(benefitId);
      // console.log("userRelatedData================= :", userRelatedData);
      const data = await prepareMRLContributionData({
        contributionId: contributionsId,
        products
      });
      // console.log("data================== :", data);
      let response = new Response(true, 200);
      response.setData({
        mrlCode,
        ...userRelatedData,
        ...data
      });
      response.setMessage("Fetched MRLgenerationData!!!");
      return res.status(response.getStatusCode()).send(response.getResponse());
    } catch (err) {
      console.log("err------------------- :", err);
      let response = new Response(false, 500);
      response.setError(errMessage.INTERNAL_SERVER_ERROR);
      return res.status(500).json(response.getResponse());
    }
  }

  async getDispensationForPharmacyAdmin(req, res) {
    try {
      const { pharmacyId } = req.params;
      let dispensations = await dispensationService.getDispensationForPharmacyAdmin(
        pharmacyId
      );
      console.log("Disssss: ", dispensations);

      let dispensationObj = {};
      let usersObj = {};
      let programObj = {};
      for (let index = 0; index < dispensations.length; index++) {
        let dispensation = dispensations[index];
        dispensationObj[dispensation._id] = dispensation;
        if (dispensation.MRL && dispensation.MRL.length > 0) {
          let latestMRLID = dispensation.MRL[dispensation.MRL.length - 1];
          let MRLData = await mrlService.getMRL(latestMRLID);
          dispensationObj[dispensation._id]["MRLData"] = MRLData;
        }
        const { patientId } = dispensation;
        const patientInfo = await userService.getUserById(patientId);
        console.log("pat info: ", patientInfo);
        const { basicInfo, programId, personalInfo } = patientInfo;
        usersObj[patientId] = { basicInfo, programId, personalInfo };

        const programInfo = await programService.getProgram({ _id: programId });
        programObj[programId] = programInfo;
      }
      console.log("usersobjjj: ", usersObj);
      let response = new Response(true, 200);
      response.setData({
        dispensation: dispensationObj,
        users: usersObj,
        programs: programObj
      });
      response.setMessage("Dispensation Fetched Successfully!!!");
      return res.status(response.getStatusCode()).send(response.getResponse());
    } catch (err) {
      console.log("err------------------- :", err);
      let response = new Response(false, 500);
      response.setError(errMessage.INTERNAL_SERVER_ERROR);
      return res.status(500).json(response.getResponse());
    }
  }

  async getDispensationDetails(req, res) {
    try {
      const { dispensationId } = req.params;
      const dispensationData = await dispensationService.getDispensationById(
        dispensationId
      );

      const {
        _id,
        patientId,
        benefitId,
        contributionsId,
        products: dispensationProducts,
        MRL
      } = dispensationData;
      let users = {};
      let countryCities = {};
      let medicalConditionData = {};
      let benefitPlan = {};
      let dispensation = {};
      let contributionRequests = {};
      let charity = {};
      let products = {};
      let programs = {};
      let response;

      const userData = await userService.getUserById(patientId);
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
        const { _id } = basicInfo;

        const medicalCondition = await medicalConditionService.getMedicalsDetails(
          {
            userId: patientId
          }
        );
        if (medicalCondition.length > 0) {
          const {
            basicCondition,
            _id: medicalConditionId
          } = medicalCondition[0];

          medicalConditionData._id = medicalConditionId;
          medicalConditionData.basicCondition = basicCondition;
        }

        users[_id] = {
          basicInfo,
          personalInfo,
          programId
        };
        countryCities = await cityCountryService.getCityCountryByIds([
          ...citiesId
        ]);

        let benefitPlanResponse = await benefitPlanService.getBenefitPlanById(
          benefitId
        );
        benefitPlan[benefitId] = benefitPlanResponse;
        benefitPlan[benefitId].dispensation = [];
        benefitPlan[benefitId].dispensation.push(dispensationId);

        dispensation[dispensationId] = dispensationData;

        const contribution = await contributionService.getContributionById(
          contributionsId
        );

        if (contribution) {
          dispensation[dispensationId].contribution = { ...contribution };
          const { CharityApplied = [] } = contribution;
          for (const id of CharityApplied) {
            const charityAppliedData = await charityAppliedservice.getContributionRequest(
              id
            );
            contributionRequests[id] = charityAppliedData;
            const { charityId } = charityAppliedData;
            const charityData = await charityService.getCharityById(charityId);
            charity[charityId] = charityData;
          }
        }

        let dispensationProductsIds = Object.keys(dispensationProducts);
        let productsResponse = await productService.getProducts(
          dispensationProductsIds
        );
        productsResponse.forEach(product => {
          products[product._id] = product;
        });

        let patientProgram = await programService.getProgramsById(programId);
        let program = patientProgram[0];

        let insuranceData = {};
        const { insuranceProviders = [] } = program;
        const insuranceProvidersData = await insuranceService.getInsuranceProvidersById(
          insuranceProviders
        );
        if (insuranceProvidersData.length > 0) {
          insuranceProvidersData.forEach((ip, key) => {
            insuranceData[ip._id] = ip;
          });
        }
        programs = {
          [program._id]: {
            ...program,
            insuranceProviders: insuranceData
          }
        };

        if (MRL && MRL.length > 0) {
          let latestMRLID = MRL[MRL.length - 1];
          let MRLData = await mrlService.getMRL(latestMRLID);
          dispensation[dispensationId]["MRLData"] = MRLData;
        }

        response = new Response(true, 200);
        response.setData({
          users,
          benefitPlan,
          dispensation,
          charity,
          contributionRequests,
          products,
          programs,
          medicalsData: { [patientId]: medicalConditionData }
        });
      }
      return res.status(response.getStatusCode()).send(response.getResponse());
    } catch (err) {
      console.log("err------------------- :", err);
      let response = new Response(false, 500);
      response.setError(errMessage.INTERNAL_SERVER_ERROR);
      return res.status(500).json(response.getResponse());
    }
  }

  async markDispensationAsCompleted(req, res) {
    try {
      const { dispensationId } = req.params;

      const dispensation = await dispensationService.markDispensationAsCompleted(
        dispensationId
      );
      const { benefitId, patientId } = dispensation || {};

      let allDispensationComplete = false;
      let benefitPlan = {};
      if (benefitId) {
        const dispensations = await dispensationService.getdispensationByBenefitId(
          benefitId
        );
        console.log("dispensation------------------------- :", dispensation);
        let completedDispensationIds = [];
        dispensations.forEach(data => {
          const { status, _id } = data;
          console.log("data--------------- :", data);
          if (status === BENEFITPLAN_STATUS.COMPLETED) {
            completedDispensationIds.push(_id);
          }
        });
        console.log(
          "completedDispensationIds---------- :",
          completedDispensationIds
        );
        if (completedDispensationIds.length === dispensations.length) {
          allDispensationComplete = true;
          const plan = await benefitPlanService.markPlanAsComplete(benefitId);
          benefitPlan[benefitId] = plan;
        }
      }
      let response;
      response = new Response(true, 200);
      response.setData({
        dispensation: { [dispensationId]: dispensation },
        benefitPlan,
        allDispensationComplete,
        benefitId,
        patientId
      });

      return res.status(response.getStatusCode()).send(response.getResponse());
    } catch (err) {
      console.log("err---------------- :", err);
      let response = new Response(false, 500);
      response.setError(errMessage.INTERNAL_SERVER_ERROR);
      return res.status(500).json(response.getResponse());
    }
  }

  async generateMRL(req, res) {
    try {
      const { userId } = req.userDetails;
      const { dispensationId, mrlCode, pharmacy } = req.body;
      const dispensation = await dispensationService.getDispensationById(
        dispensationId
      );
      const { products = {}, benefitId, contributionsId } = dispensation;
      const userRelatedData = await prepareMRLUserData(benefitId);
      const releaseDate = moment().format("MM-DD-YYYY");
      const contributionData = await prepareMRLContributionData({
        contributionId: contributionsId,
        products
      });

      const {
        careCoachContactNum,
        patientContactNum,
        patientName,
        programId
      } = userRelatedData;
      const { oop = {}, coPay = {}, insurance = [], charity = [] } =
        contributionData.contribution || {};

      const doc = new PDFDocument();

      let writeStream = fs.createWriteStream(
        path.join(__dirname, "../../../mrl.pdf")
      );
      doc.pipe(writeStream); // write to PDF
      //doc.pipe(res);
      doc.image(path.join(__dirname, "../../../Logo.png"), 400, 40, {
        width: 100
      });
      doc
        .fillColor("#00a3e0")
        .text(
          "_________________________________________________________________"
        );
      doc.moveDown(2);

      doc
        .font("Times-Roman")
        .fillColor("#00a3e0")
        .fontSize(18)
        .text("Medication Release Letter");

      doc.fillColor("black").fontSize(10);
      doc.moveDown(2);
      doc.text("UNIQUE TICKET CODE: " + mrlCode);

      doc.moveDown(1);
      doc.font("Times-Bold").text("Dear Pharmacist,");
      doc.moveDown(1);
      doc.font("Times-Roman");
      doc.text(
        "Kindly dispense the below treatment to the following patient as indicated below in the patient information section."
      );
      doc.moveDown(2);
      doc.text(
        "If you have any queries, please do not hesitate to contact the IQVIA Patient Coordinator at " +
          careCoachContactNum
      );
      doc.moveDown(1);
      doc.text("Yours sincerely,");
      doc.moveDown(1);
      doc.text("IQVIA Patient Coordinator");
      doc.moveDown(2);
      doc.text("Signature: ____________________________________");

      doc.moveDown(2);

      doc
        .font("Times-Bold")
        .fontSize(13)
        .text("Patient Information:");
      doc.moveDown(1);
      doc.font("Times-Roman").fontSize(10);

      doc
        .font("Times-Bold")
        .text("Patient Program Id: ", { continued: true })
        .font("Times-Roman")
        .text(programId);
      doc.moveDown(1);

      doc
        .font("Times-Bold")
        .text("Patient Name: ", { continued: true })
        .font("Times-Roman")
        .text(patientName);
      doc.moveDown(1);

      doc
        .font("Times-Bold")
        .text("Patient Contact Number: ", { continued: true })
        .font("Times-Roman")
        .text(patientContactNum);
      doc.moveDown(1);

      doc.font("Times-Bold").text("Contributions:");
      doc.moveDown(1);
      if (oop.amount > 0) {
        doc.font("Times-Bold").text("Out Of Pocket Contribution");
        doc.moveDown(1);
        doc
          .font("Times-Roman")
          .text("Percentage: ", { continued: true })
          .text(oop.percent);
        doc.moveDown(1);
        doc
          .text("Amount($): ", { continued: true })
          .font("Times-Roman")
          .text(oop.amount);
        doc.moveDown(1);
        if (oop.products && oop.products.length > 0) {
          oop.products.forEach(product => {
            doc
              .text("Product Name: ", { continued: true })
              .text(product.productName);
            doc.moveDown(1);
            doc.text("Packs: ", { continued: true }).text(product.packs);
            doc.moveDown(1);
            doc.text("Amount($): ", { continued: true }).text(product.amount);
            doc.moveDown(1);
          });
        }
      }

      if (coPay.amount > 0) {
        doc.font("Times-Bold").text("Co Pay Contribution");
        doc.moveDown(1);
        doc
          .font("Times-Roman")
          .text("Percentage: ", { continued: true })
          .text(coPay.percent);
        doc.moveDown(1);
        doc
          .text("Amount($): ", { continued: true })
          .font("Times-Roman")
          .text(coPay.amount);
        doc.moveDown(1);
        if (coPay.products && coPay.products.length > 0) {
          coPay.products.forEach(product => {
            doc
              .text("Product Name: ", { continued: true })
              .text(product.productName);
            doc.moveDown(1);
            doc.text("Packs: ", { continued: true }).text(product.packs);
            doc.moveDown(1);
            doc.text("Amount($): ", { continued: true }).text(product.amount);
            doc.moveDown(1);
          });
        }
      }
      if (insurance.length > 0) {
        doc.font("Times-Bold").text("Insurance Contribution: ");
        doc.moveDown(1);
      }
      insurance.forEach(insuranceData => {
        doc
          .font("Times-Roman")
          .text("Insurance Provider Name: ", { continued: true })
          .text(insuranceData.insuranceName);
        doc.moveDown(1);
        doc
          .text("Percentage: ", { continued: true })
          .font("Times-Roman")
          .text(insuranceData.percent);
        doc.moveDown(1);
        doc
          .text("Amount($): ", { continued: true })
          .font("Times-Roman")
          .text(insuranceData.amount);
        doc.moveDown(1);
        insuranceData.products.forEach(product => {
          doc
            .text("Product Name: ", { continued: true })
            .text(product.productName);
          doc.moveDown(1);
          doc.text("Packs: ", { continued: true }).text(product.packs);
          doc.moveDown(1);
          doc.text("Amount($): ", { continued: true }).text(product.amount);
          doc.moveDown(1);
        });
      });

      if (charity.length > 0) {
        doc.font("Times-Bold").text("Charity Contribution: ");
        doc.moveDown(1);
      }
      charity.forEach(charityData => {
        doc
          .font("Times-Roman")
          .text("Charity Name: ", { continued: true })
          .text(charityData.charityName);
        doc.moveDown(1);
        doc
          .text("Percentage: ", { continued: true })
          .font("Times-Roman")
          .text(charityData.percent);
        doc.moveDown(1);
        doc
          .text("Amount($): ", { continued: true })
          .font("Times-Roman")
          .text(charityData.amount);
        doc.moveDown(1);
        charityData.products.forEach(product => {
          doc
            .text("Product Name: ", { continued: true })
            .text(product.productName);
          doc.moveDown(1);
          doc.text("Packs: ", { continued: true }).text(product.packs);
          doc.moveDown(1);
          doc.text("Amount($): ", { continued: true }).text(product.amount);
          doc.moveDown(1);
        });
      });

      doc
        .font("Times-Bold")
        .text("Release Date: ", { continued: true })
        .font("Times-Roman")
        .text(releaseDate);
      doc.moveDown(1);

      doc
        .font("Times-Bold")
        .text("Pharmacy Outlet:", { continued: true })
        .font("Times-Roman")
        .text(pharmacy.name);

      doc.moveDown(2);

      doc.font("Times-Bold").text("To Be filled By Patient: ");
      doc.moveDown(1);
      doc.font("Times-Roman");
      doc.text(
        "I, _________________________________________________ acknowledge receiving the medication as per the above details."
      );
      doc.moveDown(1);
      doc.text("Date: _______________________");
      doc.moveDown(2);
      doc.text("Patient Signature: ____________________________________");
      doc.moveDown(2);

      doc.font("Times-Bold").text("To Be filled By Pharmacist: ");
      doc.moveDown(1);
      doc.font("Times-Roman");
      doc.text(
        "I, _________________________________________________ acknowledge dispensing the medication as per the above details."
      );
      doc.moveDown(1);
      doc.text("Date: _______________________");
      doc.moveDown(2);
      doc.text("Pharmacist Signature: ____________________________________");

      doc.moveDown(2);
      doc
        .fontSize(14)
        .fillColor("#00a3e0")
        .text(
          "_________________________________________________________________"
        );
      doc.moveDown(1);
      doc
        .fontSize(10)
        .fillColor("#d4d7d9")
        .text(
          "Copyright Â© 2019 IQVIA. All Rights Reserved. Confidential and Proprietary.",
          200
        );

      doc.end();

      writeStream.on("finish", async function() {
        await minioService.createBucket();
        var file = path.join(__dirname, "../../../mrl.pdf");
        var fileStream = fs.createReadStream(file);
        let hash = md5.create();
        hash.update(req.userDetails.userId + uuid());
        hash.hex();
        hash = String(hash);
        const folder = "MRL";
        const fileExt = "pdf";
        const file_name = hash.substring(4) + "-MRL." + fileExt;
        const metaData = { "Content-Type": "application/pdf" };
        const fileUrl = folder + "/" + file_name;
        await minioService.saveBufferObject(fileStream, fileUrl, metaData);

        console.log("file urlll: ", fileUrl);

        const generatedOn = moment();
        const generatedBy = userId;
        const now = moment.now();
        let docs = [];
        docs.push({ file: fileUrl, uploadedOn: now });
        const mrl = await mrlService.createMRL(
          mrlCode,
          generatedOn,
          generatedBy,
          docs
        );
        const { _id: mrlId } = mrl;

        const dispensation = await dispensationService.addMRLToDispensation(
          dispensationId,
          pharmacy._id,
          mrlId
        );

        if (dispensation) {
          const { patientId, pharmacyId } = dispensation;
          const pharmacyAdminData = await userService.getUser({
            pharmacy: pharmacyId,
            category: "pharmacyAdmin"
          });
          const { _id: pharmacyAdminId } = pharmacyAdminData;
          // console.log(
          //   "pharmacyAdminData-------------- :",
          //   pharmacyId,
          //   pharmacyAdminId,
          //   pharmacyAdminData
          // );
          const notificationData = {
            data: {
              _id: dispensationId,
              userId,
              eventType: NOTIFICATION_VERB.MRL_GENERATION
            },
            eventIs: EVENT_IS.APPROVED
          };
          NotificationSdk.execute(patientId, notificationData);
          NotificationSdk.execute(pharmacyAdminId, notificationData);
        }

        let response = new Response(true, 200);
        response.setData({ dispensation: { [dispensationId]: dispensation } });
        response.setMessage("MRL sent Successfully!!!");
        return res
          .status(response.getStatusCode())
          .send(response.getResponse());
        // TO DO
        /*
                  1) Handle Notification Scenario
        
                */
      });
    } catch (error) {
      console.log("Errr: ", error);
      let response = new Response(false, 500);
      response.setError(errMessage.INTERNAL_SERVER_ERROR);
      return res.status(500).json(response.getResponse());
    }
  }

  async getMRL(req, res) {
    try {
      const { id } = req.params;
      const mrl = await mrlService.getMRL(id);
      let response = new Response(true, 200);
      response.setData({ mrl });
      response.setMessage("MRL fetched Successfully!!!");
      return res.status(response.getStatusCode()).send(response.getResponse());
    } catch (error) {
      console.log("Errr: ", error);
      let response = new Response(false, 500);
      response.setError(errMessage.INTERNAL_SERVER_ERROR);
      return res.status(500).json(response.getResponse());
    }
  }

  async getDispensationHistoryForPharmacyAdmin(req, res) {
    try {
      const { pharmacyId } = req.params;
      const dispensationHistoryData = await dispensationService.getDispensationHistoryForPharmacyAdmin(
        pharmacyId
      );
      let dispensation = {};
      let historyIds = [];
      let dispensationHistory = {};
      let usersObj = {};
      let programsObj = {};
      for (
        let historyIndex = 0;
        historyIndex < dispensationHistoryData.length;
        historyIndex++
      ) {
        const { _id, data, dispensationIds } = dispensationHistoryData[
          historyIndex
        ];
        historyIds.push(_id);
        dispensationHistory[_id] = dispensationIds;
        for (let index = 0; index < data.length; index++) {
          let dispensationData = data[index];
          const { patientId, _id } = dispensationData;
          dispensation[_id] = dispensationData;

          if (dispensationData.MRL && dispensationData.MRL.length > 0) {
            let latestMRLID =
              dispensationData.MRL[dispensationData.MRL.length - 1];
            let MRLData = await mrlService.getMRL(latestMRLID);
            dispensation[_id]["MRLData"] = MRLData;
          }

          const patientInfo = await userService.getUserById(patientId);
          const { basicInfo, programId, personalInfo } = patientInfo;
          usersObj[patientId] = { basicInfo, programId, personalInfo };

          const programInfo = await programService.getProgram({
            _id: programId
          });
          programsObj[programId] = programInfo;
        }
      }

      let response = new Response(true, 200);
      response.setData({
        dispensation,
        historyIds,
        dispensationHistory,
        users: usersObj,
        programs: programsObj
      });
      response.setMessage("Dispensation History fetched Successfully!!!");
      return res.status(response.getStatusCode()).send(response.getResponse());
    } catch (error) {
      console.log("Errr: ", error);
      let response = new Response(false, 500);
      response.setError(errMessage.INTERNAL_SERVER_ERROR);
      return res.status(500).json(response.getResponse());
    }
  }
}

module.exports = new DispensationController();
