import Controller from "../index";

import Logger from "../../../libs/log";

import FeatureDetailService from "../../services/featureDetails/featureDetails.service";
import doctorService from "../../services/doctor/doctor.service";
import carePlanService from "../../services/carePlan/carePlan.service";
import featureService from "../../services/features/features.service";
import featuresMappingService from "../../services/doctorPatientFeatureMapping/doctorPatientFeatureMapping.service";
import documentService from "../../services/uploadDocuments/uploadDocuments.service";
import minioService from "../../services/minio/minio.service";
import userRoleService from "../../services/userRoles/userRoles.service";
import userService from "../../services/user/user.service";
import providerService from "../../services/provider/provider.service";
import providerTermsMappingService from "../../services/providerTermsMapping/providerTermsMappings.service";
import tacService from "../../services/termsAndConditions/termsAndConditions.service";

import FeatureDetailsWrapper from "../../ApiWrapper/web/featureDetails";
import DoctorWrapper from "../../ApiWrapper/web/doctor";
import CarePlanWrapper from "../../ApiWrapper/web/carePlan";
import DocumentWrapper from "../../ApiWrapper/web/uploadDocument";
import UserRoleWrapper from "../../ApiWrapper/web/userRoles";
import UserWrapper from "../../ApiWrapper/web/user";
import ProviderWrapper from "../../ApiWrapper/web/provider";
import TACWrapper from "../../ApiWrapper/web/termsAndConditions";

import { USER_CATEGORY, TERMS_AND_CONDITIONS_TYPES } from "../../../constant";

const Log = new Logger("ADMIN > CONTROLLER");

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
          feature_type
        }
      );

      if (previousTermsOrPolicy) {
        const previousDetails = await FeatureDetailsWrapper(
          previousTermsOrPolicy
        );

        const updatedDetails = {
          ...previousDetails.getFeatureDetails(),
          content
        };
        const updateFeatureDetails = await FeatureDetailService.update(
          { details: updatedDetails },
          feature_type
        );

        Log.debug("updateFeatureDetails --> ", updateFeatureDetails);
      } else {
        const addFeatureDetails = await FeatureDetailService.add({
          feature_type,
          details: { content }
        });

        Log.debug("updateFeatureDetails --> ", addFeatureDetails);
      }

      return raiseSuccess(res, 200, {}, "Details updated successfully");
    } catch (error) {
      Log.debug("updateTermsAndPolicy 500 error", error);
      return raiseServerError(res);
    }
  };

  getTermsAndPolicy = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { params: { type: feature_type } = {} } = req;
      const termsOrPolicy = await FeatureDetailService.getDetailsByData({
        feature_type
      });

      const featureDetails = await FeatureDetailsWrapper(termsOrPolicy);

      Log.debug("featureDetails.getBasicInfo", featureDetails.getBasicInfo());

      return raiseSuccess(
        res,
        200,
        {
          ...featureDetails.getBasicInfo()
        },
        "Details fetched successfully"
      );
    } catch (error) {
      Log.debug("getTermsAndPolicy 500 error", error);
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

          const careplanData = await carePlanService.getCarePlanByData({
            user_role_id: userRoleId
          });

          for (const carePlan of careplanData) {
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
                updated_at: new Date()
              });
            }
          }
        }
      }

      return raiseSuccess(res, 200, {}, "Features updated successfully");
    } catch (error) {
      Log.debug("enableAllFeatures 500 error", error);
      return raiseServerError(res);
    }
  };

  updateProviderTermsMappingForExistingUsers = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      let mappingData = [];
      const users = await userService.getUserByData({
        category: [USER_CATEGORY.PROVIDER]
      });

      if (users && users.length) {
        for (const user of users) {
          const userWrapper = await UserWrapper(user);
          const provider = await providerService.getProviderByData({
            user_id: userWrapper.getId()
          });
          const providerWrapper = await ProviderWrapper(provider);
          mappingData.push({
            provider_id: providerWrapper.getProviderId(),
            terms_and_conditions_id: 2
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
      Log.debug("updateProviderTermsMappingForExistingUsers 500 error", error);
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
          terms_type: TERMS_AND_CONDITIONS_TYPES.DEFAULT_TERMS_OF_PAYMENT
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
            ...tacApidata
          }
        },
        "Details fetched successfully"
      );
    } catch (error) {
      Log.debug("getTermsOfPayment 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new AdminController();
