import BaseExerciseGroup from "../../../services/exerciseGroups";
import ExerciseGroupService from "../../../services/exerciseGroups/exerciseGroup.service";

import ExerciseDetailWrapper from "../exerciseDetails";

class ExerciseGroupWrapper extends BaseExerciseGroup {
  constructor(data) {
    super(data);
  }
  
  getBasicInfo = () => {
    const {_data: {id, exercise_detail_id, sets, details} = {}} = this;
    
    return {
      basic_info: {
        id,
        exercise_detail_id,
      },
      sets,
      details,
    };
  };
  
  getAllInfo = () => {
    const {getBasicInfo} = this;
    
    return getBasicInfo();
  };
  
  getReferenceInfo = async () => {
    const {
      getId,
      getExerciseDetails,
      getWorkoutExerciseGroupMappings,
      getAllInfo,
    } = this;
    
    // get exercise details
    // let allExerciseGroup = {};
    let allExerciseDetails = {};
    let allExercises = {};
    let allRepetitions = {};
    const exerciseDetails = getExerciseDetails();
    if (exerciseDetails) {
      const exerciseDetail = await ExerciseDetailWrapper({
        data: exerciseDetails,
      });
      const {exercise_details, repetitions, exercises} =
        await exerciseDetail.getReferenceInfo();
      
      // const {id, workout_id, exercise_group_id, time} = getWorkoutExerciseGroupMappings();
      allExerciseDetails = exercise_details;
      allRepetitions = repetitions;
      allExercises = exercises;
      // allExerciseGroup = {
      //   [id]: {
      //     id, workout_id, exercise_group_id, time
      //   }
      // };
    }
    
    return {
      exercise_groups: {
        [getId()]: getAllInfo(),
      },
      exercises: allExercises,
      exercise_details: allExerciseDetails,
      repetitions: allRepetitions,
      // workout_exercise_group_mappings: allExerciseGroup
    };
  };
}

export default async ({data = null, id = null}) => {
  if (data) {
    return new ExerciseGroupWrapper(data);
  }
  const exerciseGroupService = new ExerciseGroupService();
  const exerciseGroup = await exerciseGroupService.findOne({id});
  return new ExerciseGroupWrapper(exerciseGroup);
};
