import Controller from "../index";

import { createLogger } from "../../../libs/logger";

import FeatureDetailService from "../../services/featureDetails/featureDetails.service";
import doctorService from "../../services/doctor/doctor.service";
import carePlanService from "../../services/carePlan/carePlan.service";
import featureService from "../../services/features/features.service";
import featuresMappingService from "../../services/doctorPatientFeatureMapping/doctorPatientFeatureMapping.service";
import userRoleService from "../../services/userRoles/userRoles.service";
import userService from "../../services/user/user.service";
import providerService from "../../services/provider/provider.service";
import providerTermsMappingService from "../../services/providerTermsMapping/providerTermsMappings.service";
import tacService from "../../services/termsAndConditions/termsAndConditions.service";

import FeatureDetailsWrapper from "../../apiWrapper/web/featureDetails";
import DoctorWrapper from "../../apiWrapper/web/doctor";
import CarePlanWrapper from "../../apiWrapper/web/carePlan";
import UserRoleWrapper from "../../apiWrapper/web/userRoles";
import UserWrapper from "../../apiWrapper/web/user";
import ProviderWrapper from "../../apiWrapper/web/provider";
import TACWrapper from "../../apiWrapper/web/termsAndConditions";

import { TERMS_AND_CONDITIONS_TYPES, USER_CATEGORY } from "../../../constant";

const logger = createLogger("ADMIN > CONTROLLER");

class AdminController extends Controller {
  constructor() {
    super();
  }

  updateTermsAndPolicy = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { body: { type: feature_type, content } = {} } = req;
      const previousTermsOrPolicy = await FeatureDetailService.getDetailsByData(
        {
          feature_type,
        }
      );

      if (previousTermsOrPolicy) {
        const previousDetails = await FeatureDetailsWrapper(
          previousTermsOrPolicy
        );

        const updatedDetails = {
          ...previousDetails.getFeatureDetails(),
          content,
        };
        const updateFeatureDetails = await FeatureDetailService.update(
          { details: updatedDetails },
          feature_type
        );

        logger.debug("updateFeatureDetails --> ", updateFeatureDetails);
      } else {
        const addFeatureDetails = await FeatureDetailService.add({
          feature_type,
          details: { content },
        });

        logger.debug("updateFeatureDetails --> ", addFeatureDetails);
      }

      return raiseSuccess(res, 200, {}, "Details updated successfully");
    } catch (error) {
      logger.error("updateTermsAndPolicy 500 error", error);
      return raiseServerError(res);
    }
  };

  getTermsAndPolicy = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { params: { type: feature_type } = {} } = req;
      const termsOrPolicy = await FeatureDetailService.getDetailsByData({
        feature_type,
      });

      const featureDetails = await FeatureDetailsWrapper(termsOrPolicy);

      logger.debug("featureDetails.getBasicInfo", featureDetails.getBasicInfo());

      return raiseSuccess(
        res,
        200,
        {
          ...featureDetails.getBasicInfo(),
        },
        "Details fetched successfully"
      );
    } catch (error) {
      logger.error("getTermsAndPolicy 500 error", error);
      return raiseServerError(res);
    }
  };

  enableAllFeatures = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const doctors = await doctorService.getAllDoctorsOnly();

      if (doctors) {
        for (const doctor of doctors) {
          const doctorWrapper = await DoctorWrapper(doctor);
          const doctorId = doctorWrapper.getDoctorId();
          const userId = doctorWrapper.getUserId();
          let userRoleId = null;
          const userRoleDataForUserId = await userRoleService.getFirstUserRole(
            userId
          );
          if (userRoleDataForUserId) {
            const userRoleWrapper = UserRoleWrapper(userRoleDataForUserId);
            userRoleId = (await userRoleWrapper).getId() || null;
          }

          const carePlanData = await carePlanService.getCarePlanByData({
            user_role_id: userRoleId,
          });

          for (const carePlan of carePlanData) {
            const carePlanApiWrapper = await CarePlanWrapper(carePlan);
            const patientId = carePlanApiWrapper.getPatientId();

            const features = await featureService.getAllFeatures();

            for (const feature of features) {
              const { id: featureId } = feature;
              const mappingResponse = await featuresMappingService.create({
                doctor_id: doctorId,
                patient_id: patientId,
                feature_id: featureId,
                created_at: new Date(),
                updated_at: new Date(),
              });
            }
          }
        }
      }

      return raiseSuccess(res, 200, {}, "Features updated successfully");
    } catch (error) {
      logger.error("enableAllFeatures 500 error", error);
      return raiseServerError(res);
    }
  };

  updateProviderTermsMappingForExistingUsers = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      let mappingData = [];
      const users = await userService.getUserByData({
        category: [USER_CATEGORY.PROVIDER],
      });

      if (users && users.length) {
        for (const user of users) {
          const userWrapper = await UserWrapper(user);
          const provider = await providerService.getProviderByData({
            user_id: userWrapper.getId(),
          });
          const providerWrapper = await ProviderWrapper(provider);
          mappingData.push({
            provider_id: providerWrapper.getProviderId(),
            terms_and_conditions_id: 2,
          });
        }
      }
      if (mappingData && mappingData.length) {
        const response = await providerTermsMappingService.bulkCreate(
          mappingData
        );
      }

      return raiseSuccess(
        res,
        200,
        {},
        "Updated terms and conditions for existing providers."
      );
    } catch (error) {
      logger.error("updateProviderTermsMappingForExistingUsers 500 error", error);
      return raiseServerError(res);
    }
  };

  getTermsAndConditions = async (req, res) => {
    const { raiseSuccess, raiseServerError, raiseClientError } = this;
    try {
      const { params: { id = null } = {} } = req;
      let record = null;

      if (id.toString() === "0") {
        record = await tacService.getByData({
          terms_type: TERMS_AND_CONDITIONS_TYPES.DEFAULT_TERMS_OF_PAYMENT,
        });
      } else {
        record = await tacService.getByData({ id });
      }

      if (!record) {
        return raiseClientError(res, 422, {}, "No Matching record Found");
      }

      const tacDetails = await TACWrapper(record);
      let tacApidata = {};
      if (id.toString() === "0") {
        tacApidata["0"] = tacDetails.getBasicInfo();
      } else {
        tacApidata[tacDetails.getId()] = tacDetails.getBasicInfo();
      }

      return raiseSuccess(
        res,
        200,
        {
          terms_and_conditions: {
            ...tacApidata,
          },
        },
        "Details fetched successfully"
      );
    } catch (error) {
      logger.error("getTermsOfPayment 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new AdminController();
