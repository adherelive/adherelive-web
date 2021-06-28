import BaseExercise from "../../../services/exercises";
import ExerciseService from "../../../services/exercises/exercise.service";

import ExerciseDetailWrapper from "../exerciseDetails";

class ExerciseWrapper extends BaseExercise {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data: { id, name } = {} } = this;

    return {
      basic_info: {
        id,
        name,
      },
    };
  };

  getAllInfo = async () => {
    const { getBasicInfo, getExerciseDetails } = this;

    const exerciseDetails = getExerciseDetails() || [];

    let exercise_detail_ids = [];
    if (exerciseDetails.length > 0) {
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

    // get exercise details
    let allExerciseDetails = {};
    let allRepetitions = {};
    const exerciseDetails = getExerciseDetails() || [];
    if (exerciseDetails.length > 0) {
      for (let index = 0; index < exerciseDetails.length; index++) {
        const exerciseDetail = await ExerciseDetailWrapper({
          data: exerciseDetails[index],
        });
        const {
          exercise_details,
          repetitions,
        } = await exerciseDetail.getReferenceInfo();
        allExerciseDetails = { ...allExerciseDetails, ...exercise_details };
        allRepetitions = { ...allRepetitions, ...repetitions };
      }
    }

    return {
      exercises: {
        [getId()]: {
          ...(await getAllInfo()),
        },
      },
      exercise_details: {
        ...allExerciseDetails,
      },
      repetitions: {
        ...allRepetitions,
      },
    };
  };
}

export default async ({ data = null, id = null }) => {
  if (data) {
    return new ExerciseWrapper(data);
  }
  const exerciseService = new ExerciseService();
  const exercise = await exerciseService.findOne({ id });
  return new ExerciseWrapper(exercise);
};
