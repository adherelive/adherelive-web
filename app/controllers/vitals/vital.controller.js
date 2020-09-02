import Controller from "../";
import Logger from "../../../libs/log";

// SERVICES
import VitalTemplateService from "../../services/vitalTemplates/vitalTemplate.service";

// WRAPPERS
import VitalTemplateWrapper from "../../ApiWrapper/web/vitalTemplates";

const Log = new Logger("WEB > VITALS > CONTROLLER");

class VitalController extends Controller {
    constructor() {
        super();
    }

    search = async (req, res) => {
        const {raiseSuccess, raiseClientError, raiseServerError} = this;
      try {
          Log.debug("req.query --->", req.query);
          const {query: {value} = {}} = req;

          const vitalTemplates = await VitalTemplateService.searchByData(value);
          const templateDetails = {};
          const templateIds = [];

          if(vitalTemplates.length > 0) {
              for(const data of vitalTemplates) {
                  const vitalData = await VitalTemplateWrapper({data});
                  templateDetails[vitalData.getVitalTemplateId()] = vitalData.getBasicInfo();
                  templateIds.push(vitalData.getVitalTemplateId());
              }

              return raiseSuccess(
                  res,
                  200,
                  {
                      vital_templates: {
                          ...templateDetails
                      },
                      vital_template_ids: templateIds
                  },
                  "Vitals fetched successfully"
              )
          } else {
              return raiseClientError(res, 422, {}, "No vital exists with this name");
          }
      } catch(error) {
          Log.debug("vitals search 500 error", error);
          return raiseServerError(res);
      }
    };
}

export default new VitalController();