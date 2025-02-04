import { createLogger } from "../../../libs/logger";

const logger = createLogger("SERVICE VITAL TEMPLATES");

export default class VitalTemplates {
  constructor(data) {
    this._data = data;
  }

  getVitalTemplateId = () => {
    return this._data.get("id");
  };

  getName = () => {
    return this._data.get("name");
  };

  getUnit = () => {
    return this._data.get("unit");
  };

  getTemplate = () => {
    const { template = [] } = this._data.get("details");
    logger.debug("Get Template details: ", template);
    return template;
  };
}
