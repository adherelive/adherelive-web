import Controller from "../../";
import treatmentService from "../../../services/treatment/treatment.service";
import TreatmentWrapper from "../../../ApiWrapper/mobile/treatments";

import Log from "../../../../libs/log";

const Logger  = new Log("MOBILE TREATMENT CONTROLLER");

class TreatmentController extends Controller {
    constructor() {
        super();
    }

    getAll = async (req, res) => {
        const {raiseSuccess, raiseClientError, raiseServerError} = this;
        try {
            const {query} = req;
            const {value} = query || {};

            // Logger.debug("value in req", value);

            const treatmentDetails = await treatmentService.search(value);

            if(treatmentDetails.length > 0) {
                let treatmentApiData = {};
                for(const treatment of treatmentDetails) {
                    const treatmentWrapper = await new TreatmentWrapper(treatment);
                    treatmentApiData[treatmentWrapper.getTreatmentId()] = treatmentWrapper.getBasicInfo();
                }

                return raiseSuccess(
                    res,
                    200,
                    {
                        treatments: {
                            ...treatmentApiData
                        }
                    },
                    "Treatments fetched successfully"
                );
            } else {
                return raiseClientError(res, 422, {}, `No treatment found with name including ${value}`)
            }
        } catch(error) {
            Logger.debug("treatment search 500 error", error);
            return raiseServerError(res);
        }
    };
}

export default new TreatmentController();