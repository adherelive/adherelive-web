import Controller from "../../";
import conditionService from "../../../services/condition/condition.service";
import ConditionWrapper from "../../../ApiWrapper/mobile/conditions";

import Log from "../../../../libs/log";

const Logger  = new Log("MOBILE CONDITION CONTROLLER");

class ConditionController extends Controller {
    constructor() {
        super();
    }

    getAll = async (req, res) => {
        const {raiseSuccess, raiseClientError, raiseServerError} = this;
        try {
            const {query} = req;
            const {value} = query || {};

            // Logger.debug("value in req", value);

            const conditionDetails = await conditionService.search(value);

            if(conditionDetails.length > 0) {
                let conditionApiData = {};
                for(const condition of conditionDetails) {
                    const conditionWrapper = await new ConditionWrapper(condition);
                    conditionApiData[conditionWrapper.getConditionId()] = conditionWrapper.getBasicInfo();
                }

                return raiseSuccess(
                    res,
                    200,
                    {
                        conditions: {
                            ...conditionApiData
                        }
                    },
                    "Conditions fetched successfully"
                );
            } else {
                return raiseClientError(res, 422, {}, `No condition found with name including ${value}`)
            }
        } catch(error) {
            Logger.debug("condition search 500 error", error);
            return raiseServerError(res);
        }
    };
}

export default new ConditionController();