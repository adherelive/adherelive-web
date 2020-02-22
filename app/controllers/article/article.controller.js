const { validationResult } = require("express-validator/check");
const Log = require("../../../libs/log")("articleController");
const errMessage = require("../../../config/messages.json").errMessages;
const articleService = require("../../services/article/article.service");
const userService = require("../../services/user/user.service");
const programService = require("../../services/program/program.service");
const hospitalService = require("../../services/hospital/hospital.service");

const { ObjectId } = require("mongodb");

const Response = require("../../helper/responseFormat");
const constants = require("../../../config/constants");
const _ = require("lodash");
const { Proxy_Sdk, EVENTS } = require("../../proxySdk");
const { NotificationSdk } = require("../../notificationSdk");
const { getArticleEmailTemplateData } = require("./article.controller.helper");
import { NOTIFICATION_VERB, EVENT_IS } from "../../../constant";

import { forEach } from "async";

class ArticleController {
  constructor() {}

  async createArticle(req, res) {
    try {
      let error = validationResult(req);
      if (!error.isEmpty()) {
        let response = new Response(false, 422);
        response.setError(error.mapped());
        return res.status(422).json(response.getResponse());
      }
      let { _id } = req.userDetails.userData;
      const {
        title,
        description,
        createdBy,
        participants,
        timeToRead,
        views,
        url
      } = req.body;

      let article = await articleService.createArticle({
        title,
        description,
        createdBy,
        participants,
        timeToRead,
        views,
        url
      });

      let participantIds = Object.keys(participants);
      let response = new Response(true, 200);
      response.setData({});
      response.setMessage(
        `Article created & shared with ${
          participantIds.length
        } users successfully`
      );
      if (participantIds.length > 0) {
        /* Send mail to participants */
        let participantusersInfo = await userService.getBulkUsers(
          participantIds
        );
        participantusersInfo.map(participant => {
          const {
            personalInfo: { email } = {},
            basicInfo: { name: participantName = "" } = {}
          } = participant;
          let mailData = getArticleEmailTemplateData({
            participantName,
            title,
            articleId: article.id
          });
          if (!_.isEmpty(email)) {
            let emailPayload = {
              toAddress: email,
              title: mailData.articleTitle,
              templateData: mailData,
              templateName: "article"
            };
            const emailResponse = Proxy_Sdk.execute(EVENTS.SEND_EMAIL, {
              ...emailPayload,
              //programId: program,
              loggedInUserId: _id.toString()
            });
          }
        });
      }
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

  async getArticles(req, res) {
    try {
      let { category, _id: userId } = req.userDetails.userData;
      let { isRecent } = req.query;
      let fetchedArticles;
      let articles = {};
      if (isRecent) {
        fetchedArticles = await articleService.getRecentArticles(userId);
      } else {
        fetchedArticles = await articleService.getArticles(userId);
      }
      fetchedArticles.map(article => {
        let isFavourite = article.participants[userId].isFavourite;
        article = { ...article, isFavourite };
        if (category != "careCoach") {
          delete article["participants"];
        }
        articles = { ...articles, [article._id]: article };
      });

      let response = new Response(true, 200);
      response.setData({ articles });
      response.setMessage(`Articles fetched successfully`);
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

  async makeFavouriteUnfavourite(req, res) {
    try {
      let error = validationResult(req);
      if (!error.isEmpty()) {
        response = new Response(false, 422);
        response.setError(error.mapped());
        return res.status(422).json(response.getResponse());
      }

      const { articleId } = req.params;
      const { isFavourite } = req.body;
      const { userId } = req.userDetails;
      let article = await articleService.makeFavouriteUnfavourite(
        userId,
        articleId,
        isFavourite
      );
      let response = new Response(true, 200);
      response.setData({ article: article._id });
      let mssgText = isFavourite ? "added to" : "removed from";
      response.setMessage(`Article ${mssgText} Favourites`);
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

  async getParticipants(req, res) {
    try {
      let error = validationResult(req);
      let response;
      if (!error.isEmpty()) {
        response = new Response(false, 422);
        response.setError(error.mapped());
        return res.status(422).json(response.getResponse());
      }

      if (req.userDetails.exists) {
        response = new Response(true, 200);
        const { articleId } = req.params;

        const userCategory = req.userDetails.userData.category;
        const userId = req.userDetails.userData._id;

        let hospitalsIds = new Set();
        let patientData;
        let users = {};

        if (true) {
          const article = await articleService.getArticleById(
            articleId,
            userId
          );
          let participants = Object.keys(article.participants);
          patientData = await userService.getBulkUsers(participants);

          let patientList = [];

          for (let key in patientData) {
            const value = patientData[key];
            const {
              basicInfo,
              personalInfo,
              status,
              documents,
              programId
            } = value;
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
            users: users
          });
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
        response.setMessage("Unauthorized to access the Articles!!");
        return res.send(response.getResponse());
      }
    } catch (err) {
      console.log("err :", err);
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

  async getArticleById(req, res) {
    try {
      let error = validationResult(req);
      if (!error.isEmpty()) {
        response = new Response(false, 422);
        response.setError(error.mapped());
        return res.status(422).json(response.getResponse());
      }
      const { articleId } = req.params;
      let { category, _id: userId } = req.userDetails.userData;
      let article = await articleService.getArticleById(articleId, userId);
      let isFavourite = article.participants[userId].isFavourite;
      article = { ...article, isFavourite };
      let users = {};
      if (category === "careCoach") {
        let participants = Object.keys(article.participants);
        let participantusersInfo = await userService.getBulkUsers(participants);
        participantusersInfo.map(user => {
          const { _id } = user.basicInfo;
          if (String(userId) != String(_id)) {
            users = {
              ...users,
              [_id]: { basicInfo: user.basicInfo, programId: user.programId }
            };
          }
        });
      } else {
        delete article["participants"];
      }
      let response = new Response(true, 200);
      response.setData({ articles: { [articleId]: article }, users });
      response.setMessage(`Article fetched successfully`);
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

  async shareArticle(req, res) {
    try {
      let error = validationResult(req);
      if (!error.isEmpty()) {
        response = new Response(false, 422);
        response.setError(error.mapped());
        return res.status(422).json(response.getResponse());
      }
      let { _id } = req.userDetails.userData;
      //const { articleId, participants } = req.body;
      const { articleId } = req.params;
      const { participants } = req.body;
      let participantObject = {};
      participants.map(participant => {
        participantObject = {
          ...participantObject,
          [`participants.${participant}`]: { isFavourite: false }
        };
      });
      let article = await articleService.shareArticle(
        articleId,
        participantObject
      );
      article["isFavourite"] = article.participants[_id].isFavourite;
      //console.log("Article: ", article);
      if (participants.length > 0) {
        /* Send mail to participants */
        let participantusersInfo = await userService.getBulkUsers(participants);
        participantusersInfo.map(participant => {
          const {
            personalInfo: { email } = {},
            basicInfo: { _id: participantId, name: participantName = "" } = {}
          } = participant;

          const notificationData = {
            data: {
              _id: articleId,
              eventCategory: NOTIFICATION_VERB.ARTICLE,
              userId: _id,
              participantName,
              title: article.title,
              articleId
            },
            eventIs: EVENT_IS.SHARE
          };
          NotificationSdk.execute(participantId, notificationData);
          // let mailData = getArticleEmailTemplateData({});
          // if (!_.isEmpty(email)) {
          //   let emailPayload = {
          //     toAddress: email,
          //     title: mailData.articleTitle,
          //     templateData: mailData,
          //     templateName: "article"
          //   };
          //   const emailResponse = Proxy_Sdk.execute(EVENTS.SEND_EMAIL, {
          //     ...emailPayload,
          //     //programId: program,
          //     loggedInUserId: _id.toString()
          //   });
          // }
        });
      }
      let response = new Response(true, 200);
      response.setData({ article });
      response.setMessage(
        `Article shared with ${participants.length} patient(s) successfully`
      );
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

  async hasViewed(req, res) {
    try {
      let error = validationResult(req);
      if (!error.isEmpty()) {
        response = new Response(false, 422);
        response.setError(error.mapped());
        return res.status(422).json(response.getResponse());
      }
      const { articleId } = req.params;
      const { userId } = req.userDetails;
      let article = await articleService.hasViewed(
        ObjectId(articleId),
        ObjectId(userId)
      );
      if (article) {
        let response = new Response(true, 200);
        response.setData({ articles: { [articleId]: article } });
        return res.send(response.getResponse());
      } else {
        let response = new Response(false, 200);
        return res.send(response.getResponse());
      }
    } catch (error) {
      Log.debug(error);
      let payload;
      switch (error.message) {
        case constants.UNAUTHORIZED_ACCESS:
          payload = {
            code: 401,
            error: errMessage.UNAUTHORIZED_ACCESS_TO_ARTICLE
          };
          break;
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

module.exports = new ArticleController();
