import { completePath } from "../../../helper/s3FilePath";
import { VIDEO_TYPES } from "../../../models/exerciseContents";
import BaseExerciseContent from "../../../services/exerciseContents";

import ExerciseContentService from "../../../services/exerciseContents/exerciseContent.service";

class ExerciseContentWrapper extends BaseExerciseContent {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data } = this;
    const {
      id,
      exercise_id,
      creator_id,
      creator_type,
      video_content_type,
      video_content,
    } = _data || {};

    const videoContent =
      video_content_type === VIDEO_TYPES.UPLOAD
        ? completePath(video_content)
        : video_content;

    return {
      basic_info: {
        id,
        exercise_id,
      },
      creator_id,
      creator_type,
      video: {
        content_type: video_content_type,
        content: videoContent,
      },
    };
  };
}

export default async ({
  data = null,
  id = null,
  exercise_id = null,
  auth = null,
}) => {
  if (data) {
    return new ExerciseContentWrapper(data);
  }
  const exerciseContentService = new ExerciseContentService();
  if (id) {
    const exerciseContent = await exerciseContentService.findOne({ id });
    return new ExerciseContentWrapper(exerciseContent);
  }
  const exerciseContent = await exerciseContentService.findOne({
    exercise_id,
    ...auth,
  });
  return new ExerciseContentWrapper(exerciseContent);
};
