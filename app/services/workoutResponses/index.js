export default class WorkoutResponses {

    constructor(data){
        this._data=data;
    }

    getId = () => {
        return this._data.id;
    }

    getScheduleEventId = () => {
        return this._data.schedule_event_id || null;
    }

    getExerciseGroupId = () => this._data.exercise_group_id;

    getStatus = () => {
        return this._data.status;
    }

}