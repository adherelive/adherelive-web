import BaseCollege from "../../../services/college";
import collegeService from "../../../services/college/college.service";

class CollegeWrapper extends BaseCollege {
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
    return new CollegeWrapper(data);
  }
  const college = await collegeService.getByData({id});
  return new CollegeWrapper(college);
};
