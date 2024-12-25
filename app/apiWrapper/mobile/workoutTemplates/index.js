import BaseWorkoutTemplate from "../../../services/workoutTemplates";

import WorkoutTemplateService from "../../../services/workoutTemplates/workoutTemplate.service";

import ExerciseDetailWrapper from "../exerciseDetails";

class WorkoutTemplateWrapper extends BaseWorkoutTemplate {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data: { id, name, creator_id, creator_type } = {} } = this;

    return {
      basic_info: {
        id,
        name,
      },
      creator_id,
      creator_type,
    };
  };

  getAllInfo = async () => {
    const { getBasicInfo, getExerciseDetails } = this;

    const exerciseDetails = getExerciseDetails() || null;

    let exercise_detail_ids = [];
    if (exerciseDetails) {
      for (let index = 0; index < exerciseDetails.length; index++) {
        const { id } = exerciseDetails[index] || {};
        exercise_detail_ids.push(id);
      }
    }

    return {
      ...getBasicInfo(),
      exercise_detail_ids,
    };
  };

  getReferenceInfo = async () => {
    const { getId, getExerciseDetails, getAllInfo } = this;

    let allExerciseDetails = {};
    let allRepetitions = {};

    const exerciseDetails = getExerciseDetails() || null;

    if (exerciseDetails) {
      for (let index = 0; index < exerciseDetails.length; index++) {
        const exerciseDetail = await ExerciseDetailWrapper({
          data: exerciseDetails[index],
        });
        const { exercise_details, repetitions } =
          await exerciseDetail.getReferenceInfo();
        allExerciseDetails = { ...allExerciseDetails, ...exercise_details };
        allRepetitions = { ...allRepetitions, ...repetitions };
      }
    }

    return {
      workout_templates: {
        [getId()]: {
          ...(await getAllInfo()),
        },
      },
      exercise_details: allExerciseDetails,
      repetitions: allRepetitions,
    };
  };
}

export default async ({ data = null, id = null }) => {
  if (data) {
    return new WorkoutTemplateWrapper(data);
  }
  const workoutTemplateService = new WorkoutTemplateService();
  const workoutTemplate = await workoutTemplateService.findOne({ id });
  return new WorkoutTemplateWrapper(workoutTemplate);
};
