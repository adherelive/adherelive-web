import { DOCUMENT_PARENT_TYPE } from "../../../../constant";
import BaseDietResponse from "../../../services/dietResponses";
import DietResponsesService from "../../../services/dietResponses/dietResponses.service";
import uploadDocumentsService from "../../../services/uploadDocuments/uploadDocuments.service";

import EventWrapper from "../../common/scheduleEvents";
import DocumentWrapper from "../uploadDocument";

class DietResponseWrapper extends BaseDietResponse {
    constructor(data) {
        super(data);
    }

    getBasicInfo = () => {
        const {_data} = this;
        const {
            id, diet_id, schedule_event_id, status, document_uploaded, response_text, other_details,updatedAt
        } = _data;
        return {
            basic_info: {
                id, diet_id, schedule_event_id
            },
            status, document_uploaded, response_text, other_details,updated_at: updatedAt
        }
    };

    getAllInfo = async () => {
        const {getId, getBasicInfo, isDocumentUploaded} = this;

        let allDocumentIds = [];
        if(isDocumentUploaded()) {
            const allDocuments = await uploadDocumentsService.getAllByData({
                parent_id: getId(),
                parent_type: DOCUMENT_PARENT_TYPE.DIET_RESPONSE
            }) || [];

            for(let index = 0; index < allDocuments.length; index++) {
                const document = await DocumentWrapper(allDocuments[index]);
                allDocumentIds.push(document.getUploadDocumentId());
            }
        }

        return {
            ...getBasicInfo(),
            upload_document_ids: allDocumentIds
        };
    };

    getReferenceInfo = async () => {
        const {getId, isDocumentUploaded, getScheduleEventId, getAllInfo} = this;

        let scheduleEventData = {};
        if(getScheduleEventId()) {
            const scheduleEvent = await EventWrapper(null, getScheduleEventId());
            scheduleEventData[getScheduleEventId()] = scheduleEvent.getAllInfo();
        }

        let allUploadDocuments = {};
        if(isDocumentUploaded()) {
            const allDocuments = await uploadDocumentsService.getAllByData({
                parent_id: getId(),
                parent_type: DOCUMENT_PARENT_TYPE.DIET_RESPONSE
            }) || [];

            for(let index = 0; index < allDocuments.length; index++) {
                const document = await DocumentWrapper(allDocuments[index]);
                allUploadDocuments[document.getUploadDocumentId()] = document.getBasicInfo();
            }
        }

        return {
            diet_responses: {
                [getId()]: await getAllInfo()
            },
            upload_documents: allUploadDocuments,
            schedule_events: scheduleEventData,
            diet_response_id: getId()
        }
    };
}

export default async ({data = null, id = null}) => {
    if(data) {
        return new DietResponseWrapper(data);
    }
    const dietResponseService = new DietResponsesService();
    const dietResponse = await dietResponseService.findOne({id});
    return new DietResponseWrapper(dietResponse);
};