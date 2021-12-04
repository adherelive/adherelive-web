import BaseDegree from "../../../services/degree";
import degreeService from "../../../services/degree/degree.service";

class DegreeWrapper extends BaseDegree {
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
    return new DegreeWrapper(data);
  }
  const degree = await degreeService.getByData({id});
  return new DegreeWrapper(degree);
};
