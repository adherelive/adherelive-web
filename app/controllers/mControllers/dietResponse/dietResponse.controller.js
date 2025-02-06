import Controller from "../../index";

// services
import DietResponseService from "../../../services/dietResponses/dietResponses.service";

// wrappers
import DietResponseWrapper from "../../../apiWrapper/mobile/dietResponse";
import DietWrapper from "../../../apiWrapper/mobile/diet";
import CarePlanWrapper from "../../../apiWrapper/mobile/carePlan";
import DoctorWrapper from "../../../apiWrapper/mobile/doctor";

import * as UploadHelper from "../../../helper/uploadDocuments";

import DietJob from "../../../jobSdk/Diet/observer";
import NotificationSdk from "../../../notificationSdk";

import { createLogger } from "../../../../libs/logger";
import { DOCUMENT_PARENT_TYPE, NOTIFICATION_STAGES, USER_CATEGORY, } from "../../../../constant";

const logger = createLogger("MOBILE > DIET_RESPONSE > CONTROLLER");

class DietResponseController extends Controller {
  constructor() {
    super();
  }

  upload = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { file, userDetails: { userId } = {} } = req;

      if (!file) {
        return raiseClientError(res, 422, {}, "Please select files to upload");
      }

      let documents = [];

      const { originalname } = file || {};
      const fileUrl = await UploadHelper.upload({
        file,
        id: userId,
        folder: DOCUMENT_PARENT_TYPE.DIET_RESPONSE,
      });
      documents.push({
        name: originalname,
        file: fileUrl,
      });

      return raiseSuccess(
        res,
        200,
        {
          documents,
        },
        "Image uploaded successfully"
      );
    } catch (error) {
      logger.error("upload 500", error);
      return raiseServerError(res);
    }
  };

  create = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      logger.debug("request body", req.body);
      const {
        body = {},
        userDetails: {
          userId,
          userRoleId,
          userData: { category } = {},
          userCategoryData: { basic_info: { full_name } = {} } = {},
        } = {},
      } = req;
      const {
        schedule_event_id,
        diet_id,
        diet_response_status,
        response_text,
        documents = [],
      } = body || {};

      const dietResponseService = new DietResponseService();

      const responseExists = await dietResponseService.getByData({
        diet_id,
        schedule_event_id,
      });

      if (category !== USER_CATEGORY.PATIENT) {
        return raiseClientError(res, 422, {}, "Unauthorized");
      }

      if (responseExists) {
        return raiseClientError(
          res,
          422,
          {},
          "Diet already captured for this time."
        );
      }

      const dietResponseId =
        (await dietResponseService.create({
          schedule_event_id,
          diet_id,
          response_text,
          status: diet_response_status,
          documents,
        })) || null;

      if (dietResponseId) {
        // get doctor for diet
        const diet = await DietWrapper({ id: diet_id });
        const carePlan = await CarePlanWrapper(null, diet.getCarePlanId());
        const doctorRoleId = carePlan.getUserRoleId();

        const doctor = await DoctorWrapper(null, carePlan.getDoctorId());

        const dietResponse = await DietResponseWrapper({
          id: dietResponseId,
        });

        const dietJob = DietJob.execute(NOTIFICATION_STAGES.RESPONSE_ADDED, {
          participants: [userRoleId, doctorRoleId],
          actor: {
            id: userId,
            user_role_id: userRoleId,
            details: { name: full_name, category },
          },
          id: dietResponseId,
          ...(await dietResponse.getReferenceInfo()),
        });

        await NotificationSdk.execute(dietJob);
        return raiseSuccess(res, 200, {}, "Diet response added successfully");
      } else {
        return raiseClientError(res, 422, {}, "Please check details entered");
      }
    } catch (error) {
      logger.error("create 500 - diet response controller", error);
      return raiseServerError(res);
    }
  };
}

export default new DietResponseController();
