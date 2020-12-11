import Controller from "../index";

import Logger from "../../../libs/log";

import FeatureDetailService from "../../services/featureDetails/featureDetails.service";
import FeatureDetailsWrapper from "../../ApiWrapper/web/featureDetails";

const Log = new Logger("ADMIN > CONTROLLER");

class AdminController extends Controller {
    constructor() {
        super();
    }

    updateTermsAndPolicy = async (req, res) => {
        const {raiseSuccess, raiseClientError, raiseServerError} = this;
        try {
            const {body: {type : feature_type, content} = {}} = req;
            const previousTermsOrPolicy = await FeatureDetailService.getDetailsByData({
               feature_type
            });

            if(previousTermsOrPolicy) {
                const previousDetails = await FeatureDetailsWrapper(previousTermsOrPolicy);

                const updatedDetails = {
                    ...previousDetails.getFeatureDetails(),
                    content
                };
                const updateFeatureDetails = await FeatureDetailService.update({details: updatedDetails}, feature_type);

                Log.debug("updateFeatureDetails --> ", updateFeatureDetails);
            } else {
                const addFeatureDetails = await FeatureDetailService.add({feature_type,details: {content}});

                Log.debug("updateFeatureDetails --> ", addFeatureDetails);
            }



            return raiseSuccess(
                res,
                200,
                {},
                "Details updated successfully"
            );
        } catch(error) {
            Log.debug("updateTermsAndPolicy 500 error", error);
            return raiseServerError(res);
        }
    };

    getTermsAndPolicy = async (req, res) => {
        const {raiseSuccess, raiseServerError} = this;
        try {
            const {params: {type : feature_type} = {}} = req;
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
        } catch(error) {
            Log.debug("getTermsAndPolicy 500 error", error);
            return raiseServerError(res);
        }
    };
}

export default new AdminController();