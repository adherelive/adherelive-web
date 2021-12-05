import BaseCondition from "../../../services/condition";
import conditionService from "../../../services/condition/condition.service";

class ConditionWrapper extends BaseCondition {
  constructor(data) {
    super(data);
  }
  
  getBasicInfo = () => {
    const {_data} = this;
    const {id, name} = _data || {};
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
    return new ConditionWrapper(data);
  }
  const condition = await conditionService.getByData({id});
  return new ConditionWrapper(condition.get());
};
