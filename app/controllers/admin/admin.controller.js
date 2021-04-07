import Controller from "../index";

import Logger from "../../../libs/log";

import FeatureDetailService from "../../services/featureDetails/featureDetails.service";
import doctorService from "../../services/doctor/doctor.service";
import carePlanService from "../../services/carePlan/carePlan.service";
import featureService from "../../services/features/features.service";
import featuresMappingService from "../../services/doctorPatientFeatureMapping/doctorPatientFeatureMapping.service";
import documentService from "../../services/uploadDocuments/uploadDocuments.service";
import minioService from "../../services/minio/minio.service";

import FeatureDetailsWrapper from "../../ApiWrapper/web/featureDetails";
import DoctorWrapper from "../../ApiWrapper/web/doctor";
import CarePlanWrapper from "../../ApiWrapper/web/carePlan";
import DocumentWrapper from "../../ApiWrapper/web/uploadDocument";

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

          const careplanData = await carePlanService.getCarePlanByData({
            doctor_id: doctorId
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
}

export default new AdminController();
