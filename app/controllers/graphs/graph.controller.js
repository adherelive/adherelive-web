import Controller from "../";
import Log from "../../../libs/log";
import {CHART_DETAILS, CHART_LIMIT} from "../../../constant";

const Logger = new Log("WEB GRAPH CONTROLLER");

class GraphController extends Controller {
    constructor() {
        super();
    }

    getAllGraphs = async (req, res) => {
        const {raiseServerError, raiseSuccess} = this;
        try {

            let limitedGraphDetails = {};
            Object.keys(CHART_DETAILS).forEach((id, index) => {
                if((index+1) <= CHART_LIMIT) {
                    limitedGraphDetails[id] = CHART_DETAILS[id];
                }
            });

            return raiseSuccess(res, 200, {
                graphs: {
                    ...limitedGraphDetails
                },
            },
                "Charts fetched successfully"
            );
        } catch(error) {
            Logger.debug("getAllGraphs 500 error ---> ", error);
            return raiseServerError(res);
        }
    };

    addGraphType = async (req, res) => {
        const {raiseServerError, raiseSuccess} = this;
        try {
            const {params: {id} = {}} = req;

            let limitedGraphDetails = {};
            Object.keys(CHART_DETAILS).forEach((id, index) => {
                if((index+1) <= CHART_LIMIT) {
                    limitedGraphDetails[id] = CHART_DETAILS[id];
                }
            });

            Logger.debug("1983791728 -------------> ", CHART_DETAILS[id]);

            return raiseSuccess(res, 200, {
                graphs: {
                    ...limitedGraphDetails,
                    [id]: CHART_DETAILS[id]
                }
            },
                "Chart added successfully");
        } catch(error) {
            Logger.debug("getAllGraphs 500 error ---> ", error);
            return raiseServerError(res);
        }
    };
}

export default new GraphController();