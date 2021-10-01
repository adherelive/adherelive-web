import BaseCourse from "../../../services/course";
import courseService from "../../../services/course/course.service";

class CourseWrapper extends BaseCourse {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data } = this;
        const {
            id,
            name
        } = _data || {};
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
    return new CourseWrapper(data);
  }
  const course = await courseService.getByData({ id });
  return new CourseWrapper(course);
};
