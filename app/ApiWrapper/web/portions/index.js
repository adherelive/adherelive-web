import BasePortion from "../../../services/portions";
import PortionService from "../../../services/portions/portions.service";

class PortionWrapper extends BasePortion {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data } = this;
    const { id, name } = _data || {};
    return {
      basic_info: {
        id,
        name
      }
    };
  };
}

export default async ({ data = null, id = null }) => {
  if (data !== null) {
    return new PortionWrapper(data);
  }
  const portionService = new PortionService();
  const portion = await portionService.getByData({ id });
  return new PortionWrapper(portion.get());
};
