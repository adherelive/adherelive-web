import Controller from "../index";

import { createLogger } from "../../../libs/log";

// Services
import featuresService from "../../services/features/features.service";
import carePlanService from "../../services/carePlan/carePlan.service";
import doctorPatientFeatureMappingService from "../../services/doctorPatientFeatureMapping/doctorPatientFeatureMapping.service";

// Wrappers
import CarePlanWrapper from "../../apiWrapper/web/carePlan";
import FeatureMappingWrapper from "../../apiWrapper/web/doctorPatientFeatureMapping";

import { USER_CATEGORY } from "../../../constant";

const LOG_NAME = "WEB > FEATURES > CONTROLLER";

const Log = createLogger(LOG_NAME);

class FeatureController extends Controller {
  constructor() {
    super();
  }

  getAllFeaturesMappingForUser = async (req, res) => {
    const { raiseServerError, raiseSuccess } = this;
    try {
      const {
        userDetails: {
          userRoleId = null,
          userData: { category } = {},
          userCategoryId,
        } = {},
      } = req;

      let featureMappings = {};
      let features = {};
      let carePlanData = [];
      let otherUserCategoryIds = [];

      switch (category) {
        case USER_CATEGORY.PATIENT:
          carePlanData =
            (await carePlanService.getCarePlanByData({
              patient_id: userCategoryId,
            })) || [];

          for (let index = 0; index < carePlanData.length; index++) {
            const carePlanApiWrapper = await CarePlanWrapper(
              carePlanData[index]
            );
            otherUserCategoryIds.push(carePlanApiWrapper.getDoctorId());
          }
          break;
        case USER_CATEGORY.DOCTOR:
          carePlanData =
            (await carePlanService.getCarePlanByData({
              user_role_id: userRoleId,
            })) || [];

          for (let index = 0; index < carePlanData.length; index++) {
            const carePlanApiWrapper = await CarePlanWrapper(
              carePlanData[index]
            );
            otherUserCategoryIds.push(carePlanApiWrapper.getPatientId());
          }
          break;
        case USER_CATEGORY.HSP:
          carePlanData =
            (await carePlanService.getCarePlanByData({
              user_role_id: userRoleId,
            })) || [];

          for (let index = 0; index < carePlanData.length; index++) {
            const carePlanApiWrapper = await CarePlanWrapper(
              carePlanData[index]
            );
            otherUserCategoryIds.push(carePlanApiWrapper.getPatientId());
          }
          break;
      }

      for (const otherUserCategoryId of otherUserCategoryIds) {
        const patientId =
          category === USER_CATEGORY.PATIENT
            ? userCategoryId
            : otherUserCategoryId;
        const doctorId =
          category === USER_CATEGORY.DOCTOR || category === USER_CATEGORY.HSP
            ? userCategoryId
            : otherUserCategoryId;
        const patientFeatures =
          await doctorPatientFeatureMappingService.getByData({
            patient_id: patientId,
            doctor_id: doctorId,
          });

        let doctorFeatureIds = [];

        for (const feature of patientFeatures) {
          const featureWrapper = await FeatureMappingWrapper(feature);
          const feature_id = featureWrapper.getFeatureId();
          doctorFeatureIds.push(feature_id);
        }
        featureMappings = {
          ...featureMappings,
          ...{ [otherUserCategoryId]: doctorFeatureIds },
        };
      }

      const featuresTypesData = await featuresService.getAllFeatures();

      for (const featureData of featuresTypesData) {
        const { id, name, details } = featureData;
        features = { ...features, [id]: { id, name, details } };
      }

      const dataToSend = {
        feature_mappings: {
          ...featureMappings,
        },
        features: {
          ...features,
        },
      };

      return raiseSuccess(
        res,
        200,
        { ...dataToSend },
        "Features mapping fetched successfully."
      );
    } catch (error) {
      Log.debug("getAllFeaturesMappingForUser 500 error", error);
      return raiseServerError(res, 500, {}, error.message);
    }
  };
}

export default new FeatureController();
