const _ = require("lodash");
const path = require("path");
import isEmpty from "lodash/isEmpty";
import intersection from "lodash/intersection";
const { ObjectId } = require("mongodb");
import { forEach } from "async";
const cityCountryService = require("../../services/cityCountry/cityCountry.service");
const programService = require("../../services/program/program.service");
const productService = require("../../services/product/product.service");
const userService = require("../../services/user/user.service");
const hospitalService = require("../../services/hospital/hospital.service");
const Log = require("../../../libs/log")("programController");
const Response = require("../../helper/responseFormat");
const { validationResult } = require("express-validator/check");
//const rbac = require("../../helper/rbac");
const errMessage = require("../../../config/messages.json").errMessages;
const constants = require("../../../config/constants");
import {
  formatDoctorData,
  formatPatientData,
  formatPatientDoctorData
} from "./program.controllerHelper";
import { USER_CATEGORY, USER_STATUS } from "../../../constant";

class ProgramController {
  constructor() {}

  /**
   * @api {POST} /add-program Adds Program
   * @apiName addProgram
   * @apiGroup Program
   * @apiVersion 1.0.0
   *
   *
   * @apiSuccess (200) {json} Status Success status
   *
   * @apiParam {String} name Name of the program.
   * @apiParam {String} pharmaCo Name of the pharma company associated with the program.
   * @apiParam {targetLocationObject} targetLocation Location at which program will be initiated.
   * @apiParam {String} targetLocation.city City at which program will be initiated.
   * @apiParam {String} targetLocation.country Country at which program will be initiated.
   * @apiParam {String} description Description of the program.
   * @apiParam {Date} activeFrom Starting date of the program.
   * @apiParam {Date} expiresOn Ending date of the program.
   * @apiParam {String} accessLevel Defines who can access the program.
   * @apiParam {ObjectId[]} products List of products involved in the program.
   * @apiParam {ObjectId[]} doctors List of doctors involved in the program.
   * @apiParam {ObjectId[]} careCoaches List of care coaches involved in the program.
   *
   *
   * @apiParamExample {json} Request-Example:
   * {
   *	"name": "Pakinson's effect on bones",
   *    "pharmaCo": "Mega Labs",
   *    "targetLocation": {
   *    	"city": "Dubai",
   *    	"country": "UAE"
   *    },
   *    "description": "Default program",
   *    "activeFrom": "2019-1-1",
   *    "expiresOn": "2021-12-31",
   *    "products": ["5c0e238542e17a008c32008b", "5c0e238542e17a008c32008b"],
   *    "accessLevel": 1,
   *    "doctors": [{
   *        "id": "5c0e238542e17a008c32008b",
   *        "patients": {[]}
   *    }],
   *    "careCoaches": [{
   *        "id": "5c0e238542e17a008c32008c",
   *        "patients": {[]}
   *    }],
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "status": true,
   *   "statusCode": 200,
   *   "payload": {
   *     "data": {},
   *     "message": "Your Program is created."
   *   }
   * }
   *
   * @apiErrorExample {json} Cookies-Not-Set-Response:
   * {
   *    "status": false,
   *    "statusCode": 401,
   *    "payload": {
   *        "error": {
   *           "status": "COOKIES_NOT_SET",
   *           "message": "Can't process your request, cookies are not set. Please sign in again."
   *        }
   *    }
   * }
   *
   * @apiErrorExample {json} Unauthorized-Program-Creation-Response:
   * {
   *    "status": false,
   *    "statusCode": 401,
   *    "payload": {
   *        "error": {
   *            "status": "PROGRAM_ADDITION_NOT_PERMISSIBLE",
   *            "message": "You are not authorized to add a program."
   *        }
   *    }
   * }
   *
   * @apiErrorExample {json} Server-Error-Response:
   * {
   *    "status": false,
   *    "statusCode": 500,
   *    "payload": {
   *        "error": {
   *           "status": "INTERNAL_SERVER_ERROR",
   *           "message": "Something went wrong. Please sign in and try again."
   *        }
   *    }
   * }
   *
   */
  async addProgram(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let response = new Response(false, 422);
      response.setError(errors.mapped());
      return res.status(422).json(response.getResponse());
    }
    try {
      // TODO: When adding flow for program creation
      // const can = await rbac.can(
      //   req.userDetails.userData.category,
      //   "add",
      //   "programs"
      // );
      // if (!can) {
      //   throw new Error(constants.PROGRAM_ADDITION_NOT_PERMISSIBLE);
      // }
      if (req.userDetails.exists) {
        const {
          name,
          pharmaCo,
          targetLocation,
          description,
          activeFrom,
          expiresOn,
          products,
          accessLevel,
          doctors,
          careCoaches
        } = req.body;
        let program = await programService.addProgram({
          name,
          programCreatedBy: req.userDetails.userId,
          pharmaCo,
          targetLocation,
          description,
          activeFrom,
          expiresOn,
          products,
          accessLevel,
          doctors,
          careCoaches
        });
        Log.info(program);
        // TODO: send invitation to all the users

        let insertDoctors = doctors.map(doctor => {
          return {
            updateOne: {
              filter: { _id: doctor },
              update: { $push: { programId: program._id } }
            }
          };
        });

        let insertCareCoaches = careCoaches.map(careCoach => {
          return {
            updateOne: {
              filter: { _id: careCoach },
              update: { $push: { programId: program._id } }
            }
          };
        });

        let updateQueries = [...insertDoctors, ...insertCareCoaches];

        await userService.bulkUpdateUsers(updateQueries);

        let response = new Response(true, 200);
        response.setData({});
        response.setMessage("Your Program is created.");
        return res.send(response.getResponse());
      } else {
        throw new Error(constants.COOKIES_NOT_SET);
      }
    } catch (err) {
      Log.debug(err);
      let payload;
      switch (err.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 403,
            error: errMessage.COOKIES_NOT_SET
          };
          break;
        case constants.PROGRAM_ADDITION_NOT_PERMISSIBLE:
          payload = {
            code: 401,
            error: errMessage.PROGRAM_ADDITION_NOT_PERMISSIBLE
          };
          break;
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }

      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  /**
   * @api {POST} /add-to-program Adds to Program
   * @apiName addToProgram
   * @apiGroup Program
   * @apiVersion 1.0.0
   *
   *
   * @apiSuccess (200) {json} Status Success status
   *
   * @apiParam {ObjectId} programId Program in which additions are to be made.
   * @apiParam {String} additionType Type of the object to be added (doctor, careCoach, product).
   * @apiParam {ObjectId[]} objectsToAdd List of objects to be added in the program.
   *
   *
   * @apiParamExample {json} Request-Example:
   * {
   * 	 "programId":"5c14a70ba3cb9300b32161d4",
   *	 "additionType": "product",
   *	 "objectsToAdd": ["5c0e238542e17a008c32008b", "5c0e238542e17a008c32008c"]
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "status": true,
   *   "statusCode": 200,
   *   "payload": {
   *     "data": {},
   *     "message": "Products added"
   *   }
   * }
   *
   * @apiErrorExample {json} Cookies-Not-Set-Response:
   * {
   *    "status": false,
   *    "statusCode": 401,
   *    "payload": {
   *        "error": {
   *           "status": "COOKIES_NOT_SET",
   *           "message": "Can't process your request, cookies are not set. Please sign in again."
   *        }
   *    }
   * }
   *
   * @apiErrorExample {json} Unauthorized-Program-Creation-Response:
   * {
   *    "status": false,
   *    "statusCode": 401,
   *    "payload": {
   *        "error": {
   *            "status": "PROGRAM_ADDITION_NOT_PERMISSIBLE",
   *            "message": "You are not authorized to add to this program."
   *        }
   *    }
   * }
   *
   * @apiErrorExample {json} Server-Error-Response:
   * {
   *    "status": false,
   *    "statusCode": 500,
   *    "payload": {
   *        "error": {
   *           "status": "INTERNAL_SERVER_ERROR",
   *           "message": "Something went wrong. Please sign in and try again."
   *        }
   *    }
   * }
   *
   */

