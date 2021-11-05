import BaseSeverity from "../../../services/severity";
import severityService from "../../../services/severity/severity.service";

class SeverityWrapper extends BaseSeverity {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data } = this;
    const { id, name } = _data || {};
    return {
      basic_info: {
        id,
        name,
      },
    };
  };
}

export default async (data = null, id = null) => {
  if (data !== null) {
    return new SeverityWrapper(data);
  }
  const severity = await severityService.getByData({ id });
  return new SeverityWrapper(severity.get());
};
