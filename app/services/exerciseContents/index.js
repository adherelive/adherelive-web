export default class ExerciseContent {
  constructor(data) {
    this._data = data;
  }
  
  getId = () => this._data.id;
  
  getExerciseId = () => this._data.exercise_id;
  
  getVideoType = () => this._data.video_content_type;
  
  getVideo = () => this._data.video_content;
}