  async addToProgram(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let response = new Response(false, 422);
      response.setError(errors.mapped());
      return res.status(422).json(response.getResponse());
    }
    try {
      // TODO: When adding flow for program creation
      // const can = await rbac.can(
      //   req.userDetails.userData.category,
      //   "add",
      //   "programs"
      // );
      // if (!can) {
      //   throw new Error(constants.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE);
      // }
      if (req.userDetails.exists) {
        const { programId, additionType, objectsToAdd } = req.body;
        switch (additionType) {
          case "doctor":
            objectsToAdd = objectsToAdd.map(object => {
              return { id: object };
            });
            await programService.addtoArray(
              { _id: programId },
              "doctors",
              objectsToAdd
            );
            break;

          case "careCoach":
            objectsToAdd = objectsToAdd.map(object => {
              return { id: object };
            });
            await programService.addtoArray(
              { _id: programId },
              "careCoaches",
              objectsToAdd
            );
            break;

          case "product":
            await programService.addtoArray(
              { _id: programId },
              "products",
              objectsToAdd
            );
            break;
        }
        if (additionType != "product") {
          let updateQueries = objectsToAdd.map(id => {
            return {
              updateOne: {
                filter: { _id: id },
                update: { $push: { programId: { $each: programId } } }
              }
            };
          });
          await userService.bulkUpdateUsers(updateQueries);
        }
        let response = new Response(true, 200);
        response.setData({});
        response.setMessage(`${additionType}s added`);
        return res.send(response.getResponse());
      } else {
        throw new Error(constants.COOKIES_NOT_SET);
      }
    } catch (err) {
      let payload;
      switch (err.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 403,
            error: errMessage.COOKIES_NOT_SET
          };
          break;
        case constants.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE:
          payload = {
            code: 401,
            error: errMessage.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE
          };
          break;
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }

      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async getPrograms(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let response = new Response(false, 422);
      response.setError(errors.mapped());
      return res.status(422).json(response.getResponse());
    }
    try {
      const { body: formData, userDetails = {} } = req;
      const {
        userData: { programId = [], category = "" } = {},
        userId
      } = userDetails;

      const programList = await programService.getProgramsById(programId);
      let products = {};
      let programs = {};
      if (category === USER_CATEGORY.DOCTOR) {
        const programDoctors = await programService.getProgramDoctorsData(
          programId
        );

        const { doctors } = programDoctors[0];

        const userData = doctors.filter(doctor => {
          const { _id } = doctor;
          if (JSON.stringify(_id) === JSON.stringify(userId)) return true;
          return false;
        });
        let patientList = [];
        const { patients: patientsData } = userData[0];
        forEach(patientsData, function(patient) {
          patientList.push(patient._id);
        });

        const patientData = await userService.getAllUser(
          {
            _id: { $in: patientList },
            category: "patient"
          },
          "name email category  programId,_id"
        );
        const patients = patientData.map(patient => {
          const {
            basicInfo: { _id }
          } = patient;
          return _id;
        });
        programs = {
          [programId]: { ...programList[0], patients: patients }
        };
      } else {
        for (const value of programList) {
          const patientData = await userService.getAllUser(
            {
              programId: { $in: [value._id] },
              category: "patient"
            },
            "name email category  programId,_id"
          );

          if (!isEmpty(value.products)) {
            const productsData = await productService.bulkFindProducts(
              value.products
            );
            if (!isEmpty(productsData))
              productsData.forEach(product => {
                const { _id } = product;
                products = { ...products, [_id]: product };
              });
          }

          const patients = patientData.map(patient => {
            const {
              basicInfo: { _id }
            } = patient;
            return _id;
          });
          programs = {
            ...programs,
            [value._id]: { ...value, patients: patients }
          };
        }
      }

      let response = new Response(true, 200);
      response.setData({ programs, products });
      response.setMessage("Program Data Added");
      return res.send(response.getResponse());
    } catch (err) {
      console.log("err===========", err);
      let payload;
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async getProgramDoctors(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let response = new Response(false, 422);
      response.setError(errors.mapped());
      return res.status(422).json(response.getResponse());
    }
    try {
      const programId = req.params.programId;
      let programDoctorsData = await programService.getProgramDoctors(
        programId
      );
      let users = {};
      programDoctorsData.forEach(user => {
        if (user.isProfileCompleted) {
          users[user._id] = user;
        }
      });
      let response = new Response(true, 200);
      response.setData({ users });
      response.setMessage("Program Data Added");
      return res.send(response.getResponse());
    } catch (err) {
      let payload;
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async getProgramEntities(req, res) {
    try {
      let error = validationResult(req);
      let response;
      if (!error.isEmpty()) {
        response = new Response(false, 422);
        response.setError(error.mapped());
        return res.status(422).json(response.getResponse());
      }

      if (req.userDetails.exists) {
        const entityList = {
          patients: "patient",
          doctors: "doctor",
          careCoaches: "careCoach",
          programAdmins: "programAdmin",
          superAdmins: "superAdmin"
        };
        let { programId, entity } = req.params;
        const { filterBy = "", sortBy = "", q, status } = req.query;

        entity = entityList[entity];

        let accessable_programIds = req.userDetails.userData.programId;
        response = new Response(true, 200);
        if (isEmpty(programId)) {
          response.setData({});
          response.setMessage("No programId passed!!");
          return res.send(response.getResponse());
        }

        if (isEmpty(entity)) {
          response.setData({});
          response.setMessage("No entity passed!!");
          return res.send(response.getResponse());
        }

        if (isEmpty(accessable_programIds)) {
          response.setData({});
          response.setMessage("Unauthorized to access the programs!!");
          return res.send(response.getResponse());
        }

        accessable_programIds = accessable_programIds.map(value => {
          return value.toString();
        });

        if (typeof programId != "object") {
          programId = [programId];
        }

        if (
          programId.length !=
          intersection(programId, accessable_programIds).length
        ) {
          response.setData({});
          response.setMessage("Unauthorized to access the programs!!");
          return res.send(response.getResponse());
        }

        const userCategory = req.userDetails.userData.category;

        let hospitalsIds = new Set();
        let enitityData;
        let users = {};

        if (userCategory === USER_CATEGORY.DOCTOR) {
          let hospitalId;
          let patientList = [];
          let users = {};
          let programIds = [];

          const doctorId = req.userDetails.userId;
          const programDoctors = await programService.getProgramDoctorsData(
            programId
          );
          const { doctors } = programDoctors[0];

          const userData = doctors.filter(doctor => {
            const { _id } = doctor;
            if (JSON.stringify(_id) === JSON.stringify(doctorId)) return true;
            return false;
          });

          const { patients } = userData[0];
          forEach(patients, function(patient) {
            patientList.push(patient._id);
            hospitalId = patient.hospital;
            hospitalsIds.add(ObjectId(hospitalId));
          });

          programIds.push({
            id: programId[0],
            doctor: doctorId,
            hospitalId: hospitalId
          });

          let enitityData = await userService.getAllUser(
            {
              _id: { $in: patientList },
              category: entity
            },
            "name email category  programId status visitingHospitals profilePicLink dob gender contactNo createdAt",
            {
              filterBy,
              sortBy
            },
            { q, status }
          );

          const doctorDetails = await userService.getUserById(doctorId);
          users = {
            ...users,
            [doctorId]: {
              basicInfo: doctorDetails.basicInfo,
              work: doctorDetails.work,
              personalInfo: doctorDetails.personalInfo
            }
          };

          for (let key in enitityData) {
            const value = enitityData[key];
            const { basicInfo, personalInfo, status } = value;
            const { _id } = basicInfo;
            users = {
              ...users,
              [_id]: {
                basicInfo,
                personalInfo,
                status,
                programIds
              }
            };
          }
          response.setData({
            users: users,
            programs: { [programId[0]]: { patients: patientList } }
          });
          response.setMessage(`${patientList.length} patient(S) found !!`);
        } else {
          enitityData = await userService.getAllUser(
            {
              programId: { $in: programId },
              category: entity
            },
            "name email category  programId status  visitingHospitals profilePicLink dob gender contactNo createdAt documents",
            {
              filterBy,
              sortBy
            },
            { q, status }
          );
          console.log("enitityData---", filterBy, sortBy);
          if (filterBy !== "" && isEmpty(enitityData)) {
            response.setData({ programs: { [programId]: { patients: [] } } });
            response.setMessage(`no ${entity} found !!`);
            return res.send(response.getResponse());
          }
          if (isEmpty(enitityData)) {
            response.setData({});
            response.setMessage(`no ${entity} found !!`);
            return res.send(response.getResponse());
          }
          let patientList = [];

          if (entity === USER_CATEGORY.PATIENT) {
            for (let key in enitityData) {
              const value = enitityData[key];
              const { basicInfo, personalInfo, status, documents } = value;
              const { _id } = basicInfo;

              patientList.push(_id);
              const doctorData = await programService.getDoctorOfUser(
                _id,
                programId[0]
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
                const doctorDetails = await userService.getUserById(doctorId);
                users = {
                  ...users,
                  [doctorId]: {
                    basicInfo: doctorDetails.basicInfo,
                    work: doctorDetails.work,
                    personalInfo: doctorDetails.personalInfo
                  }
                };
                forEach(patients, function(patient) {
                  if (JSON.stringify(patient._id) === JSON.stringify(_id)) {
                    hospitalId = patient.hospital;
                    hospitalsIds.add(ObjectId(hospitalId));
                  }
                });
              }
              programIds.push({
                id: programId[0],
                doctor: doctorId,
                hospitalId: hospitalId
              });

              users = {
                ...users,
                [_id]: {
                  basicInfo,
                  personalInfo,
                  status,
                  programIds,
                  documents
                }
              };
            }
            response.setData({
              users: users,
              programs: { [programId[0]]: { patients: patientList } }
            });
            response.setMessage(`${patientList.length} patient(S) found !!`);
          }
        }
        if (entity === USER_CATEGORY.DOCTOR) {
          let hospitals = {};
          for (let key in enitityData) {
            const value = enitityData[key];
            const { basicInfo, personalInfo, visitingHospitals } = value;
            const { _id } = basicInfo;
            users = {
              ...users,
              [_id]: {
                basicInfo,
                personalInfo,
                visitingHospitals
              }
            };
            visitingHospitals.forEach(val => {
              hospitalsIds.add(ObjectId(val));
            });
          }
          response.setData({ users: users });
          response.setMessage(`${enitityData.length} doctor(S) found !!`);
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

        response.addData({ hospitals: hospitals });
        return res.send(response.getResponse());
      } else {
        response = new Response(true, 200);
        response.setData({});
        response.setMessage("Unauthorized to access the programs!!");
        return res.send(response.getResponse());
      }
    } catch (err) {
      let payload;
      switch (err.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 403,
            error: errMessage.COOKIES_NOT_SET
          };
          break;
        case constants.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE:
          payload = {
            code: 401,
            error: errMessage.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE
          };
          break;
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }

      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async getProgramsById(req, res) {
    try {
      let error = validationResult(req);
      let response;
      if (!error.isEmpty()) {
        response = new Response(false, 422);
        response.setError(errors.mapped());
        return res.status(422).json(response.getResponse());
      }
      if (req.userDetails.exists) {
        let { programId } = req.params;
        const userProgramIds = req.userDetails.userData.programId;
        if (userProgramIds.indexOf(programId.toString()) < 0) {
          const response = new Response(false, 403);
          response.setError({ error: "Page not accessible" });
          return res.status(403).json(response.getResponse());
        }
        response = new Response(true, 200);
        let programs = {};
        let products = {};
        let programData = await programService.getProgramsById(programId);
        if (!isEmpty(programData)) {
          programs = { ...programs, [programId]: programData[0] };
          if (!isEmpty(programData[0].products)) {
            const productsData = await productService.bulkFindProducts(
              programData[0].products
            );
            if (!isEmpty(productsData))
              productsData.forEach(product => {
                const { _id } = product;
                products = { ...products, [_id]: product };
              });
          }
          response.setData({ programs: programs, products: products });
          response.setMessage("programs found successfully!!");
          return res.send(response.getResponse());
        }
        response.setData({});
        response.setMessage("no programs found!!");
        return res.send(response.getResponse());
      } else {
        response = new Response(true, 200);
        response.setData({});
        response.setMessage("Unauthorized to access the programs!!");
        return res.send(response.getResponse());
      }
    } catch (err) {
      let payload;
      switch (err.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 403,
            error: errMessage.COOKIES_NOT_SET
          };
          break;
        case constants.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE:
          payload = {
            code: 401,
            error: errMessage.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE
          };
          break;
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }

      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async getProgramPatients(req, res) {
    try {
      let response;
      const { query: { filterBy, sortBy } = {} } = req;
      const { programId } = req.params;
      console.log("filterBy, sortBy=================>", filterBy, sortBy);
      const programPatientData = await programService.getProgramPatients(
        programId,
        filterBy,
        sortBy
      );
      // console.log('programPatientData', programPatientData)
      const doctorsData = await programService.getProgramDoctorsData(programId);

      const alldoctors = doctorsData.length > 0 ? doctorsData[0].doctors : [];

      const patientDoctorDataFormat = formatPatientDoctorData(alldoctors);

      const {
        patientsDoctor = {},
        doctorsIds = {},
        hospitalId = {}
      } = patientDoctorDataFormat;

      const doctorId = [...doctorsIds];

      const hospitalIds = [...hospitalId];

      const doctorData = await userService.getDoctorDataforBatch(doctorId);
      // console.log('doctorData', doctorData)
      const formatedDoctordata = await formatDoctorData(doctorData);

      const hospitalData = await hospitalService.getHospitalDataForBatch(
        hospitalIds
      );
      // console.log("formatedDoctordata", hospitalData);

      const formatedData = await formatPatientData(
        programPatientData,
        patientsDoctor
      );
      const { users, patients } = formatedData;

      doctorId.forEach(id => {
        users[id] = formatedDoctordata[id];
      });
      // console.log("users", users);
      const hospitals = hospitalData;
      // console.log("*****",hospitals)
      const data = {
        users: users,
        hospitals: hospitals,
        patients: patients
      };
      response = new Response(true, 200);
      response.setData({
        ...data
      });
      return res.send(response.getResponse());
      // console.log('formatData', formatedData, doctorData, hospitalData);
    } catch (err) {
      throw err;
      let payload;
      switch (err.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 403,
            error: errMessage.COOKIES_NOT_SET
          };
          break;
        case constants.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE:
          payload = {
            code: 401,
            error: errMessage.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE
          };
          break;
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }

      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async getProductForProgram(req, res) {
    try {
      const { programId } = req.params;
      const programProducts = await programService.getProgramProducts(
        programId
      );
      const { products: productsIds = [] } = programProducts[0] || {};
      const productsData = await productService.getProducts(productsIds);
      let products = {};
      productsData.forEach(product => {
        const { _id } = product;
        products[_id] = product;
      });
      let response = new Response(true, 200);
      response.setData({ products });
      response.setMessage("Program Data Added");
      return res.send(response.getResponse());
    } catch (err) {
      let payload;

      // let response = new Response(false, payload.code);
      // response.setError(payload.error);
      // return res.status(payload.code).json(response.getResponse());
    }
  }
}

module.exports = new ProgramController();
