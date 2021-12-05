import BaseWorkoutResponse from "../../../services/workoutResponses";
import WorkoutResponseService from "../../../services/workoutResponses/workoutResponses.service";
import ScheduleEventService from "../../../services/scheduleEvents/scheduleEvent.service";
import EventWrapper from "../../common/scheduleEvents";

class WorkoutResponseWrapper extends BaseWorkoutResponse {
  constructor(data) {
    super(data);
  }
  
  getBasicInfo = () => {
    const {_data} = this;
    const {
      id,
      workout_id,
      exercise_group_id,
      schedule_event_id,
      repetition_id,
      repetition_value,
      sets,
      status,
      other_details,
      updatedAt,
    } = _data;
    return {
      basic_info: {
        id,
        workout_id,
        exercise_group_id,
        schedule_event_id,
      },
      repetition_id,
      repetition_value,
      sets,
      status,
      other_details,
      updated_at: updatedAt,
    };
  };
  
  getAllInfo = () => {
    const {getBasicInfo} = this;
    
    // let allDocumentIds = [];
    // if(isDocumentUploaded()) {
    //     const allDocuments = await uploadDocumentsService.getAllByData({
    //         parent_id: getId(),
    //         parent_type: DOCUMENT_PARENT_TYPE.DIET_RESPONSE
    //     }) || [];
    
    //     for(let index = 0; index < allDocuments.length; index++) {
    //         const document = await DocumentWrapper(allDocuments[index]);
    //         allDocumentIds.push(document.getUploadDocumentId());
    //     }
    // }
    
    return {
      ...getBasicInfo(),
      // upload_document_ids: allDocumentIds
    };
  };
  
  getReferenceInfo = async () => {
    const {getId, getScheduleEventId, getAllInfo} = this;
    
    // let scheduleEventData = {};
    // if (!getScheduleEventId()) {
    //   const scheduleEvent = await EventWrapper(null, getScheduleEventId());
    //   scheduleEventData[getScheduleEventId()] = scheduleEvent.getAllInfo();
    // }
    const scheduleEventService = new ScheduleEventService();
    
    let scheduleEventData = {};
    if (getScheduleEventId()) {
      const schduleEventRecord = await scheduleEventService.getEventByData({
        paranoid: false,
        id: getScheduleEventId(),
      });
      if (schduleEventRecord) {
        const scheduleEvent = await EventWrapper(schduleEventRecord);
        scheduleEventData[getScheduleEventId()] = scheduleEvent.getAllInfo();
      }
    }
    
    // let allUploadDocuments = {};
    // if(isDocumentUploaded()) {
    //     const allDocuments = await uploadDocumentsService.getAllByData({
    //         parent_id: getId(),
    //         parent_type: DOCUMENT_PARENT_TYPE.DIET_RESPONSE
    //     }) || [];
    
    //     for(let index = 0; index < allDocuments.length; index++) {
    //         const document = await DocumentWrapper(allDocuments[index]);
    //         allUploadDocuments[document.getUploadDocumentId()] = document.getBasicInfo();
    //     }
    // }
    
    return {
      workout_responses: {
        [getId()]: getAllInfo(),
      },
      // upload_documents: allUploadDocuments,
      schedule_events: scheduleEventData,
      workout_response_id: getId(),
    };
  };
}

export default async ({data = null, id = null}) => {
  if (data) {
    return new WorkoutResponseWrapper(data);
  }
  const workoutResponseService = new WorkoutResponseService();
  const workoutResponse = await workoutResponseService.findOne({id});
  return new WorkoutResponseWrapper(workoutResponse);
};
