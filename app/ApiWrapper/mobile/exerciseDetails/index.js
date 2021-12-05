import BaseExerciseDetail from "../../../services/exerciseDetails";
import ExerciseDetailService from "../../../services/exerciseDetails/exerciseDetail.service";

import ExerciseWrapper from "../exercises";

class ExerciseDetailWrapper extends BaseExerciseDetail {
  constructor(data) {
    super(data);
  }
  
  getBasicInfo = () => {
    const {
      _data: {
        id,
        creator_id,
        creator_type,
        exercise_id,
        repetition_id,
        repetition_value,
        calorific_value,
      } = {},
    } = this;
    
    return {
      basic_info: {
        id,
        exercise_id,
        repetition_id,
        repetition_value,
      },
      creator_id,
      creator_type,
      calorific_value,
    };
  };
  
  getAllInfo = () => {
    const {getBasicInfo} = this;
    
    return {
      ...getBasicInfo(),
    };
  };
  
  getReferenceInfo = async () => {
    const {getId, getRepetition, getExercise, getAllInfo} = this;
    
    let allRepetitions = {};
    let allExercises = {};
    const exercises = getExercise() || null;
    if (exercises) {
      const exercise = await ExerciseWrapper({data: exercises});
      allExercises[exercise.getId()] = await exercise.getAllInfo();
    }
    
    const repetitions = getRepetition() || null;
    if (repetitions) {
      const {id, type} = repetitions || {};
      allRepetitions[id] = {
        type,
      };
    }
    
    return {
      exercise_details: {
        [getId()]: {
          ...getAllInfo(),
        },
      },
      repetitions: {
        ...allRepetitions,
      },
      exercises: {
        ...allExercises,
      },
    };
  };
}

export default async ({data = null, id = null}) => {
  if (data) {
    return new ExerciseDetailWrapper(data);
  }
  const exerciseDetailService = new ExerciseDetailService();
  const exerciseDetail = await exerciseDetailService.findOne({id});
  return new ExerciseDetailWrapper(exerciseDetail);
};
