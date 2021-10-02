import BaseWorkout from "../../../services/workouts";
import WorkoutService from "../../../services/workouts/workout.service";

import ExerciseGroupWrapper from "../exerciseGroups";

class WorkoutWrapper extends BaseWorkout {
    constructor(data) {
        super(data);
    }

    getBasicInfo = () => {
        const {_data} = this;
        const {
            id,
            name,
            care_plan_id,
            start_date,
            end_date,
            total_calories,
            details,
            time,
            expired_on
        } = _data || {};

        return {
            basic_info: {
                id,
                care_plan_id,
                name,
            },
            time,
            start_date,
            end_date,
            total_calories,
            details,
            expired_on
        };
    };

    getAllInfo = () => {
        const {getBasicInfo, getExerciseGroups} = this;

        let exercise_group_ids = [];
        // workout_exercise_group_mapping_ids = [];
        const exerciseMappings = getExerciseGroups() || [];
        if (exerciseMappings.length > 0) {
            // add exercise mapping ids | exercise group ids here
            for (let index = 0; index < exerciseMappings.length; index++) {
                const {
                    id,
                    // workout_exercise_group_mappings: {
                    //   id: workout_exercise_group_mapping_id,
                    // } = {},
                } = exerciseMappings[index] || {};
                exercise_group_ids.push(id);
                // workout_exercise_group_mapping_ids.push(
                //   workout_exercise_group_mapping_id
                // );
            }
        }
        return {
            ...getBasicInfo(),
            exercise_group_ids,
            // workout_exercise_group_mapping_ids,
        };
    };

    getReferenceInfo = async () => {
        const {getId, getAllInfo, getExerciseGroups} = this;

        // let allWorkoutExerciseGroupMappings = {},
        let allExerciseGroups = {},
            allExerciseDetails = {},
            allExercises = {},
            allRepetitions = {};

        const exerciseMappings = getExerciseGroups() || [];
        if (exerciseMappings.length > 0) {
            // add exercise mapping ids | exercise group ids here
            for (let index = 0; index < exerciseMappings.length; index++) {
                const exerciseGroup = await ExerciseGroupWrapper({
                    data: exerciseMappings[index],
                });
                const {
                    // workout_exercise_group_mappings,
                    exercise_groups,
                    exercise_details,
                    exercises,
                    repetitions,
                } = await exerciseGroup.getReferenceInfo();

                allExerciseGroups = {...allExerciseGroups, ...exercise_groups};
                allExerciseDetails = {...allExerciseDetails, ...exercise_details};
                allExercises = {...allExercises, ...exercises};
                allRepetitions = {...allRepetitions, ...repetitions};
                // allWorkoutExerciseGroupMappings = {
                //   ...allWorkoutExerciseGroupMappings,
                //   ...workout_exercise_group_mappings,
                // };
            }
        }


        return {
            workouts: {
                [getId()]: getAllInfo(),
            },
            // workout_exercise_group_mappings: allWorkoutExerciseGroupMappings,
            exercise_groups: allExerciseGroups,
            exercise_details: allExerciseDetails,
            exercises: allExercises,
            repetitions: allRepetitions,
        };
    };
}

export default async ({data = null, id = null}) => {
    if (data) {
        return new WorkoutWrapper(data);
    }
    const workoutService = new WorkoutService();
    const workout = await workoutService.findOne({id});
    return new WorkoutWrapper(workout);
};
