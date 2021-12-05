import BaseTemplateWorkout from "../../../services/templateWorkouts";

import TemplateWorkoutService from "../../../services/templateWorkouts/templateWorkout.service";
import ExerciseDetailService from "../../../services/exerciseDetails/exerciseDetail.service";

import ExerciseDetailWrapper from "../exerciseDetails";

class TemplateWorkoutWrapper extends BaseTemplateWorkout {
  constructor(data) {
    super(data);
  }
  
  getBasicInfo = () => {
    const {_data} = this;
    const {
      id,
      name,
      care_plan_template_id,
      total_calories,
      duration,
      time,
      details,
    } = _data || {};
    return {
      basic_info: {
        id,
        name,
        care_plan_template_id,
      },
      time,
      total_calories,
      duration,
      details,
    };
  };
  
  getAllInfo = () => {
    const {getBasicInfo} = this;
    
    return {
      ...getBasicInfo(),
    };
  };
  
  getReferenceInfo = async () => {
    const {getId, getAllInfo, getDetails} = this;
    const {workout_exercise_groups = []} = getDetails() || {};
    let exercise_detail_ids = [];
    
    if (workout_exercise_groups.length) {
      for (let index = 0; index < workout_exercise_groups.length; index++) {
        const {exercise_detail_id = null} =
        workout_exercise_groups[index] || [];
        exercise_detail_ids.push(exercise_detail_id);
      }
    }
    
    const exerciseDetailService = new ExerciseDetailService();
    
    let exerciseDetails = [];
    
    if (exercise_detail_ids) {
      const {rows = []} =
      (await exerciseDetailService.findAndCountAll({
        query: {
          id: exercise_detail_ids,
        },
      })) || {};
      
      exerciseDetails = rows;
    }
    
    let allExerciseDetails = {};
    let allExercises = {};
    let allRepetitions = {};
    if (exerciseDetails.length > 0) {
      for (let index = 0; index < exerciseDetails.length; index++) {
        const exerciseDetail = await ExerciseDetailWrapper({
          data: exerciseDetails[index],
        });
        const {exercise_details, exercises, repetitions} =
          await exerciseDetail.getReferenceInfo();
        allExerciseDetails = {...allExerciseDetails, ...exercise_details};
        allExercises = {...allExercises, ...exercises};
        allRepetitions = {...allRepetitions, ...repetitions};
      }
    }
    
    return {
      template_workouts: {
        [getId()]: {
          ...getAllInfo(),
        },
      },
      exercise_details: allExerciseDetails,
      exercises: allExercises,
      repetitions: allRepetitions,
    };
  };
}

export default async ({data = null, id = null}) => {
  if (data !== null) {
    return new TemplateWorkoutWrapper(data);
  }
  const templateWorkoutService = new TemplateWorkoutService();
  const templateWorkout = await templateWorkoutService.findOne({id});
  return new TemplateWorkoutWrapper(templateWorkout);
};
